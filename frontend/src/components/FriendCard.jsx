import React from 'react'
import { LANGUAGE_TO_FLAG } from '../constants';
import { Link } from 'react-router';
import { MessageCircleIcon, MoreVerticalIcon, UserMinusIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeFriend } from '../lib/api';
import toast from 'react-hot-toast';

const FriendCard = ({ friend, showActions = false }) => {
    const queryClient = useQueryClient();
    
    const { mutate: removeFriendMutation, isPending } = useMutation({
        mutationFn: removeFriend,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] });
            toast.success("Friend removed successfully");
        },
        onError: (error) => {
            console.error("Error removing friend:", error);
            toast.error(error.response?.data?.message || "Failed to remove friend");
        }
    });

    return (
        <div className='card bg-base-200 hover:shadow-md transition-shadow'>
            <div className="card-body p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12 rounded-full">
                        <img src={friend.ProfilePic} alt={friend.fullName} />
                    </div>
                    <div className="flex-1">
                        <h3 className='font-semibold truncate'>{friend.fullName}</h3>
                        {friend.Location && (
                            <p className="text-xs opacity-70">{friend.Location}</p>
                        )}
                    </div>
                    {showActions && (
                        <div className="dropdown dropdown-end">
                            <button className="btn btn-ghost btn-sm btn-circle" tabIndex={0}>
                                <MoreVerticalIcon className="size-4" />
                            </button>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52">
                                <li>
                                    <button 
                                        className="text-error" 
                                        onClick={() => removeFriendMutation(friend._id)}
                                        disabled={isPending}
                                    >
                                        <UserMinusIcon className="size-4" />
                                        Remove Friend
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex flex-row flex-wrap gap-1.5 mb-3">
                    <span className="badge badge-secondary text-xs">
                        {getLanguageFlag(friend.NativeLanguage)}
                        Native: {friend.NativeLanguage}
                    </span>
                    <span className="badge badge-outline text-xs">
                        {getLanguageFlag(friend.LearningLanguage)}
                        Learning: {friend.LearningLanguage}
                    </span>
                </div>
                <Link 
                    to={`/chat/${friend._id}`} 
                    className="btn btn-primary btn-sm w-full"
                >
                    <MessageCircleIcon className="size-4 mr-2" />
                    Message
                </Link>
            </div>
        </div>
    )
}

export default FriendCard

export function getLanguageFlag(language) {
    if (!language) return null;
    const langLower = language.toLowerCase();
    
    // Add error handling and logging
    if (!LANGUAGE_TO_FLAG[langLower]) {
        console.warn(`No flag found for language: ${language}`);
        return null;
    }

    return (
        <img 
            src={`https://flagcdn.com/w20/${LANGUAGE_TO_FLAG[langLower]}.png`} 
            alt={language} 
            className="w-4 h-4 mr-1 inline-block"
            onError={(e) => {
                console.warn(`Failed to load flag for ${language}`);
                e.target.style.display = 'none';
            }}
        />
    );
}