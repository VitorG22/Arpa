import { HomeIcon, PlaySquare, PlusSquare, SearchIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    const { userData } = useSelector((state: RootState) => state.user)

    return (
        <nav className='flex flex-row justify-around w-full bottom-0 left-0 bg-neutral-950 py-1 text-neutral-50'>
            <NavLink to='/home' className={({isActive, isPending}) => ` border-b-1  flex justify-center items-center h-9 w-full ${isPending ? "border-transparent" : isActive ? "border-neutral-50" : "border-transparent"}`}><HomeIcon size={25} strokeWidth={1} /></NavLink>
            <NavLink to='/search' className={({isActive, isPending}) => ` border-b-1  flex justify-center items-center h-9 w-full ${isPending ? "border-transparent" : isActive ? "border-neutral-50" : "border-transparent"}`}><SearchIcon size={25} strokeWidth={1} /></NavLink>
            <NavLink to='/newPost' className={({isActive, isPending}) => ` border-b-1  flex justify-center items-center h-9 w-full ${isPending ? "border-transparent" : isActive ? "border-neutral-50" : "border-transparent"}`}><PlusSquare size={25} strokeWidth={1} /></NavLink>
            <NavLink to='/explore' className={({isActive, isPending}) => ` border-b-1  flex justify-center items-center h-9 w-full ${isPending ? "border-transparent" : isActive ? "border-neutral-50" : "border-transparent"}`}><PlaySquare size={25} strokeWidth={1} /></NavLink>
            <NavLink to={`/user/${userData.id}`} className={({isActive, isPending}) =>  `border-b-1 flex justify-center items-center h-9 w-full ${isPending ? "border-transparent" : isActive ? "border-neutral-50" : "border-transparent"}`}><img src={userData.picture} alt=""
                className='rounded-full h-7 aspect-square' /></NavLink>
        </nav>
    )
}