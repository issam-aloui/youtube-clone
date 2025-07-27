// components/VideoPlayer.jsx
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Custom YouTube‑style CSS
const qualityButtonStyles = `
  /* YouTube-style player styling with responsive design */
  .video-js { 
    font-family: "Roboto", "Arial", sans-serif; 
    background-color: #000; 
    width: 100% !important;
    height: auto !important;
  }
  
  /* Responsive video container */
  .video-js .vjs-tech {
    width: 100% !important;
    height: auto !important;
  }
  
  .video-js .vjs-control-bar { background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%); height: 40px; padding: 0 8px; display: flex; align-items: center; justify-content: space-between; }
  .video-js .vjs-progress-control { position: absolute; bottom: 40px; left: 0; right: 0; height: 20px; padding: 8px 0; width: 100%; z-index: 10; }
  .video-js .vjs-progress-holder { height: 5px; background: rgba(255, 255, 255, 0.3); border-radius: 3px; position: relative; cursor: pointer; transition: height 0.2s ease; }
  .video-js .vjs-load-progress, .video-js .vjs-load-progress div { background: rgba(255, 255, 255, 0.4); border-radius: 3px; }
  .video-js .vjs-play-progress { background: #ff0000; border-radius: 3px; position: relative; }
  .video-js .vjs-play-progress:after { content: ''; position: absolute; top: 50%; right: -6px; width: 12px; height: 12px; background: #ff0000; border-radius: 50%; transform: translateY(-50%); opacity: 1; box-shadow: 0 0 4px rgba(0,0,0,0.5); transition: all 0.2s ease; }
  .video-js .vjs-progress-control:hover .vjs-play-progress:after, .video-js .vjs-progress-control.vjs-slider:hover .vjs-play-progress:after { opacity: 1; width: 14px; height: 14px; right: -7px; box-shadow: 0 0 8px rgba(255,0,0,0.6); }
  .video-js .vjs-progress-control:hover .vjs-progress-holder, .video-js .vjs-progress-control.vjs-slider:hover .vjs-progress-holder { height: 7px; }
  .video-js.vjs-playing .vjs-progress-holder { background: rgba(255, 255, 255, 0.4); }
  .video-js.vjs-playing .vjs-play-progress:after { opacity: 1; }
  .video-js .vjs-progress-holder .chapter-marker { position: absolute; top: 0; width: 2px; height: 100%; background: rgba(255, 255, 255, 0.8); border-radius: 1px; z-index: 2; }
  .video-js .vjs-progress-control:hover .chapter-marker { height: 100%; background: rgba(255, 255, 255, 0.9); }
  
  /* Standardized button sizing and centering */
  .video-js .vjs-button { 
    width: 40px; 
    height: 40px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: white; 
    font-size: 16px; 
    margin: 0 2px; 
    padding: 0;
    border: none;
    background: transparent;
  }
  
  /* Ensure all SVG icons are the same size and centered */
  .video-js .vjs-button svg, 
  .video-js .vjs-button .vjs-icon-placeholder {
    width: 18px !important; 
    height: 18px !important; 
    fill: currentColor;
    display: block;
  }
  
  /* Play button specific styling */
  .video-js .vjs-play-control svg {
    width: 20px !important;
    height: 20px !important;
  }
  
  .video-js .vjs-button:hover { 
    color: white; 
    background: rgba(255, 255, 255, 0.1); 
    border-radius: 4px; 
  }
  /* Volume panel styling */
  .video-js .vjs-volume-panel { 
    display: flex; 
    align-items: center; 
    height: 40px; 
  }
  
  .video-js .vjs-volume-control { 
    background: transparent; 
    width: 60px; 
    margin-left: 8px; 
  }
  
  .video-js .vjs-volume-bar { 
    background: rgba(255, 255, 255, 0.2); 
    height: 3px; 
    border-radius: 2px; 
  }
  
  .video-js .vjs-volume-level { 
    background: white; 
    border-radius: 2px; 
  }
  
  /* Quality button styling with consistent sizing */
  .video-js .vjs-quality-button { 
    cursor: pointer; 
    width: 40px; 
    height: 40px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    margin: 0 2px; 
    color: white; 
    padding: 0;
    border: none;
    background: transparent;
  }
  
  .video-js .vjs-quality-button svg { 
    width: 18px !important; 
    height: 18px !important; 
    fill: currentColor; 
  }
  
  .video-js .vjs-quality-button:hover { 
    color: #fff; 
    background: rgba(255, 255, 255, 0.1); 
    border-radius: 4px; 
  }
  .video-js .vjs-remaining-time, .video-js .vjs-live-control, .video-js .vjs-playback-rates { display: none; }
  .video-js .vjs-current-time, .video-js .vjs-time-divider, .video-js .vjs-duration { display: block !important; color: white; font-size: 16px; font-weight: 500; margin: 0 6px; height: 44px; display: flex; align-items: center; }
  .video-js .vjs-current-time .vjs-current-time-display, .video-js .vjs-duration .vjs-duration-display { color: white; }
  .video-js.vjs-user-inactive .vjs-progress-control { opacity: 0.8; transition: opacity 0.3s ease; }
  .video-js.vjs-user-inactive:hover .vjs-progress-control { opacity: 1; }
  /* Control grouping styles with consistent sizing */
  .vjs-left-controls { 
    display: flex; 
    align-items: center; 
    height: 40px; 
    gap: 4px;
  }
  
  .vjs-right-controls { 
    display: flex; 
    align-items: center; 
    height: 40px; 
    gap: 4px;
  }
  
  /* Time display styling */
  .video-js .vjs-current-time, 
  .video-js .vjs-time-divider, 
  .video-js .vjs-duration { 
    display: flex !important; 
    align-items: center;
    color: white; 
    font-size: 14px; 
    font-weight: 400; 
    margin: 0 4px; 
    height: 40px; 
  }
  
  /* Responsive design for mobile devices */
  @media (max-width: 768px) {
    .video-js .vjs-button { 
      width: 36px; 
      height: 36px; 
      margin: 0 1px;
    }
    
    .video-js .vjs-button svg { 
      width: 16px !important; 
      height: 16px !important; 
    }
    
    .video-js .vjs-play-control svg {
      width: 18px !important;
      height: 18px !important;
    }
    
    .video-js .vjs-quality-button { 
      width: 36px; 
      height: 36px; 
    }
    
    .video-js .vjs-quality-button svg { 
      width: 16px !important; 
      height: 16px !important; 
    }
    
    .video-js .vjs-current-time, 
    .video-js .vjs-time-divider, 
    .video-js .vjs-duration { 
      font-size: 12px; 
      margin: 0 2px;
    }
    
    .vjs-left-controls, 
    .vjs-right-controls { 
      height: 36px; 
      gap: 2px;
    }
  }
  
  @media (max-width: 480px) {
    .video-js .vjs-button { 
      width: 32px; 
      height: 32px; 
    }
    
    .video-js .vjs-button svg { 
      width: 14px !important; 
      height: 14px !important; 
    }
    
    .video-js .vjs-play-control svg {
      width: 16px !important;
      height: 16px !important;
    }
    
    .video-js .vjs-quality-button { 
      width: 32px; 
      height: 32px; 
    }
    
    .video-js .vjs-current-time, 
    .video-js .vjs-time-divider, 
    .video-js .vjs-duration { 
      font-size: 11px; 
      margin: 0 1px;
    }
    
    .vjs-left-controls, 
    .vjs-right-controls { 
      height: 32px; 
      gap: 1px;
    }
  }
`;

