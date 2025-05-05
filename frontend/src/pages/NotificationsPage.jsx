import React from 'react'
import { Link } from 'react-router';
import { getLanguageFlag } from '../components/FriendCard.jsx';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { getFriendRequests, acceptFriendRequest } from '../lib/api.js';
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast';
import NoNotifications from '../components/NoNotifications.jsx';

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  })

  const { mutate: acceptedRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Friend request accepted!");
    },
    onError: (error) => {
      console.error("Error accepting friend request:", error);
      toast.error(error.response?.data?.message || "Failed to accept friend request");
    }
  })

  const incomingRequests = notifications?.incomingReqs || [];
  const acceptedRequests = notifications?.acceptedReqs || [];


  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className="container mx-auto space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className='loading loading-bars loading-xl' />
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheck className="h-5 w-5 text-primary" />
                  Friend requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>
                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow" key={request._id}>
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.ProfilePic} alt={request.sender.fullName} />
                            </div>
                            <div>
                              <h3 className='font-semibold'>{request.sender.fullName}</h3>
                              <div className="flex  flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">{getLanguageFlag(request.sender.NativeLanguage?.toLowerCase())} Native: {request.sender.NativeLanguage}</span>
                                <span className="badge badge-outline badge-sm">{getLanguageFlag(request.sender.LearningLanguage?.toLowerCase())} Learning: {request.sender.LearningLanguage}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            className='btn btn-primary btn-sm'
                            onClick={() => acceptedRequestMutation({ friendId: request._id })} // Pass the request ID, not the sender ID
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className='text-xl font-semibold items-center gap-2'>
                  <BellIcon className='h-5 w-5 text-primary' />
                  New Friends
                </h2>
                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div className="card bg-base-200 shadow-sm" key={notification._id}>
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            <img src={notification.recipient.ProfilePic} alt={notification.recipient.fullName} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                            <p className="text-sm my-1">{notification.recipient.fullName} accepted your friend request</p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className='h-3 w-3 mr-1' />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <Link to={"/chat/:id"} className="flex items-center gap-1 cursor-pointer">
                              <MessageSquareIcon className='h-3 w-3 mr-1' />
                              New Friend
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (<NoNotifications />)}
          </>
        )}


      </div>
    </div>
  )
}



export default NotificationsPage