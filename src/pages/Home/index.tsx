import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { socket } from "../../scripts/api/socket";
import InfoBarTop from "./infoBarTop";
import { IPost } from "../profile/components/profilePhotos";
import { useEffect, useRef, useState } from "react";
import Text from "../../components/texts";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Skeleton from "../../components/loader/skeleton";
import ImagePostComponent from "../posts/components/image";


export function Home() {

    return (
        <main className='flex flex-col h-full'>
            <InfoBarTop />
            <section className='h-full  overflow-y-scroll'>
                <HomeMidiaELement />
            </section>
        </main>
    )
}

function HomeMidiaELement() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [postsList, setPostsList] = useState<IPost[]>([])

    useEffect(() => {
        socket.emit('getPostByType', {
            requesterToken: userData.token,
            type: 'all'
        }, (res: { status: number, data: IPost[] }) => {
            if (res.status == 200) { setPostsList(res.data) }
        })
    }, [])

    const editPostList = (postData: IPost) => {
        setPostsList(postsList.map((element) => element.id == postData.id ? postData : element))
    }
    
    const deleteFromPostList = (postData:IPost)=>{
        let newPostList = [...postsList]
        let indexToDelete = postsList.findIndex(element => element.id == postData.id)
        newPostList.splice(indexToDelete,1)
        setPostsList(newPostList)
    }

    return (
        <>
            <ul className='flex flex-col gap-4hover:cursor-pointer'>
                {postsList.map(postData =>
                    <li><ImagePostComponent postData={postData} deleteFromImageList={deleteFromPostList} setImageList={editPostList} /></li>
                )}
            </ul>
        </>
    )
}

export function MidiaComponent({ postData, setImageList }: { postData: IPost, setImageList: (newPostData: IPost) => void }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [midia, setMidia] = useState<Array<{ imageData: string }>>([])
    const navigate = useNavigate()
    const carrouselref = useRef<HTMLUListElement>(null)
    const [carrouselPosition, setCarrouselPosition] = useState<number>(0)

    useEffect(() => {
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
            setImageList(newPostData)
        })
    }


    const ScrollCarrousel = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
        let scrollWidth = e.currentTarget.scrollWidth
        let scrollDistance = e.currentTarget.scrollLeft

        let imageWidthInScroll = scrollWidth / midia.length
        let carrouselScrollPosition = Math.ceil(scrollDistance / imageWidthInScroll)

        setCarrouselPosition(carrouselScrollPosition)
    }

    return (
        <section className='w-full'>
            <div id='userCard' className='flex flex-row items-center gap-2 p-1 hover:cursor-pointer' onClick={() => navigate(`/user/${postData.post_owner.id}`)}>
                <img src={postData.post_owner.picture} className='rounded-full w-10 aspect-square' />
                <Text size="small" variant="default" weight="normal">{postData.post_owner.userName}</Text>
            </div>
            <section className='relative flex justify-center'>
                <ul ref={carrouselref} onScroll={(e) => ScrollCarrousel(e)} className=' flex flex-row w-full overflow-x-scroll snap-mandatory snap-x hiddenScroll'>
                    {midia.length > 0 ? (
                        midia.map((midiaData) =>
                            midiaData.imageData.startsWith('data:image') ?
                                <li className='min-w-full snap-center'>
                                    <img src={midiaData.imageData}
                                        className='w-full aspect-square object-cover' />
                                </li> :
                                <li className='min-w-full snap-center'>
                                    <video src={midiaData.imageData}
                                        className='w-full aspect-square object-cover' />
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
                <button onClick={handleLikeSwitch} className='p-2 hover:cursor-pointer'>
                    {postData.liked_post_id[0] && postData.liked_post_id[0]?.Id != '' ?
                        <Heart size={25} strokeWidth={1} fill='#fb2c36' color='#fb2c36' /> :
                        <Heart size={25} strokeWidth={1} />

                    }
                </button>
                <button className='p-2  hover:cursor-pointer'><MessageCircle size={25} strokeWidth={1} /></button>
            </div>
            <article className='ml-2 flex flex-row gap-1'>
                {postData.description && <>
                    <Text size="small" variant="secondary" weight="normal">{postData.post_owner.userName}:</Text>
                    <Text size="small" variant="secondary" weight="thin">{postData.description}</Text>
                </>
                }
            </article>
        </section>
    )
}