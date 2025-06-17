import { useDispatch, useSelector } from "react-redux"
import Text from "../../../components/texts"
import { SecondaryTextInput } from "../../../components/inputs/text"
import { ImgInput, ImgInputSmall } from "../../../components/inputs/image"
import ToggleSwitch from "../../../components/inputs/toggle"
import { AppDispatch, RootState } from "../../../redux/store"
import { changeUser, IUser } from "../../../redux/userslice"
import { useState } from "react"
import ButtonPrimary from "../../../components/buttons"
import Loader from "../../../components/loader/loader"
import { useNavigate } from "react-router-dom"
import { socket } from "../../../scripts/api/socket"
import { Camera, UserRoundPen } from "lucide-react"

export default function ConfigureProfile() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { userData } = useSelector((status: RootState) => status.user)
    const dispatch = useDispatch<AppDispatch>()
    const [userObject, setUserObject] = useState<IUser>({ ...userData })



    const setUserPicture = (value: string | undefined) => {
        if (!value) return
        setUserObject({ ...userObject, picture: value })
    }

    const setPrivateProfileSwitchValue = (value: boolean) => {
        setUserObject({ ...userObject, privateProfile: value })
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        socket.emit('updateProfile', {
            token: userObject.token,
            biography: userObject.biography,
            name: userObject.name,
            userName: userObject.userName,
            picture: userObject.picture,
            privateProfile: userObject.privateProfile
        }, (res: { status: number, data?: IUser, error?: string }) => {
            if (res.status == 200) {
                dispatch(changeUser({ data: res.data, callback: () => { } }))
                navigate(`../${res.data?.id}`)
            } else (console.log(res))
            setIsLoading(false)
        })
    }

    return (
        <main className="pt-8 pb-20">
            <Text className=' w-10/12 place-self-center' size="large" variant="default" weight="bold">My Profile</Text>
            <div className='w-fit h-fit place-self-center relative'>
                <img src={userObject.picture} className='h-30 aspect-square rounded-full border-8 border-neutral-900 place-self-center' />
                <ImgInputSmall setImageValue={setUserPicture} className='w-fit p-1.5 aspect-square absolute bottom-0 right-0 bg-purple-500 rounded-full text-neutral-900' >
                    <UserRoundPen strokeWidth={1}/>
                </ImgInputSmall>
            </div>
            <article className='text-center flex flex-col items-center'>
                <Text size="large" variant="default" weight="normal">{userObject.name}</Text>
                <Text size="small" variant="secondary" weight="thin">{userObject.userName}</Text>
                <Text size="small" variant="secondary" weight="thin" className='text-center w-10/12 mt-2'>{userObject.biography}</Text>
            </article>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className='flex flex-col items-center gap-4 mt-10'>
                <ToggleSwitch setSwitchPosition={setPrivateProfileSwitchValue} switchPosition={userObject.privateProfile} label="Private profile" />
                <SecondaryTextInput className='w-10/12' defaultValue={userObject.name} label="Name" onChange={(e) => setUserObject({ ...userObject, name: e.target.value })} />
                <SecondaryTextInput className='w-10/12' defaultValue={userObject.userName} label="User Name" onChange={(e) => setUserObject({ ...userObject, userName: e.target.value })} />
                <SecondaryTextInput className='w-10/12' defaultValue={userObject.biography} label="Bio" onChange={(e) => setUserObject({ ...userObject, biography: e.target.value })} />
                <ButtonPrimary type="submit" className='w-10/12 mt-10'>Confirm</ButtonPrimary>
            </form>
            {isLoading &&
                <div className='absolute top-0 left-0 flex h-full w-full justify-center items-center bg-neutral-950/80 z-20'>
                    <Loader />
                </div>
            }
        </main>
    )
}

