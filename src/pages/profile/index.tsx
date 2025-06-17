import { useState } from "react";
import ProfilePage from "./profilePage";
import ProfileImageLine from "./profileImageLine";
import ProfileVideoLine from "./profileVideoLine";

export default function ProfileContainer() {
    const [pageToShow, setPageToShow] = useState<'default' | 'imageLine' | 'videoLine'>('default')

    return (
            <>
                {pageToShow == 'default' && <ProfilePage setPageToShow={setPageToShow}/>}
                {pageToShow == 'imageLine' && <ProfileImageLine setPageToShow={setPageToShow}/>}
                {pageToShow == 'videoLine' && <ProfileVideoLine setPageToShow={setPageToShow}/>}
            </>
    )
}