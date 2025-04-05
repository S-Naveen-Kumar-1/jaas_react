// TracksContext.js
import React, {
  createContext,

  useContext,
  useEffect,
  useState,
} from "react";
// Create the context
const TracksContext = createContext();
export const useTracks = () => {
  return useContext(TracksContext);
};

export const TracksProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);
  const [conference, setConference] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState({});
  const [appId, setAppId] = useState(
    "vpaas-magic-cookie-53ccaf42598243d593932049bc381fc8"
  );
  
  const [room, setRoom] = useState("screensharetest");
  const [jwt, setJwt] = useState("eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtNTNjY2FmNDI1OTgyNDNkNTkzOTMyMDQ5YmMzODFmYzgvMGI3MmE2LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NDM4NTIzNjQsImV4cCI6MTc0Mzg1OTU2NCwibmJmIjoxNzQzODUyMzU5LCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtNTNjY2FmNDI1OTgyNDNkNTkzOTMyMDQ5YmMzODFmYzgiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlfSwidXNlciI6eyJoaWRkZW4tZnJvbS1yZWNvcmRlciI6ZmFsc2UsIm1vZGVyYXRvciI6dHJ1ZSwibmFtZSI6ImthbmFrYXByYXNhZCIsImlkIjoiYXV0aDB8NjdlZTFjYjgwMmNlN2Y1ZDdmMTk5ZTk3IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJrYW5ha2FwcmFzYWRAY2FydmVuaWNoZS5jb20ifX0sInJvb20iOiIqIn0.V8Mu3QiFBW4BOJTCrB1TspQx7idGy70A_iZhuMXaVxv707jR1g2AX0DhWK-RNLjmEkrLzMjZuJHpguQ6LohIg7URsF_-4DgCiGhcR5Ty4VNgtfaDeF8V6zwzU_sjAg3uRkuAwEzB_BBIwr9zb9eEnHl_fwoDUlc_VDr4HuVqm1QQZ6ugau2OSJcrGI723bMbxEcim3ubcW2MDJyynOb7ZeUOxkUCp5Ko8TjBmIvly_GmzbDF7XL_bzS7kFh8gkxlrh2DC5C9xZnASBtio3avOhMCMOMmLzKFM64JagGtgxzjnRkRAL-51UkE9t0NIwyT3glpvepbUm3afM0g01Wwzg");
  const [isConnected, setIsConnected] = useState(false);
  const [videoVisible, setVideoVisible] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [screenShareTrack, setScreenShareTrack] = useState(null);
  const [isScreensharing, setIsScreenSharing] = useState(false);

  

  const handleRemoteTrack = async (track) => {
    if (track.isLocal()) return; 

    const participantId = track.getParticipantId();
    const videoType = track.videoType;
   

    console.log(
      `Remote track added: participantId=${participantId}, trackId=${track.getId()}, videoType=${videoType}`
    );

    if (videoType === "desktop") {
      // Handle screen share tracks separately
      console.log("Screen share track detected:", track);
      setScreenShareTrack(track);
    } else {
      // Handle regular remote tracks
      setRemoteTracks((prev) => {
        const existingTracks = prev[participantId] || [];
        if (!existingTracks.find((t) => t.getId() === track.getId())) {
          return {
            ...prev,
            [participantId]: [...existingTracks, track],
          };
        }
        console.log(prev,"remote tracks")
        return prev;
      });
    }
  };

  const buildOptions = (appId, room) => ({
    hosts: {
      domain: "8x8.vc",
      muc: `conference.${appId}.8x8.vc`,
      focus: "focus.8x8.vc",
    },
    serviceUrl: `wss://8x8.vc/${appId}/xmpp-websocket?room=${room}`,
  });

  const onConnectionSuccess = (conn,room) => {
    console.log("check user role inside onConnectionSucces",userRole)
    console.log("Connection established!",conn);
    const conf = conn.initJitsiConference(room, { openBridgeChannel: true });
    if (userRole) {
      conf.setDisplayName(userRole);
    }
    setConference(conf);
    // window.JitsiMeetJS.rtcstats.sendStatsEntry("user_joined", {
    //   userName: userName,
    //   userEmail: `${userName}@mail.com`,
    //   timestamp: new Date().toISOString(),
    // });

    conf.on(window.JitsiMeetJS.events.conference.TRACK_ADDED, (track) => {
      console.log("TRACK_ADDED:", track);
      if (!track.isLocal()) {
        handleRemoteTrack(track);
      }
    });

    conf.on(window.JitsiMeetJS.events.conference.TRACK_REMOVED, (track) => {
      console.log("TRACK_REMOVED:", track);
      const participantId = track.getParticipantId();
      setRemoteTracks((prev) => ({
        ...prev,
        [participantId]:
          prev[participantId]?.filter((t) => t.getId() !== track.getId()) || [],
      }));
    });

    conf.on(window.JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => {
      console.log("Conference joined!");
      setIsConnected(true);
    });

    conf.on(window.JitsiMeetJS.events.conference.USER_JOINED, (id) => {
      console.log(`User joined: ${id}`);
      
    });

    conf.on(
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

    // Add Local Tracks
    if (localAudioTrack) conf.addTrack(localAudioTrack);
    if (localVideoTrack) conf.addTrack(localVideoTrack);

    conf.join();
  };

  const joinMeeting = async () => {

    console.log(room,"room inisde joinMeeting check also jwt",jwt)
    const options = buildOptions(appId, room);
    const conn = new window.JitsiMeetJS.JitsiConnection(null, jwt, options);
    console.log(conn,"check conn")
    conn.addEventListener(
    window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      () => onConnectionSuccess(conn,room)
    );

    conn.addEventListener(
 window.JitsiMeetJS.events.connection.CONNECTION_FAILED,
      (error) => console.error("Connection failed:", error)
    );

    conn.connect();
    setConnection(conn);
  };
  

  const getStoredToken = async () => {
    try {

      
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  useEffect(()=>{
    getStoredToken()
  },[])

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
        userRole,
        screenShareTrack,
        setScreenShareTrack,
        isScreensharing,
        setIsScreenSharing,
        joinMeeting,
     
        setUserRole
      }}
    >
      {children}
    </TracksContext.Provider>
  );
};
