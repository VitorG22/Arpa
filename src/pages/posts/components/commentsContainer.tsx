import { ChevronDown, SendIcon } from "lucide-react";
import ButtonPrimary from "../../../components/buttons";
import TextInput from "../../../components/inputs/text";
import Text from "../../../components/texts";
import { socket } from "../../../scripts/api/socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import getformValues from "../../../scripts/form/getvalues";
import { IPost } from "../../profile/components/profilePhotos";
import { useState } from "react";

export default function CommentsContainer({ setImageList, postData, setIsCommentsOpen }: { postData: IPost, setIsCommentsOpen: React.Dispatch<React.SetStateAction<boolean>>, setImageList: (newPostData: IPost) => void }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [inputValue, setInputValue] = useState<string>('')

    const sendComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let { commentData } = getformValues(e)

        socket.emit('sendComment', {
            postId: postData.id,
            commentOwnerToken: userData.token,
            commentData: commentData
        }, (res: { status: number, data: IPost, error?: string }) => {
            if (res.status == 200) {
                setImageList(res.data)
                setInputValue('')
            }
        })
    }

    return (
        <section className=' fixed bottom-0 h-full w-full z-50 flex flex-col justify-end'>
            <div id='close_comments_container' className='absolute h-full w-full  z-40' onClick={() => setIsCommentsOpen(false)} />
            <div className=' flex flex-col justify-between z-50 h-3/5 w-full rounded-t-2xl p-4 bg-neutral-950/95 gap-2 backdrop-blur-xs'>
            <div className='text-neutral-50 flex flex-row w-full justify-between items-center'>
                <Text size="small" variant="secondary" weight="normal" className='italic'>Comments</Text>
                <ChevronDown strokeWidth={1} onClick={()=> setIsCommentsOpen(false)}/>
            </div>
                <ul className='flex flex-col h-full overflow-scroll pb-6 gap-2'>
                    {postData.commented_post_id.length > 0 ? (
                        postData.commented_post_id.map((commentData) =>
                            <CommentComponent commentData={commentData} key={`commentComponentKey_${commentData.id}`} />
                        )
                    ) : (
                        <Text size="small" variant="secondary" weight="normal" className="place-self-center ">Be the first to comment</Text>
                    )
                    }
                </ul>
                <form onSubmit={(e) => sendComment(e)} className='flex flex-row gap-2 justify-center'>
                    <TextInput className="w-full" name='commentData' onChange={(e)=>setInputValue(e.target.value)} value={inputValue}/>
                    <ButtonPrimary type="submit" className='px-4 h-full text-neutral-900 '>
                        <SendIcon strokeWidth={1} />
                    </ButtonPrimary>
                </form>
            </div>
        </section>
    )
}

function CommentComponent({ commentData }: { commentData: { comment: string, comment_owner: { id: string, picture: string, userName: string }, date: Date, id: string } }) {
    return (
        <li className='flex flex-col gap-2'>
            <div className="text-neutral-50 flex flex-row gap-2 items-start">
                <img src={commentData.comment_owner.picture}
                    className='h-9 aspect-square rounded-full'
                />
                <article>
                    <Text size="small" variant="secondary" weight="normal" className='text-xs'>{commentData.comment_owner.userName}</Text>
                    <Text size="small" variant="default" weight="normal" className='ml-4'>
                        {commentData.comment}
                    </Text>
                </article>
            </div>
            <hr className="w-4/5 h-[1px] self-center bg-neutral-400/30" />
        </li>
    )
}
