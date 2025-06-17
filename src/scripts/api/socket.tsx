import io, { Socket } from "socket.io-client"

const apiUrl = import.meta.env.VITE_API_URL
export const socket: Socket = io(apiUrl)

export function ConnectSocket(token: string) {
    socket.emit('setSocketUserData', { token: token })
}