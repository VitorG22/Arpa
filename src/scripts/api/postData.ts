import axios from "axios"

interface IPostData{
    path: string,
    payload: any
}

export default async function PostData({path,payload}:IPostData){

    const API_URL = import.meta.env.VITE_API_URL + path 

    try{
        const result = await axios.post(API_URL, payload)
        return result
    }catch(error){
        throw error
    }
}