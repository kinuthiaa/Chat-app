import { LoaderIcon } from 'lucide-react'
import React from 'react'

const ChatLoader = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center p-4'>
      <LoaderIcon className='loading loading-infinity size-10 text-primary' />
      <p className="mt-4 text-center text-lg font-mono">Did you see what happened in the chat yesterday....?</p>
    </div>
  )
}

export default ChatLoader