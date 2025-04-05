import React, { useEffect, useRef } from 'react';
import { useTracks } from './JitsiContext';
import './JitsiConference.css';

const JitsiConference = () => {
  const {
    localVideoTrack,
    localAudioTrack,
    remoteTracks,
    screenShareTrack,
    joinMeeting,
    setLocalAudioTrack,
    setLocalVideoTrack,
    isJoined,
    conference,
    setScreenShareTrack,
    isConnected,
  } = useTracks();

  const localVideoRef = useRef(null);

  useEffect(() => {
    if (window.JitsiMeetJS) {
      window.JitsiMeetJS.init({ disableAudioLevels: false });
      console.log('window.JitsiMeetJS initialized');
      createLocalTracks();
    } else {
      console.error('window.JitsiMeetJS is not loaded.');
    }
  }, []);

  const createLocalTracks = async () => {
    if (localAudioTrack && localVideoTrack) return;

    try {
      const tracks = await window.JitsiMeetJS.createLocalTracks({
        devices: ['audio', 'video'],
        resolution: 720,
      });

      tracks.forEach(track => {
        if (track.getType() === 'audio') setLocalAudioTrack(track);
        else if (track.getType() === 'video') setLocalVideoTrack(track);
      });

      console.log('Local tracks created:', tracks);
    } catch (error) {
      console.error('Error creating local tracks:', error);
    }
  };

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

  const startScreenShare = async () => {
    try {
      const tracks = await window.JitsiMeetJS.createLocalTracks({
        devices: ["desktop"],
      });

      const screenTrack = tracks.find((track) => track.getType() === "video");
      if (screenTrack) {
        if (conference) {
          await conference.addTrack(screenTrack);
        }
        if (screenShareTrack) {
          screenShareTrack.dispose();
        }
        setScreenShareTrack(screenTrack);
        console.log("Screen share started", screenTrack);
      } else {
        console.error("No screen track created.");
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  const applyVirtualBackground = (videoRef, backgroundUrl) => {
    if (!videoRef || !videoRef.srcObject) return;
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous'; // Only works if the server allows it
    bgImg.src = backgroundUrl;
  
    const video = videoRef;
  
    bgImg.onload = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      const drawFrame = () => {
        if (video.videoWidth === 0 || video.videoHeight === 0) return;
  
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height); // Background
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Video
  
        requestAnimationFrame(drawFrame);
      };
  
      drawFrame();
  
      try {
        const stream = canvas.captureStream();
        video.srcObject = stream;
      } catch (e) {
        console.error('Could not capture canvas stream:', e);
      }
    };
  
    bgImg.onerror = () => {
      console.error('Failed to load background image');
    };
  };
  

  return (
    <div className="conference-wrapper">
      {!isConnected && (
        <button className="join-btn" onClick={joinMeeting}>Join Meeting</button>
      )}

      <div className="tracks-section">
        <div className="video-card">
          <div className="label">You</div>
          {localVideoTrack ? (
            <video
              ref={(ref) => {
                if (ref && localVideoTrack) localVideoTrack.attach(ref);
                localVideoRef.current = ref;
              }}
              autoPlay
              playsInline
              className="video"
            />
          ) : (
            <p>Loading camera...</p>
          )}
        </div>

        {Object.keys(remoteTracks).map((participantId) =>
          remoteTracks[participantId]
            .filter((track) => track.getType() === "video")
            .map((track) => (
              <div key={track.getId()} className="video-card">
                <div className="label">Remote</div>
                <video
                  ref={(ref) => ref && track.attach(ref)}
                  autoPlay
                  playsInline
                  className="video"
                />
              </div>
            ))
        )}

        {screenShareTrack && (
          <div className="video-card screen-share">
            <div className="label">Screen Share</div>
            <video
              ref={(ref) => ref && screenShareTrack.attach(ref)}
              autoPlay
              playsInline
              className="video"
            />
          </div>
        )}
      </div>

      {isConnected && (
        <div className="controls">
          <button onClick={startScreenShare} className="control-btn">Start Screen Share</button>
          <button onClick={stopScreenShare} className="control-btn">Stop Screen Share</button>
          <button
            onClick={() =>
              applyVirtualBackground(localVideoRef.current, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaJbOPqCm6-6KCBAeEnl6GZ2YQkLhMpq1wJg&s')
            }
            className="control-btn"
          >
            Apply Virtual Background
          </button>
        </div>
      )}
    </div>
  );
};

export default JitsiConference;
