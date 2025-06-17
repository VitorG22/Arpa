import { useEffect, useState } from "react";
import ImagePostLine from "../posts/lines/imagesLine";
import { IPost } from "./components/profilePhotos";
import { socket } from "../../scripts/api/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProfileImageLine({ setPageToShow }: { setPageToShow: React.Dispatch<React.SetStateAction<"default" | 'imageLine' | "videoLine">> }) {
    const { profileId } = useParams()
    const { userData } = useSelector((state: RootState) => state.user)
    const [imagesList, setImagesList] = useState<IPost[]>([])

    useEffect(() => {
        socket.emit('getUserPostList', {
            postsOwnerId: profileId,
            requesterToken: userData.token
        },
            (res: { status: 200, data: IPost[] }) => {
                if (res.status == 200) {
                    setImagesList(res.data.filter(postData => postData.type == 'carrousel'))
                }
            })
    }, [])

    const editeImageList = (postData: IPost) => {
        let newImageList = imagesList.map(element => element.id == postData.id ? postData : element)
        setImagesList(newImageList)
    }
    const deleteFromImageList = (postData: IPost) => {
        let newImagesList = [...imagesList] 
        let indexToDelete = imagesList.findIndex(element=>element.id == postData.id)
        
        newImagesList.splice(indexToDelete,1)
        
        setImagesList(newImagesList)
    }

    return (
        <div className='relative h-full'>
            <div className='top-0 left-0 w-full  z-60 p-2 bg-gradient-to-b from-black/40 to-transparent text-neutral-50 fixed'>
                <ArrowLeft size={20} strokeWidth={1} className=' h-8 w-8'  onClick={() => setPageToShow('default')}/>
            </div>
            <ImagePostLine imagesList={imagesList} setImageList={editeImageList} deleteFromImageList={deleteFromImageList}/>
        </div>
    )
}