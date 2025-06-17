import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import Text from "../../components/texts"
import { Bell, Search, Send } from "lucide-react"
import { Link } from "react-router-dom"

export default function InfoBarTop(){
    const {userData} = useSelector((state:RootState) => state.user)
    
    return(
        <section className='flex flex-row justify-between p-4 items-center'>
            <div className='flex flex-row gap-4'>
            <img src={userData.picture} alt="" className='h-10 aspect-square rounded-full object-fill'/>
            <article>
                <Text size='small' variant="default" weight="normal" >{userData.name}</Text>
                <Text size='small' variant="secondary" weight="thin" className='text-xs' >{userData.userName}</Text>
            </article>
            </div>
            <div className='flex flex-row gap-4 text-neutral-50 h-full'>
                <Link to='/search' className='h-full p-2'><Search size={25} strokeWidth={1}/></Link>
                <Link to='/notifications' className='h-full p-2'><Bell size={25} strokeWidth={1}/></Link>
                <Link to='/contacts' className='h-full p-2'><Send size={25} strokeWidth={1}/></Link>
            </div>
        </section>
    )
}