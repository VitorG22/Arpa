import { useState } from "react";
import Create from "./steps/create";
import ConfirmAccesscode from "./steps/confirmAccessCode";

export interface IRegisterUser{
    name: string,
    email: string,
    password: string
}

export default function RegisterIndex() {
    const [registerStep , setregisterStep] = useState<number>(0)
    const [userRegisterData, setuserRegisterData] = useState<IRegisterUser>()
    

    return(
        <>
        {registerStep == 0 && <Create setregisterStep={setregisterStep}  userRegisterData={userRegisterData} setUserRegisterData={setuserRegisterData}/>}
        {registerStep == 1 && <ConfirmAccesscode setregisterStep={setregisterStep} userRegisterData={userRegisterData} setUserRegisterData={setuserRegisterData}/>}
        </>
    )
}
