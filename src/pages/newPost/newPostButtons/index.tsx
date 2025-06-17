import { CameraIcon, Video } from "lucide-react";
import React from "react";

interface IContainerInterface extends React.ComponentPropsWithoutRef<'div'>{
    setImagesListInBase64: React.Dispatch<React.SetStateAction<string[]>>    
    imagesListInBase64: string[]
}


export function NewPostButtonsContainer(props:IContainerInterface){
    const convertImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let file: FileList | null = event.currentTarget.files
        if (!file) return

        let newList:string[] = [...props.imagesListInBase64] 
        try {
            let fileListSize = file.length

            await new Promise(async (res:(result:string[])=>void) => {
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
                props.setImagesListInBase64(res)
            })


        } catch (error) {}
        event.target.value = ''
    }
    

    return (
        <div {...props} className={`relative ${props.className}`}>
            <input type="file" accept="image/* video/*" multiple onChange={(e) => convertImage(e)} className='absolute w-full h-full top-0 left-0 opacity-0 z-10' />
            {props.children}
        </div>
    )
}

export function PostNewPhotoButton() {
    return (
        <button className='relative justify-self-center flex flex-row items-center justify-center bg-pink-500/20 py-2 px-8 rounded-full gap-2 text-pink-500 text-xs '>
            <CameraIcon size={18} strokeWidth={1} fill="#f6339a" stroke='#171717' />
            Photo
        </button>
    )
}

export function PostNewVideoButton() {
    return (
        <button className='justify-self-center flex flex-row items-center justify-center bg-cyan-500/20 py-2 px-8 rounded-full gap-2 text-cyan-500 text-xs '>
            <Video size={18} strokeWidth={1} fill='#00b8db' stroke="#171717" />
            Video
        </button>
    )
}