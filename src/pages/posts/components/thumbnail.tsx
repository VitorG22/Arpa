import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { IPost } from "../../profile/components/profilePhotos"
import { BringToFront, HeartIcon } from "lucide-react"
import Loader from "../../../components/loader/loader"
import { useEffect, useState } from "react"
import { socket } from "../../../scripts/api/socket"
import { useNavigate } from "react-router-dom"

export default function Thumbnail({ postData }: { postData: IPost }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [postContentList, setPostContentList] = useState<Array<{ imageData: string }>>([])
    const navigate = useNavigate()

    useEffect(() => {
        socket.emit("getPostImage", { groupId: postData.id, requesterToken: userData.token },
            (res: { status: number, data: Array<{ imageData: string }> }) => {

                if (res.status == 200) {
                    setPostContentList(res.data)
                }
            })
    }, [])

    const redirect = () => {
        switch (postData.type) {
            case "video":
                navigate(`/explore/video/${postData.id}`)
                break
            case "carrousel":
                navigate(`/explore/image/${postData.id}`)
                break
        }
    }

    return (
        <li className='w-1/3 p-0.5 relative ' onClick={redirect}>
            {postData &&
                <>
                    {postContentList.length > 0 ?
                        (postContentList[0].imageData.startsWith('data:image') ?
                            <>
                                <img src={postContentList[0].imageData} alt="" className='aspect-[3/5] w-full object-cover ' />

                            </>
                            :
                            <>
                                <video autoPlay muted loop className='aspect-[3/5] w-full object-cover' >
                                    <source src={postContentList[0].imageData} />
                                </video>

                            </>
                        ) :
                        <div className='aspect-[3/5] w-full flex items-center justify-center bg-neutral-800/10'>
                            <Loader />
                        </div>

                    }
                    <div className='bg-radial from-transparent via-transparent to-neutral-900/80 h-full w-full absolute top-0 left-0 '/>
                    {postContentList.length > 1 &&
                    <div className='absolute top-0 right-0 text-neutral-50 bg-gradient-to-bl p-2 rounded-sm'>
                        <BringToFront size={15} strokeWidth={1}  />
                    </div>
                    }
                    <div className="flex flex-row gap-1 items-center justify-center absolute bottom-0 left-0 text-neutral-50  py-1 px-2 rounded-sm">
                        <HeartIcon size={10} />
                        <p className='text-xs font-thin'>{postData.likesCount}</p>
                    </div>
                </>
            }
        </li>
    )
}