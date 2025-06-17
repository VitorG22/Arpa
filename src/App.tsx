import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppDispatch, RootState } from './redux/store'
import { useEffect, useState } from 'react'
import { getCookie } from './scripts/Cookies'
import { socket } from './scripts/api/socket'
import { changeUser, IUser } from './redux/userslice'
import Loader from './components/loader/loader'

function App() {
  const { userData } = useSelector((state: RootState) => state.user)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dispatch = useDispatch<AppDispatch>()
  const currentRoute = useLocation().pathname
  const navigate = useNavigate()

  useEffect(() => {
    if (userData.id == '') {
      let token = getCookie('ArpaToken')
      if (currentRoute != '/' && currentRoute != '/register') navigate('/')
      if (token != '') {
        socket.emit('loginByToken', { token: token }, (res: { status: number, data: IUser, error?: string }) => {
          if (res.status == 200) {
            dispatch(changeUser({
              data: res.data,
              callback: () => {
                if (currentRoute == '/register' || currentRoute == '/') {
                  navigate('/home')
                  setTimeout(() => {
                    setIsLoading(false)
                  }, 100);
                } else {
                  navigate(currentRoute)
                  setTimeout(() => {
                    setIsLoading(false)
                  }, 100);
                }
              }
            })
            )
          } else if (res.status != 200) {
            setIsLoading(false)
          }
        })
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])


  return (
    <main className='font-[Poppins] w-screen max-w-screen h-dvh bg-neutral-900 overflow-x-hidden'>
      {isLoading ? (
        <div className='h-full w-full flex justify-center items-center'>
          <Loader />
        </div>
      ) : (<Outlet />)}
    </main>
  )
}

export default App
