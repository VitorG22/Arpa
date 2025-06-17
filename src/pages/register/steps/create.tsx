import { Link } from "react-router-dom";
import ButtonPrimary from "../../../components/buttons";
import Text from "../../../components/texts";
import getformValues from "../../../scripts/form/getvalues";
import { IRegisterUser } from "..";
import TextInput, { PasswordInput } from "../../../components/inputs/text";
import { socket } from "../../../scripts/api/socket";
import { useState } from "react";

export default function Create({ setregisterStep,userRegisterData, setUserRegisterData }: { setregisterStep: React.Dispatch<React.SetStateAction<number>>, userRegisterData?:IRegisterUser, setUserRegisterData:  React.Dispatch<React.SetStateAction<IRegisterUser| undefined>> }) {
    const [errorData, setErrorData] = useState<String| null>(null)

    const handleSubmite = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let inputValues = getformValues(e)
        let name = inputValues.name.toString().trim()
        let email = inputValues.email.toString().trim()
        let password = inputValues.password.toString().trim()
        let confirmPassword = inputValues.confirmPassword.toString().trim()

        if(password !== confirmPassword){
            setErrorData('passwords must match')
            return
        }
        
        setUserRegisterData({
            email,
            name,
            password
        })
        

        socket.emit('register',{
            step: 1,
            name,
            email,
            password
        }, (res:{status:number, data?:null, error?:string}) => {
            if(res.status == 200){
                setregisterStep(1)
            }else{
                console.log(res.error)
                setErrorData(res.error || null)
            }
        })
        
    }


    return (
        <main className='text-neutral-50 h-full flex flex-col gap-4 justify-center items-center'>
            <form action="" onSubmit={(e) => handleSubmite(e)} className='w-full flex flex-col items-center'>
            <article className='w-10/12 mb-4 '>
                <Text variant="default" size="large" weight="bold">Create account</Text>
                <Text variant="secondary" size="small" weight="normal">create an account, share your best moments</Text>
            </article>
                <TextInput onChange={()=>setErrorData(null)} required name='name' label="Your name" type='text' defaultValue={userRegisterData?.name} className="w-10/12"/>
                <TextInput onChange={()=>setErrorData(null)} required name='email' label="Email" type='email' defaultValue={userRegisterData?.email} className="w-10/12"/>
                <PasswordInput onChange={()=>setErrorData(null)} required name='password' label="Password" type='password' className="w-10/12" />
                <PasswordInput onChange={()=>setErrorData(null)} required name='confirmPassword' label="Confirm Password" type='password' className="w-10/12"/>
                {errorData && <Text size="small" variant="secondary" weight="thin" className='text-red-500'>{errorData}</Text>}
                <ButtonPrimary type='submit' className='mt-8 w-10/12'>
                    Create account
                </ButtonPrimary>
                <Text size="small" weight="normal" variant="secondary" className='flex flex-row gap-1 mt-6'>
                    Already have an account?<Link to='/'> <Text size="small" weight="normal" variant="purple">Log in</Text>
                    </Link>
                </Text>
            </form>

        </main>
    )

}