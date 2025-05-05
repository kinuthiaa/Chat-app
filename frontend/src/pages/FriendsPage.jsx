import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { getUserFriends } from '../lib/api';
import { UsersIcon } from 'lucide-react';
import { Link } from 'react-router';
import FriendCard from '../components/FriendCard';
import LonelyCard from '../components/LonelyCard';

const FriendsPage = () => {
    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    return (
        <div className='p-4 sm:p-6 lg:p-8'>
            <div className="container mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h1>
                        <p className="opacity-70 mt-1">People you can practice languages with</p>
                    </div>
                    <Link to={"/notifications"} className='btn btn-outline btn-sm'>
                        <UsersIcon className='mr-2 size-4' />
                        Friend Requests
                    </Link>
                </div>

                {loadingFriends ? (
                    <div className="flex justify-center py-12">
                        <span className='loading loading-bars loading-xl' />
                        <span className="ml-3">Loading your friends...</span>
                    </div>
                ) : friends.length === 0 ? (
                    <LonelyCard />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {friends.map((friend) => (
                            <FriendCard key={friend._id} friend={friend} showActions={true} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FriendsPage