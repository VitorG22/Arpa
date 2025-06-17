import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import WrapGallery from "./lines/wrapedGallery";
import ImagesPostLine from "./lines/imagesLine";
import VideosPostLine from "./lines/videosLine";
import { useEffect } from "react";
import { IPost } from "../profile/components/profilePhotos";
import { addToDefaultGallery, addToImageGallery, addToVideoGallery, editImageGallery, editVideoGallery, resetAllGallery } from "../../redux/galleryslice";
import { socket } from "../../scripts/api/socket";


export default function Explore() {
    const { userData } = useSelector((state: RootState) => state.user)
    const { ImagesList,videoList } = useSelector((state: RootState) => state.gallery)
    const { type } = useParams()
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(resetAllGallery())
        getPostByType('all', (res) => {dispatch(addToDefaultGallery(res))})
        getPostByType('video', (res)=>{dispatch(addToVideoGallery(res))})
        getPostByType('carrousel', (res)=>{dispatch(addToImageGallery(res))})
    }, [])

    const getPostByType = async (type: string, callback: (res: IPost[]) => void) => {
        socket.emit('getPostByType', {
            type: type,
            requesterToken: userData.token
        },(res:any)=>{
            if (res.status == 200) { callback(res.data) }
        })
    }

const editeImageList = (newPostData:IPost) =>{
    dispatch(editImageGallery(newPostData))
}
const editeVideoList = (newPostData:IPost) =>{
    dispatch(editVideoGallery(newPostData))
}

    return (
        <main>
            {!type && <WrapGallery key='wrapGallery'/>}
            {type == 'image' && <ImagesPostLine key='imagePostLine' setImageList={editeImageList}  imagesList={ImagesList}/>}
            {type == 'video' && <VideosPostLine key='videoPostLine' setVideoList={editeVideoList} videoList={videoList} />}
        </main>
    )
}