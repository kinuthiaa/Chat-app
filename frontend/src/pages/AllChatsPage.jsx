import React from 'react'
import { FILTERS } from '../constants'
import { getAllChats } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import ChatCard from '../components/ChatCard'
import NoChats from '../components/NoChats'

const AllChatsPage = () => {
    const {data: allchats = [], isLoading: LoadallChats} = useQuery({
        queryKey: ["allchats"],
        queryFn: getAllChats,
    })

    return (
        <div className='min-h-screen p-4 sm:p-6 lg:p-8'>
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className='flex-1 space-y-4'>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Chats</h2>
                        {/* Filters Section - Scrollable on mobile */}
                        <div className='relative'>
                            <div className='flex items-center overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin'>
                                <div className='flex gap-2 flex-nowrap'>
                                    {FILTERS.map((filter) => (
                                        <button 
                                            key={filter.value} 
                                            className='btn btn-outline btn-sm shrink-0'
                                        >
                                            {filter.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className='flex items-center gap-2'>
                        <button className='btn btn-primary btn-sm flex-1 sm:flex-none'>
                            Add Chat
                        </button>
                        <button className='btn btn-error btn-sm flex-1 sm:flex-none'>
                            Remove Chat
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                {LoadallChats ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <span className="loading loading-bars loading-lg" />
                        <span className="mt-4 text-base-content/70">Loading your chats...</span>
                    </div>
                ) : allchats.length === 0 ? (
                    <NoChats />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allchats.map((chat) => (
                            <ChatCard 
                                key={chat._id} 
                                chat={chat} 
                                showActions={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllChatsPage