import { IPost } from "../../profile/components/profilePhotos"
import VideoPostComponent from "../components/video"

export default function VideoPostLine({ videoList, setVideoList }: { videoList: IPost[], setVideoList: (PostData: IPost) => void }) {

    return (
        <main>
            <ul className='flex flex-col max-h-dvh  overflow-y-scroll snap-mandatory snap-y'>
                {videoList.map((postData) =>
                    <li className='snap-center'><VideoPostComponent key={postData.id} postData={postData} setVideoList={setVideoList} /></li>
                )}
            </ul>
        </main>
    )
}
