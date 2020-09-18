import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export const useSocket = () => {
  const [lastMessage, setLastMessage] = useState('')

  useEffect(() => {
    const socket = io('http://35.188.69.83', {
      transports: ['websocket'],
    })
    socket.on('event', (message: string) => {
      setLastMessage(message)
    })
  }, [])

  return { lastMessage }
}
