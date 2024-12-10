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
  const [room, setRoom] = useState("21819");
  const [jwt, setJwt] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("User");
  const [videoVisible, setVideoVisible] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [screenShareTrack, setScreenShareTrack] = useState(null);

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
        setAudioOn,
        screenShareTrack,
        setScreenShareTrack

      }}
    >
      {children}
    </TracksContext.Provider>
  );
};
