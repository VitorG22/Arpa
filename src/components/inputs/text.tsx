import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"

interface IInput extends React.ComponentPropsWithoutRef<'input'> {
    label?: string
}

export default function TextInput(props: IInput) {
    return (
        <div className={`flex flex-col gap-1 text-sm justify-center place-self-center ${props.className}`}>
            {props.label &&
                <label htmlFor={`input_${props.label}`}
                    className='text-neutral-300'
                >{props.label}</label>
            }
            <input {...props} id={`input_${props.label}`}
                className={`outline-none px-4 bg-neutral-800/70 justify-center w-full py-3 rounded-lg text-neutral-50  border-1 border-transparent focus:border-purple-500 `}
            />
        </div>
    )
}

export function PasswordInput(props: IInput) {
    const [hiddenPassword, setHiddenPassword] = useState<boolean>(true)
    
    return (
        <div className={`flex flex-col gap-1 text-sm justify-center place-self-center ${props.className}`}>
            {props.label &&
                <label htmlFor={`input_${props.label}`}
                    className='text-neutral-300'
                >{props.label}</label>
            }
            <div className='flex flex-row relative items-center border-1 border-transparent has-focus:border-purple-500  py-3 rounded-lg text-neutral-50 bg-neutral-800/70 px-4'>
                <input {...props} id={`input_${props.label}`} type={hiddenPassword ? "password": "text"}
                    className={`outline-none justify-center w-full h-full`}
                />
                <button type="button" onClick={()=> setHiddenPassword(!hiddenPassword)}
                className="text-neutral-400">
                    {hiddenPassword? <EyeClosed strokeWidth={1}/> : <Eye strokeWidth={1}/>}
                </button>
            </div>
        </div>
    )
}
export function SecondaryTextInput(props: IInput) {
    return (
        <div className={`group flex flex-col text-sm justify-center  place-self-center ${props.className}`}>
            {props.label &&
                <label htmlFor={`input_${props.label}`}
                    className='text-neutral-400 text-xs group-has-focus:text-neutral-50'
                >{props.label}</label>
            }
            <input {...props} id={`input_${props.label}`}
                className={`outline-none px-2 bg-transparent justify-center w-full pt-2 pb-1 text-neutral-50  border-b border-neutral-400 focus:border-neutral-50`}
            />
        </div>
    )
}
