import { ReactNode } from "react";
import Text from "../../components/texts";
import { ArrowLeft, Check, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { socket } from "../../scripts/api/socket";
import { deleteNotification } from "../../redux/notificationsslice";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
    const notificationList = useSelector((state: RootState) => state.notification)


    return (
        <main>
            <button className='text-neutral-50 p-2 '><ArrowLeft /></button>
            <ul className='divide-y divide-neutral-500/80 divider'>
                {notificationList.map((element) =>
                    <NotificationContainer >
                        <div className="flex flex-row gap-2 h-full items-center" >
                            {element.userData && <Picture url={element.userData.picture} />}
                            <article className='flex flex-col justify-center'>
                                <Text size="small" variant="default" weight="normal" className='first-letter:uppercase'>{element.title}</Text>
                                <Text size="small" variant="secondary" weight="normal" className='first-letter:uppercase text-xs'>{element.description}</Text>
                            </article>
                        </div>
                        <ButtonsContainer>
                            {/* {element.type == 'invite' && <>
                                <ButtonAccept notificationId={element.id} />
                                <ButtonDecline notificationId={element.id} />
                            </>}
                            {element.type == 'alert' && <ButtonDelete notificationId={element.id} />} */}
                            <ButtonDelete notificationId={element.id} />
                        </ButtonsContainer>
                    </NotificationContainer>
                )
                }
            </ul>
        </main>
    )
}

function NotificationContainer({ children,redirectUrl }: { children?: ReactNode, redirectUrl?:string }) {
    const navigate = useNavigate()
    return (
        <li 
        onClick={()=> {if(redirectUrl){navigate(redirectUrl)}}}    
        className='h-18 p-4  flex flex-row justify-between'>
            {children}
        </li>
    )
}

function Picture({ url }: { url: string }) {
    return (
        <img src={url} className='h-7/8 aspect-square rounded-md' />
    )
}


function ButtonsContainer({ children }: { children?: ReactNode }) {
    return (
        <div className='flex flex-row gap-2 items-center'>
            {children}
        </div>
    )
}

function ButtonDelete({ notificationId }: { notificationId: string }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()

    const deleteNotificationFromDb = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        socket.emit('deleteNotification', { notificationId, token: userData.token }, (res: { status: number }) => {
            if (res.status == 200) {
                dispatch(deleteNotification(notificationId))
            }
        })
    }
    
    return (
        <button onClick={(e) => deleteNotificationFromDb(e)} className=" p-2 rounded-md text-neutral-500 active:bg-neutral-500/20 duration-100">
            <X strokeWidth={1} />
        </button>
    )
}

function ButtonAccept({ notificationId }: { notificationId: string }) {
    return (
        <button className="flex flex-row text-xs items-center gap-2 p-2 rounded-md text-neutral-900 bg-purple-500 active:bg-purple-400 active:text-neutral-900 duration-100">
            Accept <Check strokeWidth={1} />
        </button>
    )
}

function ButtonDecline({ notificationId }: { notificationId: string }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()

    const deleteNotificationFromDb = () => {
        socket.emit('deleteNotification', { notificationId, token: userData.token }, (res: { status: number }) => {
            if (res.status == 200) {
                dispatch(deleteNotification(notificationId))
            }
        })
    }

    return (
        <button onClick={() => deleteNotificationFromDb()} className=" p-2 rounded-md text-neutral-500 active:bg-neutral-500/20 duration-100">
            <Trash2 strokeWidth={1} />
        </button>
    )
}
