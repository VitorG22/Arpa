import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"
import { IPost } from "../../profile/components/profilePhotos"
import { useState } from "react"
import Text from "../../../components/texts"
import { Bookmark, EllipsisVerticalIcon, Eye, EyeClosed, EyeOff, Trash } from "lucide-react"
import { socket } from "../../../scripts/api/socket"

export default function PostOptionsButton({ postData, deleteFromImageList }: { postData: IPost, deleteFromImageList?: (postData: IPost) => void }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false)

    const deletePost = () => {
        socket.emit('deletePost', {
            token: userData.token,
            postId: postData.id
        }, (res: { status: number }) => {
            if (res.status == 200 && deleteFromImageList) {
                deleteFromImageList(postData)
            }
        })

    }

    const changeShowType = (showType: 'all' | 'followers' | 'nobody') => {
        socket.emit('changePostShowType', {
            token: userData.token,
            postId: postData.id,
            showType: showType
        }, (res: { status: number, error?: string }) => { console.log(res) })
    }


    return (
        <main className='absolute text-neutral-50 right-4 z-40'>
            <button onClick={() => setIsOptionOpen(!isOptionOpen)} className='hover:cursor-pointer active:bg-neutral-800 p-1 rounded-full'><EllipsisVerticalIcon size={25} strokeWidth={1} fill="#fff" /></button>
            {isOptionOpen &&
                <section className="flex flex-col  w-fit  absolute right-0 top-[100%] space-x-1 bg-neutral-950 border border-neutral-800 divide-neutral-800 divide-y rounded-sm overflow-hidden">
                    <button className='flex flex-row gap-2 items-center w-full text-start pl-4 pr-16 py-2 text-nowrap hover:cursor-pointer   active:bg-amber-500/30 ease-in-out duration-150'><Bookmark color='oklch(0.828 0.189 84.429)' strokeWidth={1} /><Text size="small" variant="secondary" weight="normal"><p className='text-amber-400'>Mark as favorite</p></Text></button>
                    {postData.post_owner.id == userData.id &&
                        <>
                            <button onClick={() => changeShowType("followers")} className='flex flex-row gap-2 items-center w-full text-start pl-4 pr-16 py-2 text-nowrap hover:cursor-pointer  active:bg-neutral-800 ease-in-out duration-150'><EyeOff strokeWidth={1} /><Text size="small" variant="default" weight="normal">Hide for non-followers </Text></button>
                            <button onClick={() => changeShowType("nobody")} className='flex flex-row gap-2 items-center w-full text-start pl-4 pr-16 py-2 text-nowrap hover:cursor-pointer  active:bg-neutral-800 ease-in-out duration-150'><EyeClosed strokeWidth={1} /><Text size="small" variant="default" weight="normal">Hide from everyone </Text></button>
                            <button onClick={() => changeShowType("all")} className='flex flex-row gap-2 items-center w-full text-start pl-4 pr-16 py-2 text-nowrap hover:cursor-pointer  active:bg-neutral-800 ease-in-out duration-150'><Eye strokeWidth={1} /><Text size="small" variant="default" weight="normal">Don't hide </Text></button>
                            <button onClick={() => deletePost()} className='flex flex-row gap-2 items-center w-full text-start pl-4 pr-16 py-2 text-nowrap hover:cursor-pointer  active:bg-red-500/30 ease-in-out duration-150'><Trash color="#fb2c36" strokeWidth={1} /><Text size="small" variant="secondary" weight="normal" className='text-red-500'>Delete</Text></button>
                        </>
                    }

                </section>
            }
        </main>
    )
}

