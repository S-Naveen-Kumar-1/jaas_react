import React, { useEffect, useRef, useState } from 'react';
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
  const [backgroundUrl, setBackgroundUrl] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyBJBXL5ATCXe7lcuqm8sess0nK49jNLVUvA&s" 
  );

  useEffect(() => {
    if (window.JitsiMeetJS) {
      window.JitsiMeetJS.init({ disableAudioLevels: false });
      console.log('JitsiMeetJS initialized');
      createLocalTracks();
    } else {
      console.error('JitsiMeetJS is not loaded.');
    }
  }, []);

  const createLocalTracks = async () => {
    if (localAudioTrack && localVideoTrack) return;

    try {
      const tracks = await window.JitsiMeetJS.createLocalTracks({
        devices: ['audio', 'video'],
        resolution: 720,
      });

      tracks.forEach((track) => {
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
  const virtualBackgroundEffect = {
    isEnabled: (track) => track.isVideoTrack(),
    stopEffect: () => {
      console.log('Stopping virtual background effect.');
    },
    startEffect: (stream) => {
      console.log('Starting virtual background effect.');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;

      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous'; 
      bgImg.src = backgroundUrl;

      bgImg.onload = () => {
        console.log('Background image loaded successfully.');
        videoElement.play();

        const drawFrame = () => {
          if (videoElement.videoWidth && videoElement.videoHeight) {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          }

          requestAnimationFrame(drawFrame);
        };

        drawFrame();
      };

      bgImg.onerror = () => {
        console.error('Failed to load background image.');
      };

      return canvas.captureStream();
    },
  };

  const applyVirtualBackgroundEffect = async () => {
    if (!localVideoTrack) {
      console.error('No video track available.');
      return;
    }

    try {
      await localVideoTrack.setEffect(virtualBackgroundEffect);
      console.log('Virtual background effect applied successfully.');
    } catch (error) {
      console.error('Error applying virtual background effect:', error);
    }
  };



  return (
    <div className="conference-wrapper">
      {!isConnected && (
        <button className="join-btn" onClick={joinMeeting}>
          Join Meeting
        </button>
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
            .filter((track) => track.getType() === 'video')
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
            onClick={applyVirtualBackgroundEffect}
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