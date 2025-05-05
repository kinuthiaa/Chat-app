import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser.js';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import ChatLoader from '../components/ChatLoader.jsx';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageList,
  MessageInput,
  Thread,
  Window,
  TypingIndicator
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';

import CallButton from '../components/CallButton.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: Boolean(authUser)
  });

  useEffect(() => {
    let client = null;

    const initChat = async () => {
      if (!tokenData?.token || !authUser) {
        setLoading(false);
        return;
      }

      try {
        // Create new client instance if it doesn't exist
        client = StreamChat.getInstance(STREAM_API_KEY);

        // Check if we need to reconnect the user
        if (!client.userID || client.userID !== authUser._id) {
          // Ensure proper disconnection first
          if (client.userID) {
            await client.disconnectUser();
          }

          // Connect user with proper data
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.ProfilePic,
            },
            tokenData.token
          );

          // Create or get channel
          const channelId = [authUser._id, targetId].sort().join("-");
          const currentChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetId],
          });

          await currentChannel.watch();

          // Update state only if component is still mounted
          setChatClient(client);
          setChannel(currentChannel);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not initialize chat");
        // Clean up on error
        if (client?.userID) {
          await client.disconnectUser();
        }
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup function
    return () => {
      const cleanup = async () => {
        if (client?.userID) {
          await client.disconnectUser();
          setChatClient(null);
          setChannel(null);
        }
      };
      cleanup();
    };
  }, [targetId, authUser, tokenData]);

  const handleVideoCall  = () => {
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text:`Hey chat I've gone live let's make it a vibe: ${callUrl}`,
      })
      toast.success("Video links sent successfully!");

    }
  }

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className='h-screen flex overflow-hidden bg-base-200'>
      <div className="flex-1">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={channel}>
            <div className="w-full relative">
              <CallButton handleVideoCall={handleVideoCall} />
              <Window>
                <ChannelHeader />
                <MessageList
                  typingIndicator={TypingIndicator}
                  messageActions={["edit", "delete", "react", "reply"]}
                  additionalMessageInputProps={{
                    placeholder: 'Type your message here...',
                    autoFocus: true,
                  }}
                />
                <MessageInput
                  focus
                  className="str-chat__input-flat"
                  additionalTextareaProps={{
                    placeholder: 'Send a message',
                    rows: 1,
                  }}
                />
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;