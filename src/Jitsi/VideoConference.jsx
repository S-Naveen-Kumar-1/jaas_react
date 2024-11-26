import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import './VideoConference.css';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

const VideoConference = () => {
  const [connection, setConnection] = useState(null);
  const [conference, setConference] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteTracks, setRemoteTracks] = useState({});
  const [appId, setAppId] = useState("vpaas-magic-cookie-4623fd3fa3744cd2b226170581c3dc4d");
  const [room, setRoom] = useState("naveen");
  const [jwt, setJwt] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("User");
  const [videoVisible, setVideoVisible] = useState(true);
  const [audioOn, setAudioOn] = useState(true);

  const videoRefs = useRef({});

  // Fetch JWT Token
  useEffect(() => {
    const fetchJwt = async () => {
      try {
        const response = await axios.get(
          "https://mathgames.begalileo.com/family_game/getJITSIJWT",
          {
            params: {
              userName,
              userEmail: `${userName}@example.com`,
              avatar: "https://d325uq16osfh2r.cloudfront.net/games/FamilyFun.png",
            },
          }
        );
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
      window.JitsiMeetJS.init();
      console.log("JitsiMeetJS initialized successfully!");
    } else {
      console.error("JitsiMeetJS is not loaded.");
    }
  }, []);

  // Create Local Tracks (Audio & Video)
  const createLocalTracks = async () => {
    if (localAudioTrack && localVideoTrack) {
      console.log("Local tracks already created.");
      return; // Skip creation if already created
    }

    try {
      const tracks = await window.JitsiMeetJS.createLocalTracks({
        devices: ["audio", "video"],
      });
      tracks.forEach((track) => {
        if (track.getType() === "audio") {
          setLocalAudioTrack(track);
        } else if (track.getType() === "video") {
          setLocalVideoTrack(track);
        }
      });
      console.log("Local tracks created:", tracks);
    } catch (error) {
      console.error("Error creating local tracks:", error);
    }
  };

  // Handle remote track
  const handleRemoteTrack = (track) => {
    if (track.isLocal()) return;

    const participantId = track.getParticipantId();
    console.log(`Adding track for participant ${participantId} with track ID: ${track.getId()}`);

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
  };

  // Build options for the connection
  const buildOptions = (appId, room) => ({
    hosts: {
      domain: "8x8.vc",
      muc: `conference.${appId}.8x8.vc`,
      focus: "focus.8x8.vc",
    },
    serviceUrl: `wss://8x8.vc/${appId}/xmpp-websocket?room=${room}`,
  });

  // Connection success callback
  const onConnectionSuccess = () => {
    console.log("Connection established!");
    if (connection) {
      try {
        const conf = connection.initJitsiConference(room, {
          openBridgeChannel: true,
        });
        setConference(conf);

        conf.on(
          window.JitsiMeetJS.events.conference.TRACK_ADDED,
          handleRemoteTrack
        );
        conf.on(window.JitsiMeetJS.events.conference.TRACK_REMOVED, (track) => {
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
        conf.on(window.JitsiMeetJS.events.conference.CONFERENCE_LEFT, () => {
          console.log("Left the conference!");
          setIsConnected(false);
        });
        conf.on(window.JitsiMeetJS.events.conference.CONFERENCE_LEFT, () => {
          console.log("Left the conference!");
          setIsConnected(false);
        });

        // Data channel setup for receiving alerts
        conf.on(
          window.JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED,
          (participant, receivedMessage) => {
            console.log(`Message from ${participant.getId()}:`, receivedMessage);
            if (receivedMessage.type === "ALERT") {
              // Handle alert messages
              alert(receivedMessage.message)
              // setReceivedAlerts((prev) => [...prev, receivedMessage.message]);
            }
          }
        );

        if (localAudioTrack) conf.addTrack(localAudioTrack);
        if (localVideoTrack) conf.addTrack(localVideoTrack);
        conf.join();
      } catch (error) {
        console.error("Error initializing conference:", error);
      }
    }
  };

  // Join meeting automatically (with delay handling for track creation)
  const joinMeeting = async () => {
    try {
      await createLocalTracks(); // Ensure local tracks are created before joining
      const options = buildOptions(appId, room);
      const conn = new window.JitsiMeetJS.JitsiConnection(null, jwt, options);

      conn.addEventListener(
        window.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        onConnectionSuccess
      );
      conn.addEventListener(
        window.JitsiMeetJS.events.connection.CONNECTION_FAILED,
        (error) => console.error("Connection failed:", error)
      );
      conn.connect();
      setConnection(conn);
    } catch (error) {
      console.error("Error joining meeting:", error);
    }
  };

  // Leave meeting and clean up tracks
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

  // Toggle track (mute/unmute)
  const toggleTrack = (track) => {
    if (track.type === "video") {
      setVideoVisible(!videoVisible);
      const videoElement = document.getElementById("local-video");
      if (videoElement) {
        videoElement.style.display = videoVisible ? "none" : "block";
      }
    } else if (track.type === "audio") {
      setAudioOn(!audioOn);
    }
    if (track) track.isMuted() ? track.unmute() : track.mute();
  };
  const sendAlert = () => {
    if (conference) {
      try {
        const alertPayload = {
          type: "ALERT",
          message: "test",
        };
        conference.sendEndpointMessage("", alertPayload); // Broadcast to all participants
        console.log("Alert sent:", alertPayload);
      } catch (error) {
        console.error("Error sending alert:", error);
      }
    }
  };
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div>
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="input-name"
        />
      </div>
  
      <div className="video-container">
        <div className="local-tracks">
          {localVideoTrack && (
            <Draggable>
              <div className="video-box">
                {videoVisible && (
                  <video
                    ref={(ref) => ref && localVideoTrack.attach(ref)}
                    autoPlay
                    playsInline
                    controls={false}
                    id="local-video"
                    className="video"
                  />
                )}
                <div className="controls">
                  <button onClick={() => toggleTrack(localAudioTrack)} className="audio-toggle">
                    {audioOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  </button>
                  <button onClick={() => toggleTrack(localVideoTrack)} className="video-toggle">
                    {videoVisible ? <FaVideo /> : <FaVideoSlash />}
                  </button>
                </div>
              </div>
            </Draggable>
          )}
        </div>

        <div className="remote-tracks">
          {Object.keys(remoteTracks).map((participantId) => (
            <div className="video-box" key={participantId}>
              {remoteTracks[participantId].map((track) => {
                if (track.getType() === "video") {
                  return (
                    <video
                      key={track.getId()}
                      ref={(ref) => ref && track.attach(ref)}
                      autoPlay
                      playsInline
                      className="video"
                    />
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button onClick={joinMeeting} className="action-btn">
          Join Meeting
        </button>
        {isConnected && (
          <button onClick={leaveMeeting} className="action-btn">
            Leave Meeting
          </button>
        )}
      {  isConnected &&<button onClick={sendAlert}> send alert</button>}
      </div>
    </div>
  );
};

export default VideoConference;