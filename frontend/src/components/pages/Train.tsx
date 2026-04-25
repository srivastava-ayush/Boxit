"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router";
import { motion } from "framer-motion";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import ComboTray from "../ui/comboTray";
import TrainHud from "../ui/TrainHud";
import TrainControls from "../ui/TrainControls";
import punchTypes from "../../data/punchTypes";
import punchAudioMap from "../../data/punchAudio";
import parseCombo from "../../utils/parseCombo";
import paperTex from "../../../public/paper-texture.webp";
// Constants
const DETECTION_INTERVAL = 50;
const PUNCH_SPEED_THRESHOLD = 25;
const PUNCH_COOLDOWN = 300;
const KEYPOINT_CONFIDENCE_THRESHOLD = 0.3;
const WRIST_CONFIDENCE_THRESHOLD = 0.5;
const COUNTDOWN_DURATION = 3;
const MIN_PLAYBACK_RATE = 0.5;
const MAX_PLAYBACK_RATE = 2.0;
const BASE_INTERVAL = 1000;

// Types
interface TrainingState {
  index: number;
  remainingReps: number;
  isActive: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface LastPositions {
  left: Position | null;
  right: Position | null;
}

// Skeleton connections for pose visualization
const SKELETON_CONNECTIONS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4], // Face
  [5, 6], // Shoulders
  [5, 7],
  [7, 9], // Left arm
  [6, 8],
  [8, 10], // Right arm
  [5, 11],
  [6, 12], // Torso
  [11, 12], // Hips
  [11, 13],
  [13, 15], // Left leg
  [12, 14],
  [14, 16], // Right leg
];

