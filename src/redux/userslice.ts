import { createSlice } from "@reduxjs/toolkit";
import deleteToken, { setCookie } from "../scripts/Cookies";

export interface IUser {
    id: string
    userName: string
    name: string
    email: string
    picture: string
    privateProfile: boolean
    biography: string
    followers: number
    following: number
    Posts: number
    online: boolean
    socketId: string | null
    requestFollow: {
        byYou: string | null,
        byOther: string | null
    },
    token?: string
    follow?: boolean
    relationId?: string
}

interface IUserState {
    userData: IUser
    isLogged: boolean,
}

const initialState: IUserState = {
    userData: { biography: '', email: '', followers: 0, following: 0, id: '', name: '', picture: '', Posts: 0, privateProfile: true, userName: '', token: '', follow: false, relationId: '', online: false, socketId: null, requestFollow: { byOther: null, byYou: null } },
    isLogged: false,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeUser: (state, action) => {
            state.userData = action.payload.data,
                state.isLogged = true
            setCookie({
                name: 'ArpaToken',
                value: action.payload.data.token,
            })
            action.payload.callback()
        },
        disconnectUser: (state) => {
            state.userData = initialState.userData
            state.isLogged = false
            deleteToken({ name: 'ArpaToken' })
        }
    }
})




export const { changeUser, disconnectUser } = userSlice.actions

export default userSlice.reducer