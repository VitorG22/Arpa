import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { IPost } from "../../profile/components/profilePhotos"
import { useEffect, useState } from "react"
import { socket } from "../../../scripts/api/socket"
import Text from "../../../components/texts"
import { Heart, MessageCircle } from "lucide-react"
import Skeleton from "../../../components/loader/skeleton"

export default function VideoPostComponent({ postData, setVideoList }: { postData: IPost, setVideoList: (newPostData: IPost) => void }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [midia, setMidia] = useState<Array<{ imageData: string }>>([])

    useEffect(() => {
        console.log(postData)
        socket.emit("getPostImage", { groupId: postData.id, requesterToken: userData.token },
            (res: { status: number, data: Array<{ imageData: string }> }) => {
                if (res.status == 200) setMidia(res.data)
            }
        )
    }, [])

    const handleLikeSwitch = () => {
        socket.emit('switchLikeInPost', {
            requesterToken: userData.token,
            likeStatus: !!postData.liked_post_id?.[0]?.Id,
            postId: postData.id,
            likeId: postData.liked_post_id?.[0]?.Id || ''
        }, (res: { status: number, data: { Id: string } }) => {
            let newPostData = { ...postData, liked_post_id: [res.data] }
            setVideoList(newPostData)
            console.log(res)
        })
    }

    return (
        <section className='w-full h-dvh relative'>
            <div id='userCard' className='absolute flex flex-row justify-between w-full items-end gap-2 p-1 z-20 bottom-20 left-0'>
                <div className='flex flex-row gap-2'>
                    <img src={postData.post_owner.picture} className='rounded-full w-12 aspect-square' />
                    <article>
                        <Text size="small" variant="default" weight="normal">{postData.post_owner.userName}</Text>
                        <Text size="small" variant="secondary" weight="normal">{postData.description}</Text>
                    </article>
                </div>
                <div className='flex flex-col items-center w-fit text-neutral-50' >
                    <button onClick={handleLikeSwitch} className='p-2 flex flex-col items-center'>
                        {postData.liked_post_id[0] && postData.liked_post_id[0]?.Id != '' ?
                            <Heart size={30} strokeWidth={1} fill='#fb2c36' color='#fb2c36' /> :
                            <Heart size={30} strokeWidth={1} />

                        }
                        
                        <p className='text-sm text-neutral-50  '>Like</p>
                    </button>
                    <button className='p-2 flex flex-col   items-center'>
                        <MessageCircle size={30} strokeWidth={1} />
                        <p className='text-sm text-neutral-50  '>Com...</p>
                    </button>
                </div>
            </div>
            <div className='absolute flex flex-row w-full overflow-x-scroll snap-mandatory snap-x hiddenScroll h-full z-0'>
                {midia.length > 0 ? (
                    <li className='min-w-full h-full snap-center flex justify-center relative'>
                        <div className='absolute h-full w-full bg-gradient-to-b from-transparent via-transparent to-black/60 top-0 left-0' />
                        <video src={midia[0].imageData} autoPlay={false}
                            className='w-full h-full object-cover bg-radial from-transparent to-black' />
                    </li>
                ) :
                    <div className='w-full aspect-square object-cover flex justify-center items-center'><Skeleton /></div>
                }
            </div>
        </section>
    )
}