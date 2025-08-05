// components/VideoPlayer.jsx
import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import styleFetch from "../hooks/style_fetch";

// Custom YouTube‑style CSS - will be loaded from external file
let qualityButtonStyles = "";

// Load styles from external file
const loadStyles = async () => {
  if (!qualityButtonStyles) {
    qualityButtonStyles = await styleFetch("/styles/qualityButtonStyles.txt");
  }
  return qualityButtonStyles;
};

// Inject styles once - loaded from external file
const injectStyles = async () => {
  if (typeof document !== "undefined") {
    const styles = await loadStyles();
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    styleEl.setAttribute("data-quality-button", "true");
    if (!document.head.querySelector("style[data-quality-button]")) {
      document.head.appendChild(styleEl);
    }
  }
};

// Initialize styles loading
injectStyles();

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

const VideoPlayer = ({ src, type = "video/mp4", onPlay, videoId }) => {
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
        enhanceProgressBarVisibility(playerRef.current);

        // Add play event listener for watch history tracking
        if (onPlay && videoId) {
          playerRef.current.on("play", () => {
            onPlay(videoId);
          });
        }
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
        menu.style.cssText = `
          position: absolute;
          bottom: 60px;
          right: 0;
          background: rgba(28, 28, 28, 0.95);
          color: #fff;
          border-radius: 8px;
          min-width: 180px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          overflow: hidden;
        `;

        // Add header
        const header = document.createElement("div");
        header.innerHTML = `
          <div style="display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
              <path d="M15 8l-4.5 4L9 10.5L7.5 12 10.5 15 16.5 9 15 8z"/>
            </svg>
            <span style="font-weight: 500;">Quality</span>
          </div>
        `;
        menu.appendChild(header);

        const addItem = (label, selected, onClick) => {
          const item = document.createElement("div");
          item.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: background-color 0.1s ease;
            ${selected ? "background: rgba(255, 255, 255, 0.1);" : ""}
          `;

          const labelSpan = document.createElement("span");
          labelSpan.textContent = label;
          labelSpan.style.cssText = "color: #fff; font-weight: 400;";

          if (selected) {
            const checkmark = document.createElement("span");
            checkmark.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #3ea6ff;">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            `;
            item.appendChild(labelSpan);
            item.appendChild(checkmark);
          } else {
            item.appendChild(labelSpan);
          }

          item.onmouseenter = () => {
            if (!selected) {
              item.style.background = "rgba(255, 255, 255, 0.05)";
            }
          };

          item.onmouseleave = () => {
            if (!selected) {
              item.style.background = "transparent";
            }
          };

          item.onclick = () => {
            onClick();
            menu.remove();
          };

          menu.appendChild(item);
        };

        const qualityLevels = this.player().qualityLevels();

        // Auto option
        addItem("Auto", qualityLevels.selectedIndex == null, () => {
          for (let i = 0; i < qualityLevels.length; i++) {
            qualityLevels[i].enabled = true;
          }
        });

        // Individual quality levels
        const levels = Array.from(qualityLevels).sort(
          (a, b) => b.height - a.height
        );
        const seen = new Set();
        levels.forEach((l, i) => {
          if (!seen.has(l.height)) {
            seen.add(l.height);
            const isSelected = qualityLevels.selectedIndex === i;
            const label = l.height >= 1080 ? `${l.height}p HD` : `${l.height}p`;
            addItem(label, isSelected, () => {
              for (let idx = 0; idx < qualityLevels.length; idx++) {
                qualityLevels[idx].enabled = idx === i;
              }
            });
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