// Inject styles once
if (typeof document !== "undefined") {
  const styleEl = document.createElement("style");
  styleEl.textContent = qualityButtonStyles;
  styleEl.setAttribute("data-quality-button", "true");
  if (!document.head.querySelector("style[data-quality-button]")) {
    document.head.appendChild(styleEl);
  }
}

let pluginsLoaded = false;
const loadPlugins = async () => {
  if (!pluginsLoaded) {
    try {
      if (!videojs.getPlugin("qualityLevels"))
        await import("videojs-contrib-quality-levels");
      if (!videojs.getPlugin("httpSourceSelector"))
        await import("videojs-http-source-selector");
      pluginsLoaded = true;
    } catch (e) {
      console.warn("Quality plugins not available:", e);
    }
  }
};

const VideoPlayer = ({ src, type = "video/mp4" }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current && videoRef.current && src) {
      const timer = setTimeout(async () => {
        if (type === "application/x-mpegURL") await loadPlugins();
        playerRef.current = videojs(videoRef.current, {
          controls: true,
          responsive: true,
          fluid: true,
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          sources: [{ src, type }],
          html5: {
            hls: {
              overrideNative: true,
              smoothQualityChange: true,
              enableLowInitialPlaylist: true,
              handlePartialData: true,
              maxBufferLength: 30,
              maxMaxBufferLength: 600,
              maxBufferSize: 60e6,
              maxBufferHole: 0.5,
            },
          },
        });
        if (type === "application/x-mpegURL")
          setupQualityControl(playerRef.current);
        setupControlLayout(playerRef.current);
        setupKeyboardShortcuts(playerRef.current);
        addChapterMarkers(playerRef.current);
        enhanceProgressBarVisibility(playerRef.current);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [src, type]);

  const setupControlLayout = (player) => {
    player.ready(() => {
      const controlBar = player.controlBar;

      // Create left and right control groups
      const leftControls = document.createElement("div");
      leftControls.className = "vjs-left-controls";

      const rightControls = document.createElement("div");
      rightControls.className = "vjs-right-controls";

      // First, preserve the progress control
      const progressControl = controlBar.progressControl;

      // Store all control elements we want to keep
      const playToggle = controlBar.playToggle;
      const volumePanel = controlBar.volumePanel;
      const currentTimeDisplay = controlBar.currentTimeDisplay;
      const timeDivider = controlBar.timeDivider;
      const durationDisplay = controlBar.durationDisplay;
      const playbackRateMenuButton = controlBar.playbackRateMenuButton;
      const pictureInPictureToggle = controlBar.pictureInPictureToggle;
      const fullscreenToggle = controlBar.fullscreenToggle;

      // Clear the control bar but keep progress control
      controlBar.el().innerHTML = "";

      // Re-add progress control first (so it stays in its original position)
      if (progressControl) {
        controlBar.el().appendChild(progressControl.el());
      }

      // Add control groups to control bar
      controlBar.el().appendChild(leftControls);
      controlBar.el().appendChild(rightControls);

      // Move play button, volume, and time display to left
      if (playToggle) {
        leftControls.appendChild(playToggle.el());
      }
      if (volumePanel) {
        leftControls.appendChild(volumePanel.el());
      }
      if (currentTimeDisplay) {
        leftControls.appendChild(currentTimeDisplay.el());
        currentTimeDisplay.el().style.display = "block";
      }
      if (timeDivider) {
        leftControls.appendChild(timeDivider.el());
        timeDivider.el().style.display = "block";
      }
      if (durationDisplay) {
        leftControls.appendChild(durationDisplay.el());
        durationDisplay.el().style.display = "block";
      }

      // Move other controls to right
      if (playbackRateMenuButton) {
        rightControls.appendChild(playbackRateMenuButton.el());
      }
      if (pictureInPictureToggle) {
        rightControls.appendChild(pictureInPictureToggle.el());
      }
      if (fullscreenToggle) {
        rightControls.appendChild(fullscreenToggle.el());
      }

      // Store references for quality button
      player.leftControls = leftControls;
      player.rightControls = rightControls;
      player.qualityButtonAdded = false; // Flag to prevent multiple quality buttons
    });
  };

  const enhanceProgressBarVisibility = (player) => {
    player.ready(() => {
      const progressControl = player.controlBar.progressControl;
      if (progressControl) {
        const progressHolder = progressControl
          .el()
          .querySelector(".vjs-progress-holder");
        if (progressHolder) {
          progressHolder.addEventListener("mouseenter", () => {
            player.addClass("vjs-progress-hover");
          });
          progressHolder.addEventListener("mouseleave", () => {
            player.removeClass("vjs-progress-hover");
          });
        }
      }
    });
  };

  const addChapterMarkers = (player) => {
    player.ready(() => {
      const chapters = [
        { time: 30, title: "Introduction" },
        { time: 120, title: "Main Content" },
        { time: 240, title: "Conclusion" },
      ];

      const progressHolder = player.el().querySelector(".vjs-progress-holder");
      if (progressHolder && chapters.length > 0) {
        chapters.forEach((chapter) => {
          const marker = document.createElement("div");
          marker.className = "chapter-marker";
          marker.title = chapter.title;

          player.on("loadedmetadata", () => {
            const duration = player.duration();
            if (duration && chapter.time < duration) {
              const percentage = (chapter.time / duration) * 100;
              marker.style.left = `${percentage}%`;
              progressHolder.appendChild(marker);
            }
          });
        });
      }
    });
  };

  const setupQualityControl = (player) => {
    player.ready(() => {
      if (player.qualityLevels && !player.qualityButtonAdded) {
        const qualityLevels = player.qualityLevels();
        qualityLevels.on("addqualitylevel", () => {
          if (qualityLevels.length > 1 && !player.qualityButtonAdded) {
            createQualityButton(player, qualityLevels);
            player.qualityButtonAdded = true;
          }
        });
      }
    });
  };

  // Add keyboard shortcuts
  const setupKeyboardShortcuts = (player) => {
    player.ready(() => {
      const handleKeyDown = (e) => {
        // Only handle shortcuts if the video player is focused or no input elements are focused
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.contentEditable === "true");

        if (isInputFocused) return;

        switch (e.key.toLowerCase()) {
          case " ": // Space - play/pause
          case "k": // K - play/pause
            e.preventDefault();
            if (player.paused()) {
              player.play();
            } else {
              player.pause();
            }
            break;

          case "f": // F - fullscreen
            e.preventDefault();
            if (player.isFullscreen()) {
              player.exitFullscreen();
            } else {
              player.requestFullscreen();
            }
            break;

          case "arrowleft": // Left arrow - back 5 seconds
            e.preventDefault();
            player.currentTime(Math.max(0, player.currentTime() - 5));
            break;

          case "arrowright": // Right arrow - forward 5 seconds
            e.preventDefault();
            player.currentTime(
              Math.min(player.duration(), player.currentTime() + 5)
            );
            break;

          case "j": // J - back 10 seconds
            e.preventDefault();
            player.currentTime(Math.max(0, player.currentTime() - 10));
            break;

          case "l": // L - forward 10 seconds
            e.preventDefault();
            player.currentTime(
              Math.min(player.duration(), player.currentTime() + 10)
            );
            break;

          case "m": // M - mute/unmute
            e.preventDefault();
            player.muted(!player.muted());
            break;
        }
      };

      // Add event listener to document for global shortcuts
      document.addEventListener("keydown", handleKeyDown);

      // Store the handler reference for cleanup
      player.keyboardHandler = handleKeyDown;
    });
  };

  // Full implementation of createQualityButton with valid SVG path and menu
  const createQualityButton = (player, qualityLevels) => {
    const Button = videojs.getComponent("Button");
    class QualityButton extends Button {
      constructor(p, o) {
        super(p, o);
        this.controlText("Settings");
        this.addClass("vjs-quality-button");
      }

      createEl() {
        const el = super.createEl("button", {
          className: "vjs-quality-button vjs-control vjs-button",
          type: "button",
          title: "Settings",
        });
        el.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7m7.43-2.53a5.05 5.05 0 0 0 .07-.97 5.05 5.05 0 0 0-.07-.97l2.11-1.66a.75.75 0 0 0 .1-1.05l-2-3.46a.75.75 0 0 0-1-.3l-2.48 1a5.02 5.02 0 0 0-1.06-.62l-.38-2.66a.75.75 0 0 0-.75-.65h-4a.75.75 0 0 0-.75.65l-.38 2.66c-.37.2-.72.45-1.05.72l-2.48-1a.75.75 0 0 0-1 .3l-2 3.46a.75.75 0 0 0 .1 1.05l2.11 1.66c-.05.32-.07.64-.07.97 0 .33.02.65.07.97l-2.11 1.66a.75.75 0 0 0-.1 1.05l2 3.46a.75.75 0 0 0 1 .3l2.48-1c.33.27.68.52 1.05.72l.38 2.66a.75.75 0 0 0 .75.65h4a.75.75 0 0 0 .75-.65l.38-2.66c.37-.2.72-.45 1.06-.62l2.48 1a.75.75 0 0 0 1-.3l2-3.46a.75.75 0 0 0-.1-1.05l-2.11-1.66z"/>
          </svg>
          <span class="vjs-control-text">Settings</span>
        `;
        return el;
      }

      handleClick() {
        this.showQualityMenu();
      }

      showQualityMenu() {
        const existing = document.querySelector(".vjs-quality-menu");
        if (existing) return existing.remove();

        const menu = document.createElement("div");
        menu.className = "vjs-quality-menu";
        menu.style.cssText = `position:absolute;bottom:100%;right:0;background:rgba(0,0,0,0.9);color:#fff;padding:8px;border-radius:4px;min-width:120px;`;

        const addItem = (label, selected, onClick) => {
          const item = document.createElement("div");
          item.innerText = label;
          item.style.cssText = `padding:8px 12px;cursor:pointer;${
            selected ? "background:rgba(255,255,255,0.2)" : ""
          }`;
          item.onclick = () => {
            onClick();
            menu.remove();
          };
          menu.appendChild(item);
        };

        // Auto
        addItem("Auto", qualityLevels.selectedIndex == null, () => {
          qualityLevels.forEach((l) => (l.enabled = true));
        });

        // Separator
        const sep = document.createElement("hr");
        sep.style.margin = "4px 0";
        menu.appendChild(sep);

        // Unique levels
        const levels = Array.from(qualityLevels).sort(
          (a, b) => b.height - a.height
        );
        const seen = new Set();
        levels.forEach((l, i) => {
          if (!seen.has(l.height)) {
            seen.add(l.height);
            addItem(`${l.height}p`, l.enabled, () =>
              qualityLevels.forEach((ql, idx) => (ql.enabled = idx === i))
            );
          }
        });

        this.el().appendChild(menu);
        document.addEventListener(
          "click",
          (e) => {
            if (!menu.contains(e.target) && e.target !== this.el())
              menu.remove();
          },
          { once: true }
        );
      }
    }

    const btn = new QualityButton(player, { name: "qualityButton" });
    if (player.rightControls) player.rightControls.appendChild(btn.el());
  };

  useEffect(() => {
    if (playerRef.current) playerRef.current.src({ src, type });
  }, [src, type]);
  useEffect(
    () => () => {
      if (playerRef.current) {
        // Clean up keyboard event listener
        if (playerRef.current.keyboardHandler) {
          document.removeEventListener(
            "keydown",
            playerRef.current.keyboardHandler
          );
        }
        playerRef.current.dispose();
        playerRef.current = null;
      }
    },
    []
  );

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
