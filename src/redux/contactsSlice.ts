import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./userslice";

export interface IGroup {
    members: {
        user: IUser,
        position: 'admin' | 'supervisor' | 'member'
    }
    name: string,
    id: string,
    creationDate: Date,
    messages: IMessage[]
    image?: string,
}

export interface IContact {
    contactReferenceId: string,
    user: IUser
    messages: IMessage[]
}

export interface IMessage {
    ownerId: string,
    text?: string,
    image?: string[],
    date: Date,
    id: string
}


const initialState: { groups: IGroup[], contacts: IContact[] } = {
    groups: [],
    contacts: []
}

const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        setDefaultContactsList: (state, action) => {
            state = action.payload
        },
        setGroupsData:(state,action) =>{
            state.groups = action.payload
        },
        updateGroup:(state,action)=>{
            let newGroupState = state.groups.map((groupData)=> groupData.id == action.payload.id ? action.payload.id : groupData)
            state.groups = newGroupState
        },
        newMessageInGroup:(state,action)=>{
            let groupIndex = state.groups.findIndex(groupData=>groupData.id == action.payload.id)
            state.groups[groupIndex].messages.push(action.payload.message)
        },
        deleteMessageInGroup:(state,action)=>{
            let groupIndex = state.groups.findIndex(groupData=>groupData.id == action.payload.groupId)
            if(groupIndex > -1){
                let messageIndex = state.groups[groupIndex].messages.findIndex(messageData=>messageData.id == action.payload.messageId) 
                state.groups[groupIndex].messages.splice(messageIndex, 1)
            }
        },

        setContactsData:(state, action) =>{
            state.contacts = action.payload
        },
        updateContacts:(state,action)=>{
            let newContactsState = state.contacts.map(contactData=> contactData.user.id == action.payload.user.id?(action.payload):(contactData))
            state.contacts = newContactsState          
        },
        newMessageInContact:(state,action)=>{
            let contactIndex = state.contacts.findIndex(contactData=>contactData.contactReferenceId == action.payload.contactReferenceId)
            state.contacts[contactIndex].messages.push(action.payload)
        },
        deleteMessageInContact:(state,action)=>{
            let contactIndex = state.contacts.findIndex(contactData=>contactData.contactReferenceId == action.payload.contactReferenceId)
            if(contactIndex > -1){
                let messageIndex = state.contacts[contactIndex].messages.findIndex(messageData=>messageData.id == action.payload.messageId) 
                state.contacts[contactIndex].messages.splice(messageIndex, 1)
            }
        }
    }
})

export const {deleteMessageInContact,deleteMessageInGroup,newMessageInContact,newMessageInGroup,setContactsData,setDefaultContactsList,setGroupsData,updateContacts,updateGroup} = contactsSlice.actions

export default contactsSlice.reducer