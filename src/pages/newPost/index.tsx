import { useRef, useState } from "react";
import { NewPostButtonsContainer } from "./newPostButtons";
import { Plus, X } from "lucide-react";
import Text from "../../components/texts";
import ButtonPrimary from "../../components/buttons";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { socket } from "../../scripts/api/socket";
import Loader from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";

export default function NewPost() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [imagesListInBase64, setImagesListInBase64] = useState<string[]>([])
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [showTypeinputValue, setShowTypeinputValue] = useState<'all'|'nobody'|'followers'>('all')  
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleDeleteItems = (itemIndex: number) => {
        let newList = [...imagesListInBase64]
        newList.splice(itemIndex, 1)
        setImagesListInBase64(newList)
    }

    const handleSubmiteNewPost = (e: React.FormEvent<HTMLFormElement>) => {
        setErrorMessage(null)
        setIsLoading(true)
        e.preventDefault()
        let type = 'carrousel'
        if (imagesListInBase64.length <= 0) return


        if (imagesListInBase64.length > 1) { type = 'carrousel' }
        else if (imagesListInBase64[0].startsWith("data:video")) {
            type = 'video'
        }

        socket.emit('newPost', {
            userToken: userData.token,
            encodedImagesList: imagesListInBase64,
            description: textAreaRef.current?.value.trim() || "",
            type: type,
            showType: showTypeinputValue
        }, (res: { status: number, ErrorMessage?: string | null }) => {
            if (res.status == 200) { resetFormData(); navigate('/home') }
            else { setErrorMessage(res.ErrorMessage || null) }
            setIsLoading(false)
        }
        )


    }

    const resetFormData = () => {
        if (textAreaRef.current) { textAreaRef.current.value = '' }
        setImagesListInBase64([])
    }



    return (
        <form onSubmit={(e) => { handleSubmiteNewPost(e) }} className='relative flex flex-col gap-4 pb-10 h-full w-full items-center px-4'>
            {isLoading && <div className='flex absolute h-dvh w-dvw top-0 left-0 z-50 justify-center items-center bg-neutral-900/80'><Loader /></div>}
            <section className='flex flex-col h-3/6 py-4 gap-2 w-full'>
                <Text size="small" variant="secondary" weight="normal" className='ml-4'>Posts</Text>
                <ul className='flex flex-row gap-4 h-full hiddenScroll overflow-x-scroll'>

                    {imagesListInBase64 != undefined &&
                        imagesListInBase64.map((dataElement, index) =>
                            <li className='relative h-full aspect-[3/4]'>
                                <button type="button" onClick={() => handleDeleteItems(index)} className='flex flex-row items-center gap-2 top-4 right-4 absolute z-10 bg-neutral-950/40 text-neutral-50 px-4 py-2 rounded-full text-xs font-normal'>
                                    Delete
                                    <X size={15} strokeWidth={1} />
                                </button>
                                {dataElement.startsWith("data:image") ?
                                    <img key={`imageComponent_${index}`} src={dataElement}
                                        className='w-full aspect-[3/4] object-cover'
                                    /> :
                                    <video autoPlay loop muted key={`imageComponent_${index}`} className='w-full aspect-[3/4] object-cover'>
                                        <source src={dataElement} />
                                    </video>
                                }
                            </li>
                        )
                    }
                    <NewPostButtonsContainer imagesListInBase64={imagesListInBase64} setImagesListInBase64={setImagesListInBase64} >
                        <li className='flex  justify-center items-center h-full aspect-[3/4] bg-neutral-800/40 text-neutral-50 '>
                            <Plus size={40} strokeWidth={1} />
                        </li>
                    </NewPostButtonsContainer>
                </ul>
            </section>
            <div className='flex flex-row items-center w-full gap-2'>
                <Text size="small" variant="secondary" weight="normal">Visible To: </Text>
                <ul className='flex flex-row gap-2 text-purple-500'>
                    <li className='relative w-fit h-fit group'>
                        <input onChange={()=> setShowTypeinputValue('all')} type="radio" value='All' name='showTypeRadioValue' defaultChecked={true}
                            className="absolute w-full h-full opacity-0"
                        />
                        <Text size="small" variant="purple" weight="normal" className='px-3 py-1 group-has-checked:bg-purple-500 group-has-checked:text-neutral-50'>All</Text>
                    </li>
                    <li className='relative w-fit h-fit group'>
                        <input onChange={()=> setShowTypeinputValue('followers')} type="radio" value='Followers' name='showTypeRadioValue'
                            className="absolute w-full h-full opacity-0"
                        />
                        <Text size="small" variant="purple" weight="normal" className='px-3 py-1 group-has-checked:bg-purple-500 group-has-checked:text-neutral-50'>Followers</Text>
                    </li>
                    <li className='relative w-fit h-fit group'>
                        <input onChange={()=> setShowTypeinputValue('nobody')} type="radio" value='Nobody' name='showTypeRadioValue'
                            className="absolute w-full h-full opacity-0"
                        />
                        <Text size="small" variant="purple" weight="normal" className='px-3 py-1 group-has-checked:bg-purple-500 group-has-checked:text-neutral-50'>Nobody</Text>
                    </li>
                </ul>
            </div>
            <article className='flex flex-col w-full'>
                <Text size="small" variant="secondary" weight="normal">Description</Text>
                <textarea ref={textAreaRef} className='text-neutral-50 outline-none py-1 px-2 h-40 bg-neutral-800/40 w-full'></textarea>
            </article>
            <ButtonPrimary disabled={imagesListInBase64.length <= 0} type="submit" className='w-full disabled:opacity-30 disabled:scale-95 duration-300 ease-in-out'>Post</ButtonPrimary>
            {errorMessage && <Text size="small" variant="default" weight="normal" className='text-red-500 bg-red-500/10 px-4 py-2 rounded-md'>{errorMessage}</Text>}
        </form>
    )
}