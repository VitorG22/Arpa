import { useSelector } from "react-redux"
import Text from "../../../components/texts"
import { socket } from "../../../scripts/api/socket"
import PostOptionsButton from "./postOptionsButton"
import { RootState } from "../../../redux/store"
import { IPost } from "../../profile/components/profilePhotos"
import { useEffect, useRef, useState } from "react"
import { Heart, MessageCircle } from "lucide-react"
import Skeleton from "../../../components/loader/skeleton"
import { useNavigate } from "react-router-dom"
import CommentsContainer from "./commentsContainer"

export default function ImagePostComponent({ postData, setImageList, deleteFromImageList }: { postData: IPost, setImageList: (newPostData: IPost) => void, deleteFromImageList?:(postData:IPost)=>void }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [midia, setMidia] = useState<Array<{ imageData: string }>>([])
    const navigate = useNavigate()
    const carrouselref = useRef<HTMLUListElement>(null)
    const [carrouselPosition, setCarrouselPosition] = useState<number>(0)
    const [isToFillHeartIcon, setIsToFillHeartIcon] = useState<boolean>(postData.liked_post_id[0] && postData.liked_post_id[0]?.Id != '')
    const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false)

    useEffect(() => {
        socket.emit("getPostImage", { groupId: postData.id, requesterToken: userData.token },
            (res: { status: number, data: Array<{ imageData: string }> }) => {
                if (res.status == 200) setMidia(res.data)
            }
        )
    }, [])

    const handleLikeSwitch = () => {
        setIsToFillHeartIcon(!isToFillHeartIcon)
        socket.emit('switchLikeInPost', {
            requesterToken: userData.token,
            likeStatus: !!postData.liked_post_id?.[0]?.Id,
            postId: postData.id,
            likeId: postData.liked_post_id?.[0]?.Id || ''
        }, (res: { status: number, data: { Id: string } }) => {
            if (res.status == 200) {
                let newPostData = { ...postData, liked_post_id: [res.data] }
                setImageList(newPostData)
                setIsToFillHeartIcon(newPostData.liked_post_id[0] && newPostData.liked_post_id[0]?.Id != '')
            } else {
                setIsToFillHeartIcon(postData.liked_post_id[0] && postData.liked_post_id[0]?.Id != '')
            }
        })
    }

    const ScrollCarrousel = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
        let scrollWidth = e.currentTarget.scrollWidth
        let scrollDistance = e.currentTarget.scrollLeft

        let imageWidthInScroll = scrollWidth / midia.length
        let carrouselScrollPosition = Math.ceil((scrollDistance - imageWidthInScroll / 2) / imageWidthInScroll)

        setCarrouselPosition(carrouselScrollPosition)
    }


    return (

        <section className='w-full'>
            <div id='userCard' className='relative flex flex-row w-full justify-start items-center gap-2 p-1'>
                <article className="flex flex-row items-center gap-2 ml-1" onClick={() => navigate(`/user/${postData.post_owner.id}`)}>
                    <img src={postData.post_owner.picture} className='rounded-full w-8 aspect-square' />
                    <Text size="small" variant="default" weight="normal">{postData.post_owner.userName}</Text>
                </article>
                <PostOptionsButton postData={postData} deleteFromImageList={deleteFromImageList}  />
            </div>
            <section className='relative flex justify-center'>
                <ul ref={carrouselref} onScroll={(e) => ScrollCarrousel(e)} className='flex flex-row w-full overflow-x-scroll snap-mandatory snap-x hiddenScroll'>
                    {midia.length > 0 ? (
                        midia.map((midiaData) =>
                            <li className='flex justify-center min-w-[100vw] max-h-[70dvh] snap-center overflow-hidden'>
                                <div className='w-[95%] rounded-lg overflow-hidden h-full'>
                                    {(midiaData.imageData.startsWith('data:image') ?
                                        <>
                                            <img src={midiaData.imageData} className='w-full h-full object-cover' />
                                        </>
                                        :
                                        <>
                                            <video autoPlay muted loop className='w-full h-full object-cover' >
                                                <source src={midiaData.imageData} />
                                            </video>
                                        </>
                                    )}
                                </div>
                            </li>
                        )
                    ) :
                        <div className='w-full aspect-square object-cover flex justify-center items-center'><Skeleton /></div>
                    }
                </ul>
                {midia.length > 1 &&
                    <div className='absolute flex flex-row gap-1 bottom-1 px-4 py-2 rounded-full  text-neutral-50'>
                        {midia.map((element, index) =>
                            <div className={`h-2 aspect-square rounded-full ${carrouselPosition == index ? 'bg-neutral-50' : 'bg-neutral-50/20'}`} />
                        )}
                    </div>
                }
            </section>
            <div className='flex flex-row w-fit text-neutral-50' >
                <button onClick={handleLikeSwitch} className='p-2 ml-1'> 
                    {isToFillHeartIcon ?
                        <Heart size={25} strokeWidth={1} fill='#fb2c36' color='#fb2c36' /> :
                        <Heart size={25} strokeWidth={1} />
                    }
                </button>
                <button className='p-2' onClick={() => setIsCommentsOpen(!isCommentsOpen)}><MessageCircle size={25} strokeWidth={1} />
                </button>
            </div>
            <article className='ml-2'>
                <Text size="small" variant="secondary" weight="normal">{postData.description}</Text>
            </article>
            {isCommentsOpen &&
                <CommentsContainer postData={postData} setIsCommentsOpen={setIsCommentsOpen} key={`comment_container_for_${postData.id}`} setImageList={setImageList}/>
            }
        </section>
    )
}
