import React from "react";
import { useTracks } from "./JitsiContext";

export const AlertPage = () => {
  const {
    localAudioTrack,
    localVideoTrack,
    remoteTracks,
    connection,
    setConnection,
    setLocalAudioTrack,
    setLocalVideoTrack,
    setRemoteTracks,
    setConference,
    conference,
    appId,
    setAppId,
    room,
    setRoom,
    jwt,
    setJwt,
    isConnected,
    setIsConnected,
    userName,
    setUserName,

    videoVisible,
    setVideoVisible,
    audioOn,
    setAudioOn,
  } = useTracks();

  console.log(localAudioTrack, localVideoTrack, remoteTracks,"inside AlertPage");
  return <div>AlertPage</div>;
};
