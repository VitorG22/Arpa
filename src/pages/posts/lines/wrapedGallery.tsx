import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { useRef } from "react"
import Thumbnail from "../components/thumbnail"

export default function WrapGallery() {
    const { defaultList } = useSelector((state: RootState) => state.gallery)
    const listRef = useRef<HTMLUListElement>(null)

    return (
        <main>
            <ul ref={listRef} className='flex flex-row flex-wrap'>
                {defaultList.map((postData) =>
                    <Thumbnail key={`image_${postData.id}`} postData={postData} />
                )}
            </ul>
        </main>
    )
}