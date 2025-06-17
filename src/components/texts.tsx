interface IText extends React.ComponentPropsWithoutRef<'h1'>{
    variant: 'default' | 'secondary' | 'purple'
    size: 'large' | 'medium' | 'small'
    weight: 'bold'| 'thin' | 'normal'
}

export default function Text(props:IText){
    return(
        <h1 {...props} className={`
        ${props.variant == "default" ? "text-neutral-50": props.variant =="secondary"? "text-neutral-400": 'text-purple-500'}
        ${props.size == "large" ? "text-2xl": props.size == "medium"? "text-xl": "text-sm"}
        ${props.weight == "bold" ? "font-bold": props.weight == "normal"? "font-normal": "font-thin"}
        ${props.className}
        `}>
            {props.children}
        </h1>
    )
}