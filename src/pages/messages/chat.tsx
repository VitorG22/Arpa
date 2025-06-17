import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../redux/store"
import { ImgHTMLAttributes, useEffect, useRef, useState } from "react"
import Loader from "../../components/loader/loader"
import { IMessage } from "../../redux/contactsSlice"
import Text from "../../components/texts"
import { IUser } from "../../redux/userslice"
import { useSelector } from "react-redux"
import TextInput from "../../components/inputs/text"
import ButtonPrimary from "../../components/buttons"
import { ArrowLeft, ImagePlusIcon, MoreVertical, Send, X } from "lucide-react"
import { socket } from "../../scripts/api/socket"
import Skeleton from "../../components/loader/skeleton"

export function UserChatContainer() {
    const { userId } = useParams()
    const { contacts } = useSelector((state: RootState) => state.contacts)
    const { userData } = useSelector((state: RootState) => state.user)
    const [isLoading, setIsLoading] = useState(true)
    const [contactIndex, setContactIndex] = useState(-1)
    const navigate = useNavigate()
    const messageListRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
        let ContactIndex = contacts.findIndex((contactData) => contactData.user.id == userId)
        if (ContactIndex == -1) {
            navigate('/contacts')
        } else {
            setContactIndex(ContactIndex)
            setIsLoading(false)
        }

    }, [])

    useEffect(() => {
        messageListRef.current?.scrollTo({ top: messageListRef.current.offsetHeight * 999 })
    }, [contacts[contactIndex]?.messages])


    return (
        <main className='flex flex-col text-neutral-50 h-full justify-end'>
            {isLoading == true ? (
                <Loader />
            ) : (
                <>
                    <ChatTopBar contactData={contacts[contactIndex].user} />
                    <ul ref={messageListRef} className='h-full gap-2 flex flex-col overflow-x-scroll'>
                        {contacts[contactIndex]?.messages.map((messageData) => {
                            return <Message key={`MessageCOmponent_${messageData.id}`} messageData={messageData} ownerData={
                                messageData.ownerId == userData.id ? (userData) : (contacts[contactIndex]?.user)
                            } />
                        })}
                    </ul>
                    <ChatInput contactReferenceId={contacts[contactIndex]?.contactReferenceId} />
                </>
            )}
        </main>
    )
}

export function GroupChatContainer() {
    const { groupId } = useParams()

    return (
        <div className='text-neutral-50'>
            Group
            {groupId}
        </div>
    )
}



function Message({ messageData, ownerData }: { messageData: IMessage, ownerData: IUser }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const messageRef = useRef<HTMLLIElement>(null)
    const [isOptionBoxOpen, setIsOptionBoxOpen] = useState<boolean>(false)

    const handleDeleteMessage = ()=>{
        socket.emit('deleteMessage', {
            messageId : messageData.id,
            token: userData.token
        }, (res: {status: number})=>{})
    }
    

    return (
        <li ref={messageRef}className="flex flex-row gap-2 mx-2"style={userData.id == ownerData.id ? { right: '0%', flexDirection: 'row-reverse' } : {}}>
            <article className="bg-neutral-800 py-2 px-4 flex flex-col rounded-sm rounded-tl-none ">
                <div className='flex flex-row justify-between items-center gap-2'>
                    <p className='text-xs font-normal'>{ownerData.userName}</p>
                    <MoreVertical size={12} strokeWidth={1} onClick={()=>setIsOptionBoxOpen(true)}/>
                </div>
                {messageData.image && messageData.image.length > 0 &&
                    <ul className="flex flex-col gap-2 w-fit mt-2">
                        {messageData.image?.map((imageId) =>
                            <li key={`${imageId}_imageElement`}><MessageImage imageId={imageId} /></li>
                        )}
                    </ul>}
                <Text size="small" variant="default" weight="thin">{messageData.text}</Text>
            </article>
            {isOptionBoxOpen &&
                <section onClick={()=>setIsOptionBoxOpen(false)} className='flex items-center justify-center absolute top-0 left-0 h-screen w-screen bg-neutral-900/50 z-50 '>
                    <ul className='flex flex-col items-center bg-neutral-950 rounded-sm w-3/4 border border-neutral-800/80 divide-neutral-800/80 divide-y'>
                        <li className='w-full px-4 py-2 flex justify-center' onClick={()=> handleDeleteMessage()}><Text size="small" variant="default" weight="thin">Delete message</Text></li>
                    </ul>
                </section>
            }
        </li>
    )
}

