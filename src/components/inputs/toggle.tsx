import Text from "../texts";

interface IInput extends React.ComponentPropsWithoutRef<'input'> {
    label?: string
    switchPosition:boolean,
    setSwitchPosition: (value:boolean)=>void
}

export default function ToggleSwitch(props:IInput){

    return(
        <section {...props} className={`flex flex-row w-10/12 items-center justify-between ${props.className}`}>
            <Text size="small" variant="secondary" weight="normal">{props.label}</Text>
            <div className='group flex flex-row p-1 items-center h-8 w-16 rounded-full border border-purple-500 relative bg-transparent has-checked:bg-purple-500 has-checked:justify-end  ease-in duration-150'>
                <div className="h-full rounded-full aspect-square bg-purple-500 group-has-checked:bg-neutral-900 "></div>
                <input type="checkbox" onChange={(e)=> props.setSwitchPosition(e.currentTarget.checked)}  defaultChecked={props.switchPosition}
                className='absolute h-full w-full top-0 left-0 opacity-0'
                />
            </div>
        </section>
    )
} 