import React from "react";

export default function ButtonPrimary(props:React.ComponentPropsWithoutRef<'button'>){
    return(
        <button {...props} className={`bg-purple-500 flex flex-col justify-center py-3 rounded-lg place-self-center text-neutral-50 ${props.className}`}>
            {props.children}
        </button>
    )
}

export function ButtonSecondary(props:React.ComponentPropsWithoutRef<'button'>){
    return(
        <button {...props} className={`border border-purple-500 overflow-hidden relative text-purple-500 bg-transparent flex flex-col justify-center items-center rounded-lg place-self-center ${props.className}`}>
            {props.children}
        </button>
    )
}