import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export const useSocket = () => {
  const [lastMessage, setLastMessage] = useState('')

  useEffect(() => {
    const socket = io('https://35.188.69.83:8080', {
      transports: ['websocket'],
    })
    socket.on('event', (message: string) => {
      setLastMessage(message)
    })
  }, [])

  return { lastMessage }
}
