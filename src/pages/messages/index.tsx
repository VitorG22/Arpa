import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../redux/store"
import { useEffect, useState } from "react"
import { IContact, setContactsData, setDefaultContactsList } from "../../redux/contactsSlice"
import Text from "../../components/texts"
import { socket } from "../../scripts/api/socket"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function ContactsPage() {
    const { contacts, groups } = useSelector((state: RootState) => state.contacts)
    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        socket.emit('getContactsMessages', { token: userData.token }, (res: { status: number, data: any }) => {
            if (res.status == 200) {
                dispatch(setContactsData(res.data))
            }
        })

    }, [])

    return (
        <main className='text-neutral-50'>
            <article className="flex flex-row gap-2 p-2 items-center">
                <button onClick={() => history.back()}><ArrowLeft size={30} strokeWidth={1} /></button>
                <Text size="small" variant="default" weight="normal">Contacts</Text>
            </article>
            <ul className='divide-neutral-800 divide-y'>
                {contacts.map(contactData =>
                    <ContactCard key={`contact_Card_${contactData.contactReferenceId}`} contactData={contactData} />
                )}
            </ul>
        </main>
    )
}


function ContactCard({ contactData }: { contactData: IContact }) {
    const { userData } = useSelector((state: RootState) => state.user)
    const navigate = useNavigate()


    return (
        <li className='flex flex-row gap-2 px-2 py-3 items-center hover:cursor-pointer active:bg-neutral-800/80' onClick={() => navigate(`/chat/${contactData.user.id}`)}>
            <img src={contactData.user.picture}
                className='rounded-full aspect-square w-14'
            />
            <article>
                <Text size="small" variant="default" weight="normal" className='flex flex-row gap-1 items-center'>
                    {contactData.user.online && <div className='h-2 rounded-full aspect-square bg-green-500' />}
                    {contactData.user.userName}</Text>
                <Text size="small" variant="secondary" weight="thin">
                    {contactData.messages[0]?.ownerId == userData.id &&
                        <b>You: </b>
                    }
                    {contactData.messages[contactData.messages.length -1]?.text || "image 📸"}
                </Text>
            </article>
        </li>
    )
}

