import React from 'react'
import { LoaderIcon } from "lucide-react"
import { useThemeStore } from '../store/useThemeStore'

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className='h-screen m-auto flex items-center justify-center' data-theme={theme}>
          <LoaderIcon className="loading loading-infinity loading-xl"/>
    </div>
  )
}

export default PageLoader