import { useQueryClient, useMutation } from '@tanstack/react-query'
import React from 'react'
import { removeCall } from '../lib/api.js'
import { UserMinusIcon, MoreVerticalIcon, BellOffIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const CallCard = ({ call, showActions }) => {
    const queryClient = useQueryClient();
    const { mutate: removeCallMutation, isPending } = useMutation({
        mutationFn: removeCall,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calls"] });
            toast.success("Call removed successfully");
        },
        onError: (error) => {
            console.error("Error removing call:", error);
            toast.error(error.response?.data?.message || "Failed to remove call");
        }
    });
    return (
            <div className="card bg-base-200 hover:shadow-md transition-shadow">
                <div className="card-body p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="avatar size-12 rounded-full">
                            <img src={call.ProfilePic} alt={call.fullName} />
                        </div>
                        <div className="flex-1">
                            <h3 className='font-semibold truncate'>{call.fullName}</h3>
                            {call.Location && (
                                <p className="text-xs opacity-70">{call.Location}</p>
                            )}
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
                                    onClick={() => removeCallMutation(call._id)}
                                    disabled={isPending}
                                >
                                    <UserMinusIcon className="size-4" />
                                    Remove Call from Lists
                                </button>
                            </li>
                            <li>
                                <button
                                    className="text-error"
                                    onClick={() => removeCallMutation(call._id)}
                                    disabled={isPending}
                                >
                                    <BellOffIcon className="size-4" />
                                    Mute User
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
    )
}

export default CallCard