import { configureStore} from '@reduxjs/toolkit'
import userReducer from './userslice'
import galleryReducer from './galleryslice'
import notificationReducer from './notificationsslice'
import contactsReducer from './contactsSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        gallery: galleryReducer,
        notification: notificationReducer,
        contacts: contactsReducer,

    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch