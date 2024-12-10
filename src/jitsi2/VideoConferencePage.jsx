import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../Jitsi/VideoConference.css";
import { useTracks } from "./JitsiContext";
import { BASE_URL } from "../helpers/config";

const VideoConference = () => {
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
    setScreenShareTrack,
    screenShareTrack,
  } = useTracks();
  const videoRefs = useRef({});

  // Fetch JWT Token
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getJITSIJWT`, {
          params: {
            userName,
            userEmail: `${userName}@example.com`,
            avatar: "https://d325uq16osfh2r.cloudfront.net/games/FamilyFun.png",
          },
        });
        setJwt(response.data.token);
      } catch (error) {
        console.error("Error fetching JWT:", error);
      }
    };

    fetchJwt();
  }, [userName]);

  // Initialize JitsiMeetJS
  useEffect(() => {
    if (window.JitsiMeetJS) {
      const initOptions = {
        // Your existing options
        analytics: {
          rtcstatsEnabled: true,
          rtcstatsEndpoint: "wss://rtcstats-server-8x8.jitsi.net/"  // Endpoint for RTCStats
        },
      };
  
      window.JitsiMeetJS.init(initOptions);
      console.log("JitsiMeetJS initialized with RTCStats enabled!");
    } else {
      console.error("JitsiMeetJS is not loaded.");
    }
  }, []);
  

  // Create Local Tracks
  const createLocalTracks = async () => {
    if (localAudioTrack && localVideoTrack) return; // Local tracks already created

    try {
      const tracks = await window.JitsiMeetJS.createLocalTracks({
        devices: ["audio", "video"],
      });

      tracks.forEach((track) => {
        if (track.getType() === "audio") setLocalAudioTrack(track);
        else if (track.getType() === "video") setLocalVideoTrack(track);
      });
      console.log("Local tracks created:", tracks);
    } catch (error) {
      console.error("Error creating local tracks:", error);
    }
  };

  // Handle Remote Tracks
  const handleRemoteTrack = (track) => {
    if (track.isLocal()) return; // Ignore local tracks

    const participantId = track.getParticipantId();
    const videoType = track.videoType;

    console.log(
      `Remote track added: participantId=${participantId}, trackId=${track.getId()}, videoType=${videoType}`
    );

    if (videoType === "desktop") {
 
      // Handle screen share tracks separately
      console.log("Screen share track detected:", track);
      setScreenShareTrack(track);
    }
     else {
      // Handle regular remote tracks
      setRemoteTracks((prev) => {
        const existingTracks = prev[participantId] || [];
        if (!existingTracks.find((t) => t.getId() === track.getId())) {
          return {
            ...prev,
            [participantId]: [...existingTracks, track],
          };
        }
        return prev;
      });
    }
  };

  // Build Connection Options
  const buildOptions = (appId, room) => ({
    hosts: {
      domain: "8x8.vc",
      muc: `conference.${appId}.8x8.vc`,
      focus: "focus.8x8.vc",
    },
    serviceUrl: `wss://8x8.vc/${appId}/xmpp-websocket?room=${room}`,
  });

  // Handle Connection Success
  const onConnectionSuccess = (conn) => {
    console.log("Connection established!");
    const conf = conn.initJitsiConference(room, { openBridgeChannel: true });
    setConference(conf);
    window.JitsiMeetJS.rtcstats.sendStatsEntry("user_joined", {
      userName: userName,
      userEmail: `${userName}@example.com`,
      timestamp: new Date().toISOString(),
    });
  
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

    conf.on(window.JitsiMeetJS.events.conference.USER_LEFT, (id) => {
      console.log(`User left: ${id}`);
      window.JitsiMeetJS.rtcstats.sendStatsEntry("user_left", {
        userId: id,
        timestamp: new Date().toISOString(),
      });
    });

    // Add Local Tracks
    if (localAudioTrack) conf.addTrack(localAudioTrack);
    if (localVideoTrack) conf.addTrack(localVideoTrack);

    conf.join();
  };

  // Join Meeting
  const joinMeeting = async () => {
    await createLocalTracks();
    window.JitsiMeetJS.rtcstats.sendStatsEntry("user_joined", {
      userName: userName,
      userEmail: `${userName}@example.com`,
      timestamp: new Date().toISOString(),
    })
    const options = buildOptions(appId, room);
    const conn = new window.JitsiMeetJS.JitsiConnection(null, jwt, options);

    conn.addEventListener(
      window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      () => onConnectionSuccess(conn)
    );

    conn.addEventListener(
      window.JitsiMeetJS.events.connection.CONNECTION_FAILED,
      (error) => console.error("Connection failed:", error)
    );

    conn.connect();
    setConnection(conn);
  };

  // Leave Meeting
  const leaveMeeting = () => {
    if (conference) {
      conference.leave();
      setIsConnected(false);
    }
    
    if (localAudioTrack) localAudioTrack.dispose();
    if (localVideoTrack) localVideoTrack.dispose();
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
    setRemoteTracks({});
    if (connection) connection.disconnect();
  };

  // Start Screen Share
  const startScreenShare = async () => {
    try {
      const tracks = await window.JitsiMeetJS.createLocalTracks({
        devices: ["desktop"], // Request screen share track
      });

      const screenTrack = tracks.find((track) => track.getType() === "video");
      if (screenTrack) {
        if (conference) {
          await conference.addTrack(screenTrack); // Add to the conference
        }
        if (screenShareTrack) {
          screenShareTrack.dispose(); // Dispose of previous track
        }
        setScreenShareTrack(screenTrack); // Update state
        console.log("Screen share started", screenTrack);
      } else {
        console.error("No screen track created.");
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  // Stop Screen Share
  const stopScreenShare = async () => {
    if (screenShareTrack) {
      if (conference) {
        await conference.removeTrack(screenShareTrack);
      }
      screenShareTrack.dispose();
      setScreenShareTrack(null);
      console.log("Screen share stopped");
    }
  };

  console.log(screenShareTrack, "jksdkjc");
  return (
    <div className="video-conference">
      <input
        type="text"
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <div className="local-tracks">
        {localVideoTrack && (
          <video
            ref={(ref) => ref && localVideoTrack.attach(ref)}
            autoPlay
            playsInline
            className="video"
          />
        )}
      </div>
      <div className="remote-tracks">
        {Object.keys(remoteTracks).map((participantId) =>
          remoteTracks[participantId]
            .filter((track) => track.getType() === "video")
            .map((track) => (
              <video
                key={track.getId()}
                ref={(ref) => ref && track.attach(ref)}
                autoPlay
                playsInline
                className="video"
              />
            ))
        )}
      </div>
      <div className="screen-share">
        {screenShareTrack ? (
          <video
            ref={(ref) => ref && screenShareTrack.attach(ref)}
            autoPlay
            playsInline
            className="screen-share-video"
          />
        ) : (
          <p>No screen sharing active</p>
        )}
      </div>

      <button onClick={joinMeeting}>Join Meeting</button>
      {isConnected && (
        <>
          <button onClick={startScreenShare}>Start Screen Share</button>
          <button onClick={stopScreenShare}>Stop Screen Share</button>
          <button onClick={leaveMeeting}>Leave Meeting</button>
        </>
      )}
    </div>
  );
};

export default VideoConference;
