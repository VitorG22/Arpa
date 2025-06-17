export default function getformValues(e:React.FormEvent<HTMLFormElement>){    
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData)
    return(formValues)
}