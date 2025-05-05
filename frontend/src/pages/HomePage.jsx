import React, { useEffect, useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getRecommendedUsers, getUserFriends, getOutgoingFriendReqs, sendFriendRequest } from '../lib/api';
import { Link } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';
import LonelyCard from '../components/LonelyCard';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingReqsIds, setoutgoingReqsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recUsers = [], isLoading: loadRecUsers } = useQuery({
    queryKey: ["RecommendedUsers"],
    queryFn: async () => {
      const response = await getRecommendedUsers();
      return response.recommendedUsers; // Extract the recommendedUsers array
    },
  });

  const { data: outgoingReqs = [], isLoading: loadOutgoingReqs } = useQuery({
    queryKey: ["OutgoingRequests"],
    queryFn: async () => {
      const response = await getOutgoingFriendReqs(); // Use correct function
      return response; // This returns array of outgoing requests
    },
  });

  const { mutate: sendReqMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      // Invalidate both queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["OutgoingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["RecommendedUsers"] });
    },
  });


  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingReqs && outgoingReqs.length > 0) {
      outgoingReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setoutgoingReqsIds(outgoingIds);
    }
  }, [outgoingReqs]); // Depend on outgoingReqs instead of outgoingReqsIds

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to={"/notifications"} className='btn btn-outline btn-sm' >
            <UsersIcon className='mr-2 size-4' />
            Friend Requests
          </Link>
        </div>
        {loadingFriends ? (
          <div className="flex flex-col items-center justify-center py-12"> <span className='loading loading-bars loading-xl' />Just a sec...</div>
        ) : friends.length === 0 ? (<><LonelyCard /></>)
          : (<>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {friends.map((friend) => (<FriendCard key={friend._id} friend={friend} />))}
            </div></>
          )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-light">Meet other newbies</h2>
                <p className="opacity-70">Find other language partners based on your personality and interests</p>
              </div>
            </div>
          </div>
          {loadRecUsers ? (<>
            <div className="flex justify-center py-12"><span className="loading loading-bars loading-lg" /></div></>)
            : (
              recUsers.length === 0 ? (
                <div className="card bg-base-200 p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">No recommended users found.</h3>
                  <p className='text-base-content opacity-70'>Being mysterious is super cool but here's the thing no man's an Island so let's find some giggle buddies for you</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recUsers.map((user) => {
                    const hasRequestBeenSent = outgoingReqsIds.has(user._id);

                    return (
                      <div
                        key={user._id}
                        className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="card-body p-5 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="avatar size-16 rounded-full">
                              <img src={user.ProfilePic} alt={user.fullName} />
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg">{user.fullName}</h3>
                              {user.Location && (
                                <div className="flex items-center text-xs opacity-70 mt-1">
                                  <MapPinIcon className="size-3 mr-1" />
                                  {user.Location}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Languages with flags */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className="badge badge-secondary">
                              {getLanguageFlag(user.NativeLanguage)}
                              Native: {capitalise(user.NativeLanguage)}
                            </span>
                            <span className="badge badge-outline">
                              {getLanguageFlag(user.LearningLanguage)}
                              Learning: {capitalise(user.LearningLanguage)}
                            </span>
                          </div>

                          {user.Bio && <p className="text-sm opacity-70">{user.Bio}</p>}
                          <button
                            className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                              } `}
                            onClick={() => sendReqMutation(user._id)}
                            disabled={hasRequestBeenSent || isPending}
                          >
                            {hasRequestBeenSent ? (
                              <>
                                <CheckCircleIcon className="size-4 mr-2" />
                                Request Sent
                              </>
                            ) : (
                              <>
                                <UserPlusIcon className="size-4 mr-2" />
                                Send Friend Request
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            )}
        </section>
      </div>
    </div>
  )
}

export default HomePage;

const capitalise = (str) => {
  if (!str) return ''; // Return empty string if input is null/undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
};