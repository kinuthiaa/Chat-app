import React from 'react'
import useAUthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router';
import { HomeIcon, ShipWheelIcon, UserIcon, BellIcon, NotebookPenIcon, BrainCircuitIcon, CalendarDaysIcon, MessageCircleMore, PhoneCallIcon, XIcon } from 'lucide-react';

const Sidebar = ({ onClose }) => {
    const { authUser } = useAUthUser();
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className='w-64 transition-normal duration-300 bg-base-200 border-r border-base-300 h-screen'>
            <div className="p-5 ">
                <Link to="/" className='flex items-center gap-2.5'>
                    <ShipWheelIcon className='size-9 text-primary' />
                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                        ChatApp
                    </span>
                </Link>
            </div>
            {/* Close button for mobile */}
            {onClose && (
                <button 
                    className="lg:hidden absolute top-4 right-4 btn btn-ghost btn-circle"
                    onClick={onClose}
                >
                    <XIcon className="size-5" />
                </button>
            )}
            <nav className='flex-1 p-4 space-y-2'>
                <Link to="/" 
                onClick={onClose}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active": ""}`}>
                    <HomeIcon className='size-5 text-base-content opacity-70'/>
                    <span>Home</span>
                </Link>
                <Link to="/friends" 
                    onClick={onClose}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/friends" ? "btn-active": ""}`}>
                    <UserIcon className='size-5 text-base-content opacity-70'/>
                    <span>Friends</span>
                </Link>
                <Link to="/notifications" 
                    onClick={onClose}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/notifications" ? "btn-active": ""}`}>
                    <BellIcon className='size-5 text-base-content opacity-70'/>
                    <span>Notifications</span>
                </Link>
                <Link to="/calls/:id" 
                    onClick={onClose}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/calls/:id" ? "btn-active": ""}`}>
                    <PhoneCallIcon className='size-5 text-base-content opacity-70'/>
                    <span>Calls</span>
                </Link>
                <Link to="/allchats/:id"
                    onClick={onClose} 
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/allchats/:id" ? "btn-active": ""}`}>
                    <MessageCircleMore className='size-5 text-base-content opacity-70'/>
                    <span>Chats</span>
                </Link>
                <Link to="/aichat/:id"
                    onClick={onClose} 
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/aichat/:id" ? "btn-active": ""}`}>
                    <BrainCircuitIcon className='size-5 text-base-content opacity-70'/>
                    <span>Chat with AI</span>
                </Link>
                <Link to="/calendar/:id"
                    onClick={onClose} 
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/calendar/:id" ? "btn-active": ""}`}>
                    <CalendarDaysIcon className='size-5 text-base-content opacity-70'/>
                    <span>Schedule</span>
                </Link>
            </nav>
            <div className="p-4 fixed mt-auto bottom-0">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={authUser?.ProfilePic} alt="Use Avatar" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{authUser?.fullName}</p>
                        <p className="text-xs text-success flex items-center gap-1">
                            <span className="size-2 rounded-full bg-success inline-block" />
                            Online
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar