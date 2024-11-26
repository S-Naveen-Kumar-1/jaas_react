// TracksContext.js
import React, { createContext, useContext, useState } from "react";

// Create the context
const TracksContext = createContext();

// Custom hook for using the context
export const useTracks = () => {
  return useContext(TracksContext);
};

// Provider component
export const TracksProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [conference, setConference] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState({});
  const [appId, setAppId] = useState("vpaas-magic-cookie-f75e697752254380b92d138a0bb42f3b");
  const [room, setRoom] = useState("naveen");
  const [jwt, setJwt] = useState("eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjc1ZTY5Nzc1MjI1NDM4MGI5MmQxMzhhMGJiNDJmM2IvMzM5ZjkwLVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3MzI2MDY0MjQsImV4cCI6MTczMjYxMzYyNCwibmJmIjoxNzMyNjA2NDE5LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtZjc1ZTY5Nzc1MjI1NDM4MGI5MmQxMzhhMGJiNDJmM2IiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6Im5hdmVlbi5zIiwiaWQiOiJnb29nbGUtb2F1dGgyfDEwMDU5OTEyMTQxODE1ODIyMjEwNyIsImF2YXRhciI6IiIsImVtYWlsIjoibmF2ZWVuLnNAY2FydmVuaWNoZS5jb20ifX0sInJvb20iOiIqIn0.kKpkqLJuBtzm_LdCAn3oDlpfC73LtNsuNDmk4MJ88o9COXIMu78OJgFMNRfCJkDfgfv_XKSK8osiy_p4pCjWofpFHxYa2XVl4rLMqq6gvQ-wVK99jDo7cvM0griwMlZvzJeCzCF4QtCmA7yfzp-_3eVIC-LrldR8raAfBSHqJIvetkm5TFIuQ5ZFnf6lbO2_4_8fVwCMJ12Hg331UjF0ZPrtkLhJo7pqDq-OVMe03b_VWfBod_X7gvBXfrKRaE5n2SOBbhGY5S2qRLpSVVAPbo9KyJGWQzuxwp-qpeHJ5za34RwW0gu_qjwc1WG_U2xyqBzVwKoNM7GZMJbXJ6sm2g");
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("User");
  const [videoVisible, setVideoVisible] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  return (
    <TracksContext.Provider
      value={{
        localAudioTrack,
        setLocalAudioTrack,
        localVideoTrack,
        setLocalVideoTrack,
        remoteTracks,
        setRemoteTracks,
        jwt,
        setJwt,
        connection,
        setConnection,
        conference,
        setConference,
        appId,
        setAppId,
        room,
        setRoom,
        isConnected,
        setIsConnected,
        userName,
        setUserName,
        videoVisible,
        setVideoVisible,
        audioOn,
        setAudioOn

      }}
    >
      {children}
    </TracksContext.Provider>
  );
};
