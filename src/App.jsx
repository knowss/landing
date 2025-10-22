import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const hideControlsTimer = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (window.Vimeo && playerRef.current) {
      const player = new window.Vimeo.Player(playerRef.current);
      playerRef.current.vimeoPlayer = player;

      // Check and sync the actual muted state from Vimeo
      player.ready().then(() => {
        player.getMuted().then((muted) => {
          console.log('Vimeo player muted state:', muted);
          setIsMuted(muted);

          // If it's muted, try to unmute it
          if (muted) {
            player.setMuted(false).then(() => {
              player.getMuted().then((nowMuted) => {
                console.log('After unmute attempt:', nowMuted);
                setIsMuted(nowMuted);
              });
            });
          }
        });

        player.getVolume().then((volume) => {
          console.log('Vimeo player volume:', volume);
          if (volume === 0) {
            player.setVolume(1);
          }
        });
      });

      // Video starts paused, showing play button
      setIsPlaying(false);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('apply@knows.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlay = async (e) => {
    // Stop event propagation to prevent triggering handleInteraction
    if (e) {
      e.stopPropagation();
    }

    if (playerRef.current?.vimeoPlayer) {
      const paused = await playerRef.current.vimeoPlayer.getPaused();
      if (paused) {
        // On mobile, we need to unmute AFTER user interaction
        // Do this synchronously before any await that might break the user gesture chain
        const player = playerRef.current.vimeoPlayer;

        // Chain all the promises together to maintain user gesture
        try {
          await Promise.all([
            player.setMuted(false),
            player.setVolume(1)
          ]);

          // Verify the state was set correctly
          const actualMuted = await player.getMuted();
          console.log('Play: After setMuted(false), actual muted state:', actualMuted);
          setIsMuted(actualMuted);

          await player.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing video:', error);
          // Try one more time with explicit play
          try {
            await player.play();
            setIsPlaying(true);
          } catch (e) {
            console.error('Second play attempt failed:', e);
          }
        }
      } else {
        await playerRef.current.vimeoPlayer.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = async (e) => {
    // Stop event propagation
    if (e) {
      e.stopPropagation();
    }

    if (playerRef.current?.vimeoPlayer) {
      const muted = await playerRef.current.vimeoPlayer.getMuted();
      console.log('ToggleMute: Current muted state:', muted);

      if (muted) {
        // Unmute - use Promise.all to maintain user gesture on mobile
        await Promise.all([
          playerRef.current.vimeoPlayer.setMuted(false),
          playerRef.current.vimeoPlayer.setVolume(1)
        ]);
        const newMuted = await playerRef.current.vimeoPlayer.getMuted();
        console.log('ToggleMute: After unmute, new state:', newMuted);
        setIsMuted(newMuted);
      } else {
        // Mute
        await playerRef.current.vimeoPlayer.setMuted(true);
        const newMuted = await playerRef.current.vimeoPlayer.getMuted();
        console.log('ToggleMute: After mute, new state:', newMuted);
        setIsMuted(newMuted);
      }
    }
  };

  const handleInteraction = async () => {
    // On first interaction on mobile, ensure unmute
    if (!hasInteracted.current && playerRef.current?.vimeoPlayer) {
      hasInteracted.current = true;
      try {
        await Promise.all([
          playerRef.current.vimeoPlayer.setMuted(false),
          playerRef.current.vimeoPlayer.setVolume(1)
        ]);
        const actualMuted = await playerRef.current.vimeoPlayer.getMuted();
        console.log('First interaction: Unmuted state:', actualMuted);
        setIsMuted(actualMuted);
      } catch (e) {
        console.log('Could not unmute on first interaction:', e);
      }
    }

    setShowControls(true);

    // Auto-hide controls after 2 seconds of inactivity
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleMouseLeave = () => {
    // Hide controls when mouse leaves the video area
    setShowControls(false);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
  };

  return (
    <div className="app">
      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <h1>your AI clone to manage the people in your life.</h1>
        </section>

        {/* Video Section */}
        <section className="video-section">
          <div className="grid-decoration grid-left"></div>
          <div className="video-container">
            <div className="video-frame">
              <div className="video-wrapper" onMouseMove={handleInteraction} onTouchStart={handleInteraction} onClick={handleInteraction} onMouseLeave={handleMouseLeave}>
                <iframe
                  ref={playerRef}
                  src="https://player.vimeo.com/video/1129379665?loop=1&muted=0&autopause=0&byline=0&title=0&controls=0"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                ></iframe>
                <div className={`video-controls ${showControls ? 'visible' : ''}`}>
                  <button className="play-btn" onClick={togglePlay}>
                    {isPlaying ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    )}
                  </button>
                  <button className="mute-btn" onClick={toggleMute}>
                    {isMuted ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-decoration grid-right"></div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <p>if you've made it this far, send us your CV to:</p>
          <button className="signup-btn" onClick={copyToClipboard}>
            {copied ? 'COPIED!' : 'apply@knows.app'}
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;
