import React, { useEffect } from "react";
import { useTracks } from "./JitsiContext";
import axios from "axios";

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
  
  useEffect(() => {
    if (conference) {
      console.log(conference,"check conference inside alert")
      // alert("alert page")
      conference.on(
        window.JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED,
        (participant, receivedMessage) => {
          console.log(`Message from ${participant.getId()}:`, receivedMessage);
          if (receivedMessage.type === "ALERT") {
            // Handle alert messages
            alert(receivedMessage.message);
            // setReceivedAlerts((prev) => [...prev, receivedMessage.message]);
          }
        }
      );

    }
  }, [conference]);

  console.log(remoteTracks, "inside AlertPage");

  const handleRoomDetails=async()=>{
    console.log(jwt)
    const apiUrl = `https://api.8x8.vc/v2/analytics/conferences`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          roomName: room,
        },
      });
  
      console.log("Conference Details:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching conference details:", error);
    }
  }
  return (
    <div>
      <button onClick={handleRoomDetails}>get room details</button>
    </div>
  );
};
