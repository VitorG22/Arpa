import { createSlice } from "@reduxjs/toolkit";
import { IPost } from "../pages/profile/components/profilePhotos";

export interface IGalleryState {
    defaultList: IPost[],
    videoList: IPost[],
    ImagesList: IPost[]
}

const initialState: IGalleryState = {
    defaultList: [],
    ImagesList: [],
    videoList: []
}

const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {
        addToVideoGallery: (state, action) => {
            state.videoList = state.videoList.concat(action.payload)
        },
        addToImageGallery: (state, action) => {
            state.ImagesList = state.ImagesList.concat(action.payload)
        },
        addToDefaultGallery: (state, action) => {
            state.defaultList = state.defaultList.concat(action.payload)
        },
        editImageGallery: (state, action) => {
            state.ImagesList = state.ImagesList.map((element => element.id == action.payload.id ? (action.payload) : (element)))
        },
        editVideoGallery: (state, action) => {
            state.videoList = state.videoList.map((element => element.id == action.payload.id ? (action.payload) : (element)))
        },
        resetAllGallery: (state) => {
            state.ImagesList = []
            state.defaultList = []
            state.videoList = []
        }

    }
})

export const { editImageGallery, editVideoGallery, addToVideoGallery, addToImageGallery, addToDefaultGallery, resetAllGallery } = gallerySlice.actions

export default gallerySlice.reducer