function MessageImage({ imageId }: { imageId: string }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [image, setImage] = useState<string>('')

    useEffect(() => {
        socket.emit('getImageById', { token: userData.token, imageId: imageId },
            (res: { status: number, data: string | null }) => {
                if (res.status != 200 || res.data == null) return
                setImage(res.data)
            }
        )
    }, [])


    return (
        <>
            {image == '' ?
                <div className='w-[45vw] rounded-sm aspect-square'><Skeleton /></div> :
                <img src={image} className='w-[45vw] rounded-sm' />
            }
        </>
    )
}


function ChatInput({ contactReferenceId }: { contactReferenceId: string }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const [inputValue, setInputValue] = useState<string>('')
    const [imagesListInBase64, setImagesListInBase64] = useState<string[]>([])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (inputValue == '' && imagesListInBase64.length <= 0) return

        socket.emit('sendMessage', {
            token: userData.token,
            contactReferenceId: contactReferenceId,
            text: inputValue,
            images: imagesListInBase64
        },(res: { status: number }) => {})

        setInputValue('')
        setImagesListInBase64([])
    }

    const convertImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let file: FileList | null = event.currentTarget.files
        if (!file) return

        let newList: string[] = [...imagesListInBase64]
        try {
            let fileListSize = file.length

            await new Promise(async (res: (result: string[]) => void) => {
                for (let i = 0; i < fileListSize; i++) {
                    await new Promise((resolve: (result: string) => void, reject) => {
                        const reader = new FileReader()
                        reader.onloadend = function (e) {
                            if (e.target?.result) {
                                resolve(e.target.result as string)
                            }
                        }
                        reader.onerror = (e) => { reject(e) }
                        reader.readAsDataURL(file[i])
                    }).then((result: string) => {
                        newList.push(result)
                    })

                }
                res(newList)
            }).then((res) => {
                setImagesListInBase64(res)
            })


        } catch (error) {}
        event.target.value = ''
    }

    const deleteImageFromList = (imageIndex: number) => {
        let newList = [...imagesListInBase64]
        newList.splice(imageIndex, 1)
        setImagesListInBase64(newList)
    }


    return (
        <section>
            <ul className='px-2 w-full pt-5  overflow-x-scroll  flex flex-row gap-3'>
                {imagesListInBase64.map((imageData, imageIndex) =>
                    <li className="aspect-[3/4] h-13 flex items-center justify-center  object-contain relative">
                        <button onClick={() => deleteImageFromList(imageIndex)}
                            className='bg-neutral-900 rounded-full absolute -top-2 -right-2 z-10 '><X size={15} strokeWidth={1} /></button>
                        <img src={imageData} className="w-full aspect-[3/4] object-cover" />
                    </li>
                )}
            </ul>
            <form onSubmit={(e) => handleSubmit(e)} className='flex flex-row gap-1 h-14 w-full px-2 mb-2 items-center p-1'>
                <TextInput className='w-full p-0' name="text" value={inputValue} onChange={(e) => (setInputValue(e.target.value))} />
                <div className='relative flex justify-center items-center h-full aspect-square'>
                    <ImagePlusIcon strokeWidth={1} />
                    <input type="file" accept="image/* video/*" multiple onChange={(e) => convertImage(e)} className='absolute w-full h-full top-0 left-0 opacity-0 z-10' />
                </div>
                <ButtonPrimary type='submit' className="h-full aspect-square flex items-center justify-center">
                    <Send strokeWidth={1} />
                </ButtonPrimary>
            </form>
        </section>
    )
}

function ChatTopBar({ contactData }: { contactData: IUser }) {
    return (
        <nav className='bg-neutral-900 border-b border-neutral-800 h-20 px-2 flex flex-row items-center gap-3'>
            <button onClick={() => history.back()}><ArrowLeft size={30} strokeWidth={1} /></button>
            <img src={contactData.picture} className='aspect-square rounded-full h-8' />
            <Text size="medium" variant="default" weight="normal">{contactData.userName}</Text>
        </nav>
    )
}