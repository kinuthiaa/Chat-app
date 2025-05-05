import React from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../lib/api';
import { Link } from 'react-router';
import { useLocation } from 'react-router';
import { BellIcon, LogOutIcon, MenuIcon, ShipWheelIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import ProfileDropDown from './ProfileDropDown.jsx';

const Navbar = ({ isSidebarOpen, onShowSidebar }) => {
    const location = useLocation();
    const isChatpage = location.pathname.startsWith("/chat");
    const queryClient = useQueryClient();

    const { mutate: logoutMutation } = useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    });

    return (
        <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between md:justify-end w-full">
                    {isChatpage && (
                        <div className="pl-5">
                            <Link to="/" className='flex items-center gap-2.5'>
                                <ShipWheelIcon className='size-9 text-primary' />
                                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                    ChatApp
                                </span>
                            </Link>
                        </div>
                    )}
                    <button
                        className='size-5 left-0 btn-circle btn-ghost btn lg:hidden'
                        onClick={() => onShowSidebar(!isSidebarOpen)}
                    >
                        <MenuIcon />
                    </button>
                    <div className='ml-auto flex items-center gap-1 flex-row'>
                        <div className="flex items-center gap-[4px] sm:gap-[2.5]">
                            <Link to={"/notifications"}>
                                <button className="btn btn-ghost btn-circle">
                                    <BellIcon className='w-6 h-6 text-base-content opacity-70' />
                                </button>
                            </Link>
                            <ThemeSelector />
                        </div>
                        <ProfileDropDown />
                        <button className="btn btn-ghost md:flex flex-row gap-2.5 text-lg rounded-lg hidden" onClick={logoutMutation}>
                            <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar