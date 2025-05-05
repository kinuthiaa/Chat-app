import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { removeChat } from '../lib/api.js'
import { UserMinusIcon, MoreVerticalIcon, BellOffIcon } from 'lucide-react'
import toast from 'react-hot-toast'
/* Components */


const ChatCard = ({ chat, showActions }) => {
    const queryClient = useQueryClient();
    const { mutate: removeChatMutation, isPending } = useMutation({
        mutationFn: removeChat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allchats"] });
            toast.success("You won't be hearing from them anytime soon");
        },
        onError: (error) => {
            console.error("Error deleting Chat", error.message);
            toast.error(error.response?.data?.message || "Doesn't seem like the connection's over just yet");
        }
    });
    return (
        <div className='card bg-base-200 hover:shadow-md transition-shadow'>
            <div className="card-body p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12 rounded-full">
                        <img src={chat.ProfilePic} alt="" />
                    </div>
                    <div className="flex-1">
                        <h3 className='font-semibold'>{chat.fullName}</h3>
                        {chat.Location && (<p className='text-xs opacity-0'>{chat.Location}</p>)}
                        <div className="flex-1">
                            <p className="text-md">This is a test message</p>
                        </div>
                    </div>
                </div>
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
                                onClick={() => removeChatMutation(chat._id)}
                                disabled={isPending}
                            >
                                <UserMinusIcon className="size-4" />
                                Delete Chat
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-error"
                                onClick={() => removeChatMutation(chat._id)}
                                disabled={isPending}
                            >
                                <BellOffIcon className="size-4" />
                                Mute Chat
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default ChatCard