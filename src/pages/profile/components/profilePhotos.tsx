import { useEffect, useState } from "react"
import { RootState } from "../../../redux/store"
import { useSelector } from "react-redux"
import { IUser } from "../../../redux/userslice"
import Loader from "../../../components/loader/loader"
import { BringToFront, CameraOffIcon, GridIcon, HeartIcon, PlaySquareIcon } from "lucide-react"
import Text from "../../../components/texts"
import { socket } from "../../../scripts/api/socket"

export interface IPost {
    commented_post_id: Array<{
        comment: string,
        comment_owner: {
            id: string,
            picture: string,
            userName: string
        },
        date: Date,
        id: string
    }>
    date: Date
    description: string
    id: string
    likesCount: number
    post_owner: IUser
    postsList: string[]
    type: "video" | "carrousel"
    liked_post_id: Array<{ Id: string }>
    showType: 'all'|'followers'|'nobody'
}

export default function ProfilePhotos({ profileId, setPageToShow }: { profileId: string, setPageToShow: React.Dispatch<React.SetStateAction<"default" | 'imageLine' | "videoLine">> }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [postList, setPostsList] = useState<IPost[]>([])
    const [postListToShow, setPostListToShow] = useState<'default' | 'video'>('default')
    const [postListToRender, setPostListToRender] = useState<IPost[]>([])

    useEffect(() => {
        socket.emit('getUserPostList', {
            postsOwnerId: profileId,
            requesterToken: userData.token
        }, (res: { status: number, data: IPost[] }) => {
            setPostsList(res.data)
            setPostListToRender(res.data)
        })
    }, [])

    useEffect(() => {
        if (postListToShow == "video") { setPostListToRender(postList.filter((data: { id: string, type: "video" | 'carrousel' }) => data.type == "video")) }
        if (postListToShow == "default") { setPostListToRender([...postList]) }
    }, [postListToShow])

    return (
        <main className='flex flex-col w-full'>
            <section className='flex flex-row  text-neutral-50 items-center justify-between'>
                <button onClick={() => setPostListToShow('default')} style={{ background: postListToShow != 'default' ? 'transparent' : '' }} className='flex justify-center items-center w-full p-2 bg-neutral-950/80 '><GridIcon size={25} strokeWidth={1} /></button>
                <button onClick={() => setPostListToShow('video')} style={{ background: postListToShow != 'video' ? 'transparent' : '' }} className='flex justify-center items-center w-full p-2 bg-neutral-950/80' ><PlaySquareIcon size={25} strokeWidth={1} /></button>
            </section>
            <ul className='w-full flex flex-row flex-wrap justify-start'>
                {postListToRender.length <= 0 ? <div className='w-full flex flex-col items-center text-neutral-400 h-full p-10'>
                    <Text size="small" variant="secondary" weight="normal">No posts available</Text>
                    <CameraOffIcon size={40} strokeWidth={1} />
                </div> :

                    <>
                        {postListToRender.map((postData) =>
                            postData.type == "carrousel" ? (

                                <li className='w-1/3 p-0.5 relative' onClick={() => setPageToShow('imageLine')}>
                                    <ProfilePhotoComponent postData={postData} userToken={userData.token} key={`post_${postData.id}`} />
                                </li>
                            ) : (
                                <li className='w-1/3 p-0.5 relative' onClick={() => setPageToShow('videoLine')}>
                                    <ProfilePhotoComponent postData={postData} userToken={userData.token} key={`post_${postData.id}`} />
                                </li>
                            )

                        )}
                    </>
                }

            </ul>
        </main>
    )
}

export function ProfilePhotoComponent({ postData, userToken }: { postData: IPost, userToken: string | undefined }) {
    if (!postData.id || !userToken) return
    const [imageList, setImageList] = useState<Array<{ imageData: string }>>([])

    useEffect(() => {
        fetchForPostData()
    }, [])

    const fetchForPostData = async () => {
        socket.emit('getPostImage', {
            groupId: postData.id,
            requesterToken: userToken
        }, (res: { status: number, data: Array<{ imageData: string }> }) => {
            if (res.status == 200) {
                setImageList(res.data)
            }
        })
    }

    return (
        
        <>

            {imageList.length > 0 ?
                <>
                    {imageList[0].imageData.startsWith('data:image') ?
                        <>
                            <img src={imageList[0].imageData} alt="" className='aspect-[3/5] w-full object-cover' />
                        </>
                        :
                        <>
                            <video autoPlay muted loop className='aspect-[3/5] w-full object-cover' >
                                <source src={imageList[0].imageData} />
                            </video>

                        </>
                    }
                    {imageList.length > 1 &&
                        <BringToFront size={25} strokeWidth={1} className='absolute top-2 right-2 text-neutral-50 bg-neutral-950/80 p-1 rounded-sm' />
                    }
                    <div className="flex flex-row gap-1 items-center justify-center absolute bottom-2 left-2 text-neutral-50">
                        <HeartIcon size={10} />
                        <p className='text-xs font-thin'>{postData.likesCount}</p>
                    </div>
                </> :
                <div className='aspect-[3/5] w-full flex items-center justify-center bg-neutral-800/10'>
                    <Loader />
                </div>
            }
        </>
        // </li>
    )
}


