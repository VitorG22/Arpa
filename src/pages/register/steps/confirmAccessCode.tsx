import Text from "../../../components/texts";
import ButtonPrimary from "../../../components/buttons";
import getformValues from "../../../scripts/form/getvalues";
import { IRegisterUser } from "..";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { changeUser, IUser } from "../../../redux/userslice";
import TextInput from "../../../components/inputs/text";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../scripts/api/socket";
import { useState } from "react";

export default function ConfirmAccesscode({ setregisterStep, setUserRegisterData, userRegisterData }: { setregisterStep: React.Dispatch<React.SetStateAction<number>>, userRegisterData?: IRegisterUser, setUserRegisterData: React.Dispatch<React.SetStateAction<IRegisterUser | undefined>> }) {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [errorToShow, setErrorToShow] = useState<string | null>(null)

    if (!userRegisterData) { setregisterStep(1); return }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let { AccessCode } = getformValues(e)
        AccessCode = AccessCode.toString().trim().toUpperCase()

        socket.emit("register", {
            step: 2,
            code: AccessCode,
            email: userRegisterData.email,
            name: userRegisterData.name,
            password: userRegisterData.password
        }, (res: { status: number, data: IUser, Error: string }) => {
            if (res.status == 200) {
                dispatch(changeUser({
                    data: res.data, callback: () => {
                        setUserRegisterData({
                            email: '',
                            name: '',
                            password: ''
                        })
                        navigate('/home')
                    }
                }))
            } else (
                setErrorToShow(res.Error)
            )
        })
    }

    return (
        <main className='flex flex-col items-center h-full justify-center '>
            <form action="" onSubmitCapture={(e) => handleSubmit(e)} className='w-full flex flex-col items-center gap-2'>
                <article className='w-10/12 mb-4'>
                    <Text size="large" variant="default" weight="bold">Check your inbox</Text>
                    <Text size="small" variant="secondary" weight="normal">We have sent to you a verification code by email</Text>
                </article>
                <Text className="w-fit place-self-center" size="small" variant="secondary" weight="normal">{userRegisterData.email}</Text>
                <TextInput name="AccessCode"  className="text-center w-10/12" onChange={() => setErrorToShow(null)} />
                <button type="button">
                    <Text size="small" variant="purple" weight="normal">Send again</Text>
                </button>
                <ButtonPrimary type="submit" className="mt-4 w-10/12" >
                    Confirm
                </ButtonPrimary >
                {errorToShow &&
                    <div className='text-red-500 text-sm'>{errorToShow}</div>
                }

            </form>

        </main>
    )
}