export default function Train() {
  const location = useLocation();
  const comboString =
    new URLSearchParams(location.search).get("combo") || "1-2";
  const combo = parseCombo(comboString);

  // Training state
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalTime, setIntervalTime] = useState(1000);
  const [reps, setReps] = useState(5);
  const [repsLeft, setRepsLeft] = useState(reps);
  const [currentPunch, setCurrentPunch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  const [punchCount, setPunchCount] = useState(0);

  // Loading states
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [modelLoadError, setModelLoadError] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const hudContainerRef = useRef<HTMLDivElement>(null);

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const trainingStateRef = useRef<TrainingState>({
    index: 0,
    remainingReps: reps,
    isActive: false,
  });
  const audioContextRef = useRef<AudioContext | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const lastPositions = useRef<LastPositions>({ left: null, right: null });
  const cooldownRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const lastDetectionTimeRef = useRef(0);

  const isFullyLoaded = isModelLoaded && isAudioLoaded;

  // Initialize TensorFlow and pose detector
  useEffect(() => {
    let isMounted = true;

    const initDetector = async () => {
      try {
        console.log("Initializing TensorFlow...");
        await tf.ready();
        await tf.setBackend("webgl");
        console.log("TensorFlow backend:", tf.getBackend());

        console.log("Loading MoveNet model...");
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING },
        );

        if (isMounted) {
          detectorRef.current = detector;
          setIsModelLoaded(true);
          console.log("MoveNet model loaded successfully");
        }
      } catch (error) {
        console.error("Error initializing pose detector:", error);
        if (isMounted) {
          setModelLoadError(
            "Failed to load pose detection model. Please refresh the page.",
          );
        }
      }
    };

    initDetector();

    return () => {
      isMounted = false;
    };
  }, []);

  // Preload audio files
  useEffect(() => {
    let isMounted = true;

    const loadAudio = async () => {
      try {
        console.log("Loading audio files...");
        const audioPromises = Object.values(punchAudioMap).map((audio) => {
          return new Promise((resolve) => {
            audio.load();
            audio.addEventListener("canplaythrough", resolve, { once: true });
          });
        });

        await Promise.all(audioPromises);
        if (isMounted) {
          setIsAudioLoaded(true);
          console.log("Audio files loaded successfully");
        }
      } catch (error) {
        console.error("Error loading audio:", error);
        if (isMounted) {
          setIsAudioLoaded(true); // Continue even if audio fails
        }
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize audio context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
    }
  }, []);

  // Play beep sound
  const playBeep = useCallback((frequency = 440, duration = 150) => {
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.5;

      oscillator.start();
      setTimeout(() => oscillator.stop(), duration);
    } catch (error) {
      console.error("Error playing beep:", error);
    }
  }, []);

  // Calculate playback rate based on interval time
  const getPlaybackRate = useCallback(() => {
    const rate = BASE_INTERVAL / intervalTime;
    return Math.min(Math.max(rate, MIN_PLAYBACK_RATE), MAX_PLAYBACK_RATE);
  }, [intervalTime]);

  // Play punch sound
  const playPunchSound = useCallback(
    (punchId: string) => {
      const audio = punchAudioMap[punchId];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.playbackRate = getPlaybackRate();
        audio.play().catch((e) => console.error("Failed to play sound:", e));
      }
    },
    [getPlaybackRate],
  );

  // Draw skeleton on canvas
  const drawSkeleton = useCallback(
    (keypoints: poseDetection.Keypoint[], ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = "#FF4B33";
      ctx.lineWidth = 3;

      SKELETON_CONNECTIONS.forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];

        if (
          kp1?.score &&
          kp2?.score &&
          kp1.score > KEYPOINT_CONFIDENCE_THRESHOLD &&
          kp2.score > KEYPOINT_CONFIDENCE_THRESHOLD
        ) {
          ctx.beginPath();
          ctx.moveTo(kp1.x, kp1.y);
          ctx.lineTo(kp2.x, kp2.y);
          ctx.stroke();
        }
      });

      // Draw keypoints
      keypoints.forEach((keypoint) => {
        if (keypoint.score && keypoint.score > KEYPOINT_CONFIDENCE_THRESHOLD) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = "#B21500";
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    },
    [],
  );

  // Detect punches from wrist movement
  const detectPunch = useCallback(
    (wrist: poseDetection.Keypoint, side: "left" | "right") => {
      if (!wrist?.score || wrist.score <= WRIST_CONFIDENCE_THRESHOLD) return;

      const prev = lastPositions.current[side];

      if (prev) {
        const dx = wrist.x - prev.x;
        const dy = wrist.y - prev.y;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > PUNCH_SPEED_THRESHOLD && !cooldownRef.current) {
          setPunchCount((c) => c + 1);
          cooldownRef.current = true;
          setTimeout(() => {
            cooldownRef.current = false;
          }, PUNCH_COOLDOWN);
        }
      }

      lastPositions.current[side] = { x: wrist.x, y: wrist.y };
    },
    [],
  );

  // Pose detection loop
  const detect = useCallback(async () => {
    if (
      !cameraEnabled ||
      !isModelLoaded ||
      !detectorRef.current ||
      !videoRef.current ||
      !canvasRef.current ||
      videoRef.current.readyState !== 4
    ) {
      if (cameraEnabled && isModelLoaded) {
        animationIdRef.current = requestAnimationFrame(detect);
      }
      return;
    }

    const now = Date.now();
    if (now - lastDetectionTimeRef.current < DETECTION_INTERVAL) {
      animationIdRef.current = requestAnimationFrame(detect);
      return;
    }
    lastDetectionTimeRef.current = now;

    try {
      const poses = await detectorRef.current.estimatePoses(videoRef.current);
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Update canvas size if needed
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;

        // Draw skeleton and keypoints
        drawSkeleton(keypoints, ctx);

        // Detect punches
        const leftWrist = keypoints.find((k) => k.name === "left_wrist");
        const rightWrist = keypoints.find((k) => k.name === "right_wrist");

        if (leftWrist) detectPunch(leftWrist, "left");
        if (rightWrist) detectPunch(rightWrist, "right");
      }
    } catch (error) {
      console.error("Pose detection error:", error);
    }

    animationIdRef.current = requestAnimationFrame(detect);
  }, [isTraining, drawSkeleton, detectPunch]);

  // Start/stop pose detection based on training state
  useEffect(() => {
    if (cameraEnabled && isModelLoaded) {
      detect();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [cameraEnabled, isModelLoaded, detect]);

  // Handle webcam
  useEffect(() => {
    const handleCamera = async () => {
      if (cameraEnabled && !isModelLoaded) {
        console.log("Model not loaded yet, waiting...");
        return;
      }

      if (cameraEnabled && isModelLoaded) {
        try {
          // Stop existing stream
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
          });
          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
        } catch (err) {
          console.error("Error accessing webcam:", err);
          setCameraEnabled(false);
          alert("Could not access camera. Please check permissions.");
        }
      } else if (!cameraEnabled) {
        // Stop stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        // Clear canvas
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          ctx?.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
          );
        }

        // Reset detection state
        lastPositions.current = { left: null, right: null };
      }
    };

    handleCamera();
  }, [cameraEnabled, isModelLoaded]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (!isModelLoaded) {
      alert("Please wait for the pose detection model to load first.");
      return;
    }
    setCameraEnabled((prev) => !prev);
  }, [isModelLoaded]);

  // Process next punch in sequence
  const nextPunch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const { index, remainingReps, isActive } = trainingStateRef.current;

    if (!isActive || isPaused || remainingReps <= 0) {
      if (remainingReps <= 0) {
        setIsTraining(false);
        trainingStateRef.current.isActive = false;
        setCurrentPunch("Workout Complete!");
      }
      return;
    }

    const punch = combo[index];
    setCurrentPunch(punch);
    setCurrentIndex(index);
    playPunchSound(punch);

    timeoutRef.current = setTimeout(() => {
      const nextIndex = (index + 1) % combo.length;

      if (nextIndex === 0) {
        const newRepsLeft = remainingReps - 1;
        setRepsLeft(newRepsLeft);
        trainingStateRef.current.remainingReps = newRepsLeft;

        if (newRepsLeft <= 0) {
          setIsTraining(false);
          trainingStateRef.current.isActive = false;
          setCurrentPunch("Workout Complete!");
          return;
        }
      }

      trainingStateRef.current.index = nextIndex;
      nextPunch();
    }, intervalTime);
  }, [combo, intervalTime, isPaused, playPunchSound]);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      if (audioContextRef.current) {
        playBeep(330, 200);
      }

      countdownRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (
      countdown === 0 &&
      isTraining &&
      trainingStateRef.current.isActive
    ) {
      nextPunch();
    }

    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [countdown, isTraining, nextPunch, playBeep]);

  // Update training state ref when repsLeft changes
  useEffect(() => {
    trainingStateRef.current.remainingReps = repsLeft;
  }, [repsLeft]);

  // Reset repsLeft when reps changes and not training
  useEffect(() => {
    if (!isTraining) {
      setRepsLeft(reps);
    }
  }, [reps, isTraining]);

  // Start training
  const startTraining = useCallback(() => {
    if (!isFullyLoaded) {
      alert("Please wait for all resources to load first.");
      return;
    }

    setPunchCount(0);
    initAudioContext();
    setRepsLeft(reps);
    setCountdown(COUNTDOWN_DURATION);
    setIsTraining(true);
    setIsPaused(false);
    trainingStateRef.current = {
      index: 0,
      remainingReps: reps,
      isActive: true,
    };
  }, [isFullyLoaded, reps, initAudioContext]);

  // Stop training
  const stopTraining = useCallback(() => {
    setCountdown(0);
    setIsTraining(false);
    setIsPaused(false);
    trainingStateRef.current.isActive = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null;
    }

    setCurrentPunch("");
    setCurrentIndex(0);
    setRepsLeft(reps);
    lastPositions.current = { left: null, right: null };
  }, [reps]);

  // Toggle pause
  const togglePause = useCallback(() => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);

    if (newPausedState) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      nextPunch();
    }
  }, [isPaused, nextPunch]);

  // Cleanup on unmount
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (countdownRef.current) clearTimeout(countdownRef.current);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      detectorRef.current?.dispose();

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      tf.disposeVariables();
    };
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!hudContainerRef.current) return;

    if (!document.fullscreenElement) {
      hudContainerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={mainContainerRef}
      className="min-h-screen relative h-full text-white bg-black/50 pt-20"
    >
      {/* Train background */}
      <div className="train-bg w-full h-full fixed top-0 left-0 opacity-5 -z-10" />

      {/* Scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
        }}
      />
      <span className="absolute -z-1 blur-[400px] top-0 left-0 w-[50%] h-[40%] bg-[#ffffff94]" />
      <span className="absolute -z-1 blur-[400px] top-0 right-0 w-[50%] h-[40%] bg-[#575cfa43] " />
{/* ── HEADER ── */}
      <header className="hidden">{/* Hidden - moved to TrainHud */}</header>

      {/* ── MAIN ── */}
      <main className="pt-10 pb-32 px-4 flex flex-col items-center justify-center gap-6">
        {/* HUD */}
        <div
          ref={hudContainerRef}
          className={`w-full flex items-center justify-center ${
            isFullscreen ? "max-w-none h-screen" : "max-w-4xl "
          }`}
        >
          <TrainHud
            canvasRef={canvasRef}
            videoRef={videoRef}
            toggleCamera={toggleCamera}
            cameraEnabled={cameraEnabled}
            punchCount={punchCount}
            countdown={countdown}
            isTraining={isTraining}
            currentPunch={currentPunch}
            repsLeft={repsLeft}
            reps={reps}
            currentIndex={currentIndex}
            punchTypes={punchTypes}
            isFullyLoaded={isFullyLoaded}
            isModelLoaded={isModelLoaded}
            isAudioLoaded={isAudioLoaded}
            toggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>

        <div className="w-full flex justify-center items-center flex-col">
           <div className={` ${isFullscreen ? "hidden" : " w-full max-w-4xl"}`}>
            {/* Combo Tray */}
           
              <ComboTray
                combo={combo}
                currentIndex={currentIndex}
                isTraining={isTraining}
                isPaused={isPaused}
                punchTypes={punchTypes}
                comboString={comboString}
              />
         
            {/* Controls */}
            
              <TrainControls
                setShowSettings={setShowSettings}
                showSettings={showSettings}
                isTraining={isTraining}
                startTraining={startTraining}
                stopTraining={stopTraining}
                isPaused={isPaused}
                togglePause={togglePause}
                intervalTime={intervalTime}
                setIntervalTime={setIntervalTime}
                reps={reps}
                setReps={setReps}
                setRepsLeft={setRepsLeft}
              />
       
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 px-4 py-3 bg-gradient-to-t from-black/95 to-transparent ${
          isFullscreen ? "hidden" : ""
        }`}
      >
        <p className="text-center text-gray-500 text-xs tracking-widest uppercase pb-10">
         Follow the visual and audio cues to complete your boxing combo<br/>
*Punch count is approximate — for training use only.
        </p>
      </footer>
    </motion.div>
  );
}
