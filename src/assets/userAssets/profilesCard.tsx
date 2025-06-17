import React from "react";
import Text from "../../components/texts";
import { IUser } from "../../redux/userslice";

interface IProfileCardLarge extends React.ComponentPropsWithRef<"section">{
    user?:IUser
}

export default function ProfileCardLarge(props:IProfileCardLarge){
    
    
    return(
        <button className={`relative active:bg-neutral-500/20 w-full place-self-center flex flex-row gap-4 items-center py-4 px-4 ${props.className}`}>
            <img src={props.user?.picture} 
            alt="" 
            className='rounded-full aspect-square w-14'
            ></img>
            <article className='text-start' >
                <Text size="small" variant="default" weight="bold">{props.user?.name}</Text>
                <Text size="small" variant="secondary" weight="thin" >{'@'+props.user?.userName}</Text>
            </article>
            <div className='right-2 absolute'>
                {props.children}
            </div>    
        </button>
        
    )
}