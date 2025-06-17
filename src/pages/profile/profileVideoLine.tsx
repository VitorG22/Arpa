import { useEffect, useState } from "react";
import { IPost } from "./components/profilePhotos";
import { socket } from "../../scripts/api/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import VideoPostLine from "../posts/lines/videosLine";

export default function ProfileVideoLine({ setPageToShow }: { setPageToShow: React.Dispatch<React.SetStateAction<"default" | 'imageLine' | "videoLine">> }) {
    const { profileId } = useParams()
    const { userData } = useSelector((state: RootState) => state.user)
    const [videosList, setVideosList] = useState<IPost[]>([])

    useEffect(() => {
        socket.emit('getUserPostList', {
            postsOwnerId: profileId,
            requesterToken: userData.token
        },
            (res: { status: 200, data: IPost[] }) => {
                if (res.status == 200) {
                    setVideosList(res.data.filter(postData => postData.type == 'video'))
                }
            })
    }, [])

    const editeVideoList = (postData: IPost) => {
        let newImageList = videosList.map(element => element.id == postData.id ? postData : element)
        setVideosList(newImageList)
    }
    return (
        <div className='relative h-full '>
            <div className='top-0 left-0 z-60 p-2 w-full bg-gradient-to-b from-black/40  to-transparent text-neutral-50 fixed'>
                <ArrowLeft size={20} strokeWidth={1} className=' h-8 w-8'  onClick={() => setPageToShow('default')}/>
            </div>
            <VideoPostLine videoList={videosList} setVideoList={editeVideoList} />
        </div>
    )
}