import React, { ReactNode } from "react"
import ButtonPrimary from "../buttons"
import { Plus } from "lucide-react"

interface IInput extends React.ComponentPropsWithoutRef<'input'> {
    label?: string
    setImageValue: (img: string) => void
    children?: ReactNode
}


export function ImgInput(props: IInput) {

    const convertImage = async (file: FileList | null) => {
        if (!file) return 
        try {
            var reader = new FileReader()
            reader.onload = function (e) {
                if (e.target?.result) {
                    props.setImageValue?.(e.target.result as string)
                }
            }
            reader.readAsDataURL(file[0])
        } catch (error) {
            console.log(error)
        }
    
    }

    return (
        <section className={` flex flex-col items-center gap-2 w-full ${props.className}`} {...props}>
            <ButtonPrimary className='relative'>
                <input type="file" className='opacity-0 z-10 w-11/12' onChange={(e) => convertImage(e.currentTarget.files)} />
                <p className='absolute place-self-center z-0'>Select image</p>
            </ButtonPrimary>
        </section>
    )
}

export function ImgInputSmall(props: IInput) {
    const convertImage = async (file: FileList | null) => {
        if (!file) return 
        try {
            var reader = new FileReader()
            reader.onload = function (e) {
                if (e.target?.result) {
                    props.setImageValue?.(e.target.result as string)
                }
            }
            reader.readAsDataURL(file[0])
        } catch (error) {
            console.log(error)
        }
    
    }

    return (
        <section className={` flex flex-col items-center gap-2 ${props.className}`} {...props}>
            <div>
                <input type="file" className='opacity-0 z-10 w-full absolute' onChange={(e) => convertImage(e.currentTarget.files)} />
                <div className='w-full'>{props.children}</div>
            </div>
        </section>
    )
}