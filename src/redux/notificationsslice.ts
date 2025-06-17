import { createSlice } from "@reduxjs/toolkit";

export interface INotification{
    id: string,
    title: string,
    description: string,
    type:'alert'|'invite'| string,
    userData?:{
        id:string,
        name:string,
        picture: string
    }, 
    keyWord: string
}

const initialState:INotification[] = []

const NotificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers:{
        setNotifications:(state,action)=>{
            state = action.payload
            return state
        },
        addNotification:(state ,action) =>{
            state.push(action.payload)
        },
        deleteNotification:(state,action) =>{
            let indexToBeDeleted = null
            indexToBeDeleted = state.findIndex((element) => element.id == action.payload )
            if(indexToBeDeleted == null)return
                
            let stateCopy = [...state]
            stateCopy.splice(indexToBeDeleted,1)
            return stateCopy
        }
        
    }
})

export const {addNotification, deleteNotification,setNotifications} = NotificationSlice.actions

export default NotificationSlice.reducer