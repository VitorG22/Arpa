import { SearchIcon } from "lucide-react";
import TextInput from "../../components/inputs/text";
import ProfileCardLarge from "../../assets/userAssets/profilesCard";
import { useState } from "react";
import getformValues from "../../scripts/form/getvalues";
import PostData from "../../scripts/api/postData";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { IUser } from "../../redux/userslice";
import Loader from "../../components/loader/loader";
import { Link } from "react-router-dom";

export default function Search() {
    const { userData } = useSelector((state: RootState) => state.user)
    const [usersList, setUsersList] = useState<IUser[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { searchInput } = getformValues(e)
        setIsLoading(true)
        PostData({
            path: '/searchProfile',
            payload: {
                searchValue: searchInput,
                requesterToken: userData.token
            }
        }).then(res => {
            if (res.status == 200) { setUsersList(res.data) }
        }).finally(() => { setIsLoading(false) }
        )
    }

    return (
        <main className=' flex flex-col gap-2 items-center justify-center w-full'>
            <form onSubmit={(e) => handleSubmit(e)} className='h-fit px-4 py-2 text-neutral-400 flex flex-row gap-2 items-center justify-center w-full '>
                <button type='submit' className='p-2 active:bg-neutral-400/20 rounded-lg'>
                    <SearchIcon size={25} strokeWidth={1} />
                </button>
                <TextInput name='searchInput' className="w-full" placeholder="Search" />
            </form>
            {isLoading && <Loader />}
            <ul className='w-full px-4'>
                {usersList?.map((userInListData) =>
                    <Link to={`/user/${userInListData.id}`}>
                        <ProfileCardLarge user={userInListData} />
                    </Link>
                )}
            </ul>

        </main>
    )
}