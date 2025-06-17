import { useSelector } from "react-redux"
import { RootState } from "../redux/store"


export default function StoriesCarrousel(){
    return(
        <main className=''>
            <ul className='flex  flex-row gap-3 overflow-x-scroll py-4 px-4'>
                <StoreComponente/>
                <StoreComponente/>
                <StoreComponente/>
                <StoreComponente/>
                <StoreComponente/>
                <StoreComponente/>
                <StoreComponente/>
                <StoreComponente/>
            </ul>
        </main>
    )
}

function StoreComponente(){
    const {userData} = useSelector((state:RootState)=> state.user)
    
    return(
        <li className='relative flex flex-col items-center w-fit mb-2'>
            <img src="https://i.pinimg.com/736x/44/ec/36/44ec36ade5c8a035b3539fadbb1301fe.jpg" alt="" 
            className='flex h-30 min-w-24 aspect-[3/4]  object-cover rounded-md'
            />
            <img src={userData.picture} alt=""
            className='rounded-full h-8 aspect-square absolute z-10 -bottom-4 border-2 border-neutral-900' />        
        </li>
    )
}