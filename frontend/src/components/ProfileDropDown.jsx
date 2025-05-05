import React from 'react'
import useAuthUser from '../hooks/useAuthUser.js'
import { LogOutIcon, SettingsIcon, UserCircleIcon } from 'lucide-react';

const ProfileDropDown = () => {
    const { authUser } = useAuthUser();
  return (
    <div className='dropdown dropdown-center'>
        <button tabIndex={0} className='btn btn-ghost btn-circle'>
            <img src={authUser.ProfilePic} alt="Profile" className='w-9 rounded-full' />
        </button>
          <div className="dropdown-content mr-18 md:mr-0 mt-3 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-50 border border-base-content/10 max-h-80 overflow-y-auto"
         tabIndex={0}
        >
            <div className="space-y-1">
            <button className={`w-full cursor-pointer px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-base-content/5`}>
                <UserCircleIcon className='size-5' />
                <span className="font-medium">Profile</span>
            </button>
            <button className={`w-full cursor-pointer px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-base-content/5`}>
                <SettingsIcon className='size-5'/>
                <span className="font-medium">Settings</span>
            </button>
            <button className={`hidden md:w-full cursor-pointer px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-base-content/5`}>
                <LogOutIcon className='size-5'/>
                <span className="font-medium">Logout</span>
            </button>

            </div>
        </div>
    </div>
  )
}

export default ProfileDropDown