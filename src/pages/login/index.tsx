import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "../../components/buttons";
import Text from "../../components/texts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import getformValues from "../../scripts/form/getvalues";
import TextInput, { PasswordInput } from "../../components/inputs/text";
import { socket } from "../../scripts/api/socket";
import { useState } from "react";
import Loader from "../../components/loader/loader";
import { changeUser, IUser } from "../../redux/userslice";


export default function LoginIndex() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [messageError, setMessageError] = useState<string | null>(null)

    const handleSubmite = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessageError(null)
        setIsLoading(true)
        let { email, password } = getformValues(e)
        email = email.toString().trim()
        password = password.toString().trim()


        if (!email || !password) return

        socket.emit('login', { email, password }, (res: { status: number, data: IUser, error: string }) => {
            setIsLoading(false)
            if (res.status == 200) {
                dispatch(changeUser({
                    data:res.data,
                    callback: ()=>{navigate('/home')}
                }
                ))
            } else {
                setMessageError(res.error)
            }
        })

    }



    return (
        <main className="relative text-neutral-50 h-full flex flex-col gap-4 justify-center items-center ">
            {isLoading && <div className='absolute flex justify-center items-center bg-neutral-900/80 top-0 left-0 h-dvh w-dvw'><Loader /></div>}
            <form action="" onSubmit={(e) => handleSubmite(e)} className='w-full flex flex-col items-center'>
                <article className='w-10/12 mb-4 '>
                    <Text size="large" weight="bold" variant="default">Login </Text>
                    <Text size="small" weight="normal" variant="secondary">immortalize your moments and share them with your friends</Text>
                </article>
                <TextInput name='email' required label='E-mail' type="email" className='w-10/12' />
                <PasswordInput name='password' required label='Password' className='w-10/12' />
                {messageError && <Text size="small" variant="secondary" weight="normal" className='text-red-500 pt-2'>{messageError}</Text>}
                <ButtonPrimary type='submit' className='mt-8 w-10/12'>
                    Login
                </ButtonPrimary>
                <Text size="small" variant="secondary" weight="normal" className="mt-6">Don't have an account? <Link to='/register' className='text-purple-500'>Create one</Link></Text>
            </form>
        </main>

    )
}