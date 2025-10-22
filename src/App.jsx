import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  const hideControlsTimer = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('apply@knows.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleMouseLeave = () => {
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
              <div className="video-wrapper" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <video ref={videoRef} autoPlay loop playsInline>
                  <source src="/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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
