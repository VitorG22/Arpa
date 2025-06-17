import { Outlet } from "react-router-dom";
import NavBar from "./components/navBar";
import { useEffect } from "react";
import { socket } from "./scripts/api/socket";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { addNotification, INotification, setNotifications } from "./redux/notificationsslice";
import { deleteMessageInContact, IMessage, newMessageInContact } from "./redux/contactsSlice";

export default function BaseStructure() {
    const dispatch = useDispatch<AppDispatch>()
    const {userData} = useSelector((state:RootState)=>state.user)
    
    useEffect(()=>{
        
        socket.on('NewNotification', (payload:INotification)=>{
            dispatch(addNotification(payload))
        })
        
        socket.on('messageReceived', (payload:IMessage)=>{
            dispatch(newMessageInContact(payload))
        })
        
        socket.on('messageDelete', ( payload:{messageId: string,contactReferenceId: string})=>{
            dispatch(deleteMessageInContact(payload))
        })

        socket.emit('getNotifications',{token:userData.token},(res:{status:number,data:INotification[], error?:string})=>{
            if(res.status == 200){
                dispatch(setNotifications(res.data))
            }
        })

        
    },[])
    
    return (
        <main className='flex flex-col justify-between h-dvh'>
            <div className='h-full overflow-y-scroll'>
                <Outlet />
            </div>
            <NavBar />
        </main>
    )
}