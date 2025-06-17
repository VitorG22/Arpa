import { IPost } from "../../profile/components/profilePhotos"
import ImagePostComponent from "../components/image"


export default function ImagePostLine({ imagesList, setImageList, deleteFromImageList }: { imagesList: IPost[], setImageList: (newPostData: IPost) => void ,deleteFromImageList?:(postData:IPost)=>void}) {

    return (
        <main className=" h-full overflow-scroll">
            <ul className='flex flex-col gap-2 pt-10 '>
                {imagesList.map((postData) =>
                    <li key={`imageListElementId_${postData.id}`}><ImagePostComponent deleteFromImageList={deleteFromImageList} key={`ImagePostComponent_${postData.id}`} postData={postData} setImageList={setImageList} /></li>
                )}
            </ul>
        </main>
    )
}
