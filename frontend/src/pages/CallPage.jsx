import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import { StreamVideo, StreamCall, CallControls, SpeakerLayout, StreamTheme, CallingState, useCallStateHooks,  StreamVideoClient} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const {id:callId} = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setisConnecting] = useState(true);
  const {authUser, isLoading }= useAuthUser();
  const {data:tokenData} = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: Boolean(authUser),
  });

  useEffect(() => {
    const initCall = async () => {
      if(!tokenData?.token || !authUser || !callId) return;
      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.ProfilePic,
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId)

        await callInstance.join({create: true});
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error initializing chat", error.message);
        toast.error("Awww snap! this happens sometimes can you give the system a few minutes to gather her thoughts again?");
      }finally{
        setisConnecting(false);
      }
    }
    initCall();
  }, [tokenData, authUser, callId]);

  if(isLoading || isConnecting) return <ChatLoader />


  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) :
         (<div className="flex items-center justify-center h-full">
           <p> Could not initialize call. Please refresh or try again later.</p>
          </div>)
        }
      </div>
    </div>
  )
}

const CallContent = () =>{
  const {useCallCallingState}  = useCallStateHooks();
  const CallingState = useCallCallingState();

  const navigate = useNavigate();

  if(CallingState === CallingState.LEFT) return navigate("/");

  return(
    <>
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
    </>
  )
}

export default CallPage