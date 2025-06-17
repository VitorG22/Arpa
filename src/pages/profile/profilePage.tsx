import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Text from "../../components/texts";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IUser } from "../../redux/userslice";
import ButtonPrimary, { ButtonSecondary } from "../../components/buttons";
import { ArrowLeft, MessageCircle } from "lucide-react";
import ProfileStories from "./components/profileStories";
import ProfilePhotos from "./components/profilePhotos";
import { socket } from "../../scripts/api/socket";
import Skeleton from "../../components/loader/skeleton";

export default function ProfilePage({ setPageToShow }: { setPageToShow: React.Dispatch<React.SetStateAction<"default" | 'imageLine' | "videoLine">> }) {
    const { profileId } = useParams()
    const [profileData, setProfileData] = useState<IUser>()
    const { userData } = useSelector((state: RootState) => state.user)
    const [isFollowButtonDisable, setIsFollowButtonDisable] = useState<boolean>(false)

    useEffect(() => {
        getProfile()
    }, [profileId])

    const getProfile = () => {
        socket.emit('getProfile', {
            profileId: profileId,
            requesterToken: userData.token
        }, (res: { status: number, data: IUser }) => {
            if (res.status == 200) {
                setProfileData(res.data)
            }
        })
    }

    const handleFollow = () => {
        setIsFollowButtonDisable(true)
        try {
            socket.emit('follow', {
                requesterToken: userData.token,
                userToFollowId: profileId
            }, (res: { status: number }) => {
                if (res.status == 200) {
                    getProfile()
                }
                setIsFollowButtonDisable(false)
            })
        } catch (error) {
            setIsFollowButtonDisable(false)
        }

    }

    const handleUnfollow = () => {
        setIsFollowButtonDisable(true)
        try {
            socket.emit('unfollow', {
                requesterToken: userData.token,
                relationId: profileData?.relationId
            }, (res: { status: number }) => {
                if (res.status == 200) {
                    getProfile()
                }
                setIsFollowButtonDisable(false)
            })
        } catch (error) {
            setIsFollowButtonDisable(false)
        }

    }

    const handleRequestToFollow = () => {
        setIsFollowButtonDisable(true)
        try {
            socket.emit('requestFollow', {
                token: userData.token,
                userToFollowId: profileId
            }, ((res: { status: number }) => {
                if (res.status == 200) { getProfile() }
                setIsFollowButtonDisable(false)
            }))
        } catch {
            setIsFollowButtonDisable(false)
        }
    }

    const handleDeleteRequestFollow = (requestFollowId:string| null) => {
        if(!requestFollowId)return
        setIsFollowButtonDisable(true)
        try {
            socket.emit('deleteRequestFollow', {
                token: userData.token,
                followRequestId: requestFollowId
            }, ((res: { status: number }) => {
                if (res.status == 200) { getProfile() }
                setIsFollowButtonDisable(false)
            }))
        } catch {
            setIsFollowButtonDisable(false)
        }
    }

    const handleAcceptFollowRequest = () => {
        setIsFollowButtonDisable(true)
        try {
            socket.emit('acceptRequestFollow', {
                token: userData.token,
                followRequestId: profileData?.requestFollow.byOther
            }, ((res: { status: number }) => {
                if (res.status == 200) { getProfile() }
                setIsFollowButtonDisable(false)
            }))
        } catch {
            setIsFollowButtonDisable(false)
        }
    }



    return (
        <main key={profileId} className='relative flex min-h-full w-full hiddenScroll'>
            <button onClick={() => history.back()} className='absolute top-4 left-2 text-neutral-50  p-2'><ArrowLeft size={30} strokeWidth={1} /></button>
            {profileData ? (
                <section className='flex flex-col items-center w-full gap-4'>
                    <img src={profileData.picture} className='h-30 aspect-square rounded-full border-8 border-neutral-900' />
                    <article className='text-center'>
                        <Text size="large" variant="default" weight="normal" className='flex flex-row items-center relative'>
                            {profileData.online && profileData.id != userData.id && <div className='h-2 aspect-square bg-green-500 rounded-full absolute -left-4' />}
                            {profileData.name}
                        </Text>
                        <Text size="small" variant="default" weight="thin">{profileData.userName}</Text>
                    </article>
                    <ul className="flex flex-row justify-between w-10/12 *:w-1/4 ">
                        <li className='flex flex-col items-center'>
                            <Text size="small" variant="default" weight="thin">Posts</Text>
                            <Text size="medium" variant="default" weight="bold">{profileData.Posts}</Text>
                        </li>
                        <li className='flex flex-col items-center'>
                            <Text size="small" variant="default" weight="thin">Followers</Text>
                            <Text size="medium" variant="default" weight="bold">{profileData.followers}</Text>
                        </li>
                        <li className='flex flex-col items-center'>
                            <Text size="small" variant="default" weight="thin">Following</Text>
                            <Text size="medium" variant="default" weight="bold">{profileData.following}</Text>
                        </li>
                    </ul>
                    <Text size="small" variant="default" weight="thin" className='text-center'>{profileData.biography}</Text>

                    <div className='flex flex-row flex-wrap justify-center gap-2  w-11/12'>
                        {profileData.id == userData.id ?
                            <Link to='/user/editProfile' className='flex flex-row items-center justify-center gap-1  w-full py-2 text-neutral-400 bg-neutral-800 rounded-lg'>
                                <Text size="small" variant="secondary" weight="normal">Edit Profile</Text>
                            </Link> :
                            <>
                                {profileData.follow == false ?
                                    (
                                        profileData.privateProfile == true ? (<>
                                            {profileData.requestFollow.byYou ?
                                                <button disabled={isFollowButtonDisable} onClick={() => handleDeleteRequestFollow(profileData.requestFollow.byYou)} className='w-full disabled:opacity-50 disabled:size[90%] duration-300 ease-in-out hover:cursor-pointer flex flex-row items-center justify-center gap-1 py-3 text-neutral-400 bg-neutral-800 rounded-lg'>
                                                    Cancel Request Follow
                                                </button> :
                                                <ButtonPrimary disabled={isFollowButtonDisable} onClick={() => handleRequestToFollow()} className='w-full disabled:opacity-50 disabled:size[90%] duration-300 ease-in-out hover:cursor-pointer'>
                                                    Request Follow
                                                </ButtonPrimary>}
                                        </>) : (
                                            <ButtonPrimary disabled={isFollowButtonDisable} onClick={() => handleFollow()} className='w-full disabled:opacity-50 disabled:size[90%] duration-300 ease-in-out hover:cursor-pointer'>
                                                Follow
                                            </ButtonPrimary>)
                                    ) :
                                    <button disabled={isFollowButtonDisable} onClick={() => handleUnfollow()} className='flex flex-row items-center justify-center gap-1  w-full py-2 text-neutral-400 bg-neutral-800 rounded-lg disabled:opacity-50 disabled:size[90%] duration-300 ease-in-out hover:cursor-pointer'>
                                        Unfollow
                                    </button>
                                }
                                {profileData.requestFollow.byOther && (
                                    <div className='w-full gap-2 flex flex-row'>
                                        <ButtonPrimary disabled={isFollowButtonDisable} onClick={() => handleAcceptFollowRequest()} className='w-1/2 disabled:opacity-50 disabled:size[90%] duration-300 ease-in-out hover:cursor-pointer'>
                                            Accept
                                        </ButtonPrimary>
                                        <button disabled={isFollowButtonDisable} onClick={() => handleDeleteRequestFollow(profileData.requestFollow.byOther)} className='w-1/2 disabled:opacity-50 disabled:size[90%] duration-300 ease-in-out hover:cursor-pointer flex flex-row items-center justify-center gap-1 py-3 text-neutral-400 bg-neutral-800 rounded-lg'>
                                            <Text size="small" variant="secondary" weight="normal">Decline</Text>
                                        </button>
                                    </div>
                                )}
                                {!profileData.privateProfile &&
                                    <ButtonSecondary className='w-full h-12  flex flex-row gap-2'>
                                        Message
                                        <MessageCircle size={18} strokeWidth={1} fill="#ad46ff" />
                                    </ButtonSecondary>}
                            </>
                        }
                    </div>
                    {/* <ProfileStories profileId={profileData.id} /> */}
                    <ProfilePhotos profileId={profileData.id} setPageToShow={setPageToShow} />
                </section>)
                : (
                    <div className='flex h-full w-full items-center justify-center place-self-center'>
                        <Skeleton />
                    </div>
                )
            }
        </main>
    )
}