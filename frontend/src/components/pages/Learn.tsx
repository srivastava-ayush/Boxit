"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router"
import ScrollToTop from "../ui/ScrollToTop"
import { ArrowLeft, Play, Info, ChevronRight, BookOpen, Award, CheckCircle, Clock, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
const TUTORIAL_VIDEO_ID = "FjZIDL8-JP0"
import paperTex from "../../../public/paper-texture.webp"
const punchTutorials = [
  {
    id: "stance",
    name: "Stance",
    code: "St",
    color: "#000",
    icon: "🕴️",
    description:
      "A boxing stance is the foundation of balance, mobility, power, and defense in the ring. It ensures stability while throwing punches or dodging attacks, allowing smooth movement and efficient footwork. A proper stance helps generate power by transferring energy from the legs and hips while also maintaining defensive positioning to block or evade strikes. It enhances endurance by conserving energy, preventing unnecessary movement and fatigue. The two primary stances—orthodox (left foot forward) and southpaw (right foot forward)—set the stage for a boxer’s effectiveness. Mastering stance is essential for control, precision, and overall success in boxing.",
    timestamp: 0,
    tips: [
      "      Feet Shoulder-Width Apart – Maintain balance and stability.",

      "Lead Foot Forward – Left foot for orthodox, right foot for southpaw.",

      "Knees Slightly Bent – Stay agile and ready to move.",

      "Hands Up, Chin Down – Protect your face at all times.",

      "Weight Evenly Distributed – Avoid leaning too far forward or back.",
    ],
    difficulty: "Beginner",
    relatedPunches: ["1", "2"],
  },
  {
    id: "1",
    name: "Jab",
    code: "1",
    color: "#ef4444",
    icon: "👊",
    description:
      "The jab is a quick, straight punch thrown with the lead hand from the guard position. The jab is the most important punch in a boxer's arsenal because it provides a fair amount of its own cover and it leaves the least amount of space for a counter punch from the opponent.",
    timestamp: 533, // 1:02
    tips: [
      "Keep your elbow in",
      "Rotate your fist at the end of the punch",
      "Return to guard position quickly",
      "Don't telegraph the punch",
    ],
    difficulty: "Beginner",
    relatedPunches: ["2", "3"],
  },
  {
    id: "2",
    name: "Cross",
    code: "2",
    color: "#3b82f6",
    icon: "💥",
    description:
      "The cross is a powerful straight punch thrown with the rear hand. It's often thrown after a jab, creating the classic 'one-two' combination. The power comes from rotating your hips and shoulders, transferring weight from the back foot to the front foot.",
    timestamp: 713,
    tips: [
      "Rotate your hips and shoulders",
      "Keep your chin tucked",
      "Exhale sharply when punching",
      "Maintain your guard with your lead hand",
    ],
    difficulty: "Beginner",
    relatedPunches: ["1", "3", "4"],
  },
  {
    id: "3",
    name: "Lead Hook",
    code: "3",
    color: "#10b981",
    icon: "🤛",
    description:
      "The lead hook is a semi-circular punch thrown with the lead hand. It's aimed at the side of the opponent's head or body. The hook is a powerful punch that can catch opponents by surprise as it comes from the side rather than straight on.",
    timestamp: 874, // 4:08
    tips: [
      "Keep your elbow at a 90-degree angle",
      "Pivot on your lead foot",
      "Turn your hips and shoulders into the punch",
      "Don't swing too wide",
    ],
    difficulty: "Intermediate",
    relatedPunches: ["1", "2", "5"],
  },
  {
    id: "4",
    name: "Rear Hook",
    code: "4",
    color: "#8b5cf6",
    icon: "🤜",
    description:
      "The rear hook is a powerful semi-circular punch thrown with the rear hand. Similar to the lead hook, it targets the side of the opponent's head or body. The rear hook generates significant power due to the weight transfer and rotation involved.",
    timestamp: 1186,
    tips: [
      "Rotate your body fully",
      "Keep your elbow at the right height",
      "Transfer weight from back to front foot",
      "Maintain balance throughout",
    ],
    difficulty: "Intermediate",
    relatedPunches: ["2", "6"],
  },
  {
    id: "5",
    name: "Lead Uppercut",
    code: "5",
    color: "#f59e0b",
    icon: "⤴️",
    description:
      "The lead uppercut is an upward punch thrown with the lead hand, targeting the opponent's chin or body. It's effective in close range and can be devastating when an opponent is leaning forward or has their guard too high.",
    timestamp: 1263,
    tips: [
      "Bend your knees slightly",
      "Keep your elbow close to your body",
      "Drive upward with your legs",
      "Don't telegraph by dropping your hand too much",
    ],
    difficulty: "Advanced",
    relatedPunches: ["1", "3", "6"],
  },
  {
    id: "6",
    name: "Rear Uppercut",
    code: "6",
    color: "#ec4899",
    icon: "⤴️",
    description:
      "The rear uppercut is a powerful upward punch thrown with the rear hand. It's one of the most powerful punches in boxing when executed correctly. The power comes from the legs, hips, and core rotation, making it effective for close-range fighting.",
    timestamp: 1412,
    tips: [
      "Drive from your legs",
      "Rotate your hips and shoulders",
      "Keep your guard up with your lead hand",
      "Don't loop the punch - go straight up",
    ],
    difficulty: "Advanced",
    relatedPunches: ["2", "4", "5"],
  },
  {
    id: "S",
    name: "Slip",
    code: "S",
    color: "#6366f1",
    icon: "↪️",
    description:
      "Slipping is a defensive technique where you move your head to either side to avoid an incoming punch. It's a fundamental defensive skill that allows you to evade punches while staying in position to counter.",
    timestamp: 1745, // 10:24
    tips: [
      "Bend slightly at the knees, not the waist",
      "Keep your eyes on your opponent",
      "Move just enough to avoid the punch",
      "Maintain your guard position",
    ],
    difficulty: "Intermediate",
    relatedPunches: ["1", "2", "R"],
  },
  {
    id: "R",
    name: "Roll",
    code: "R",
    color: "#14b8a6",
    icon: "🔄",
    description:
      "Rolling is a defensive technique where you move your upper body in a circular motion to avoid punches. It's particularly effective against hooks and allows you to position yourself for counter punches.",
    timestamp: 1931, // 11:58
    tips: [
      "Bend your knees",
      "Keep your hands up to protect your face",
      "Move your upper body in a fluid motion",
      "Practice transitioning from defense to offense",
    ],
    difficulty: "Advanced",
    relatedPunches: ["S", "D"],
  },
  {
    id: "D",
    name: "Duck",
    code: "D",
    color: "#f97316",
    icon: "⬇️",
    description:
      "Ducking is a defensive technique where you lower your body by bending your knees to avoid punches aimed at your head. It's effective against straight punches and can set you up for body counter punches.",
    timestamp: 812, // 13:32
    tips: [
      "Bend at the knees, not the waist",
      "Keep your eyes on your opponent",
      "Maintain your guard position",
      "Don't duck too low or for too long",
    ],
    difficulty: "Intermediate",
    relatedPunches: ["S", "R"],
  },
  {
    id: "B",
    name: "Block",
    code: "B",
    color: "#5e5c5c",
    icon: "⬇️",
    description:
      " A block involves using your gloves or arms to absorb or deflect punches, while a duck involves lowering your head and bending your knees to slip under an opponent's strike. ",
    timestamp: 2050, // 13:32
    tips: [
      "Keep Hands Up – Always protect your head and chin.",

      "Elbows Close to the Body – Guard your ribs and midsection.",

      "Absorb with Forearms & Gloves – Let your arms take the impact, not your face.",

      "Stay Relaxed – Tension slows reactions and wastes energy.",
    ],
    difficulty: "Intermediate",
    relatedPunches: ["S", "R"],
  },
  {
    id: "F",
    name: "Footwork",
    code: "F",
    color: "#483370",
    icon: "⬇️",
    description:
      " Footwork in boxing refers to the movement and positioning of a fighter’s feet to maintain balance, mobility, and control in the ring. It allows boxers to attack, defend, evade punches, and create angles for counterattacks. ",
    timestamp: 2515, // 13:32
    tips: [
      "Stay on the Balls of Your Feet – Helps with speed, balance, and quick reactions.",

      "Keep Your Stance Wide but Mobile – Feet should be shoulder-width apart for stability.",

      "Move with Small, Controlled Steps – Avoid crossing your feet to maintain balance.",

      "Lead with Your Front Foot – Step first with the foot closest to the direction you're moving.",
    ],
    difficulty: "Intermediate",
    relatedPunches: ["D", "R"],
  },
]

const categories = [
  { id: "stance", name: "Stance", punches: ["stance"] },
  { id: "basic", name: "Basic Punches", punches: ["1", "2"] },
  { id: "power", name: "Power Punches", punches: ["3", "4", "5", "6"] },
  { id: "defense", name: "Defensive Moves", punches: ["S", "R", "B"] },
  { id: "footwork", name: "Footwork", punches: ["F"] },
]

// Format seconds to MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export default function Learn() {
  const [toggle, setToggle] = useState(false)

  const handleToggle = () => {
    setToggle(!toggle)
  }

  const [selectedPunch, setSelectedPunch] = useState(punchTutorials[0])
  const [activeCategory, setActiveCategory] = useState("basic")
  const [player, setPlayer] = useState<any>(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const playerRef = useRef<HTMLIFrameElement>(null)

  // Initialize YouTube API
  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"

      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = initializePlayer
    } else {
      initializePlayer()
    }

    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = null
    }
  }, [])

  // Initialize the YouTube player
  const initializePlayer = () => {
    if (!playerRef.current) return

    const newPlayer = new window.YT.Player(playerRef.current, {
      videoId: TUTORIAL_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => setIsPlayerReady(true),
      },
    })

    setPlayer(newPlayer)
  }

  // Handle punch selection and seek to timestamp
  const handlePunchSelect = (punch: (typeof punchTutorials)[0]) => {
    setSelectedPunch(punch)

    if (isPlayerReady && player && player.seekTo) {
      player.seekTo(punch.timestamp, true)
      player.playVideo()
    }
  }

  // Function to get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-600"
      case "Intermediate":
        return "bg-yellow-600"
      case "Advanced":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      transition={{ duration: 2 }}
      className="min-h-screen relative bg-[#141414] text-white flex flex-col pt-28 px-4 md:py-34 py-12 md:px-12"
    ><img src={paperTex} alt="Paper texture overlay" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay pointer-events-none rounded-xl" />
          
         {/* <span className="absolute -z-1 blur-[400px] top-0 left-0 w-[50%] h-[40%] bg-[#969696a7]" />
         <span className="absolute -z-1 blur-[400px] top-0 right-0 w-[50%] h-[40%] bg-[#15151578] " /> */}
      <ScrollToTop />
      {/* Header with navigation */}
      <div className="container mx-auto mb-12 flex items-center">
        <Link
          to="/"
          className="flex items-center justify-center rounded-full bg-black border-red-600 border-2 p-3 hover:bg-red-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center w-full gap-8">
          <motion.h1
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl font-bold ml-4 helvetica-font"
          >
            Learn Boxing
          </motion.h1>
          <div className="h-1 flex-grow bg-red-600 rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto flex-1">
        <div className="grid relative grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with punch list */}
          <div className="lg:col-span-1 ">
            <div className="bg-white/10 border border-white/20 shadow-xl rounded-xl p-6 sticky top-10">
              <span className="flex  justify-between ">
                <span className="flex justify-center items-center">
                 
                  <h2 className="text-2xl font-bold  flex items-center">Boxing Techniques</h2> <BookOpen className="w-10 h-10 sm:mx-4  mr-4 text-red-600" />
                </span>

                <ArrowDown
                  onClick={handleToggle}
                  className={"transition-all lg:hidden border rounded-full " + (toggle ? "" : " rotate-180")}
                />
              </span>
              {/* Categories */}

              {toggle && (
                <motion.div
                  initial={{ filter: "blur(10px)" }}
                  exit={{ filter: "blur(10px)" }}
                  animate={{ filter: "blur(0px)" }}
                  className="space-y-6 transition-all lg:hidden duration-200"
                >
                  <div>
                    <h3 className={`text-lg font-medium mb-3 pb-2 border-b`}>Important note</h3>
                    <p>
                      This course is not created or owned by us. It is a Creative Commons-licensed course sourced from
                      YouTube, originally produced by its respective creator(s). All credit goes to the original
                      author(s)
                      <a
                        className="font-bold text-red-500"
                        href="https://www.youtube.com/channel/UCiE7yqBDTQjtk1abuw92FQg"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Atiko Academy
                      </a>
                      for their work. We are simply providing access to this content for educational purposes.
                    </p>
                  </div>

                  {categories.map((category) => (
                    <div key={category.id}>
                      <h3
                        className={`text-lg font-medium mb-3 pb-2 border-b cursor-pointer ${
                          activeCategory === category.id ? "border-red-600" : "border-gray-700"
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.name}
                      </h3>
                      <div className="space-y-2">
                        {punchTutorials
                          .filter((punch) => category.punches.includes(punch.id))
                          .map((punch) => (
                            <button
                              key={punch.id}
                              onClick={() => handlePunchSelect(punch)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                selectedPunch.id === punch.id
                                  ? "bg-white/20 border-l-4 border-red-600"
                                  : "hover:bg-white/20"
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                                  style={{ backgroundColor: punch.color }}
                                >
                                  {punch.code}
                                </div>
                                <span>{punch.name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-400 mr-2 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatTime(punch.timestamp)}
                                </span>
                                <ChevronRight
                                  className={`w-5 h-5 transition-transform ${
                                    selectedPunch.id === punch.id ? "rotate-90" : ""
                                  }`}
                                />
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ filter: "blur(10px)" }}
                exit={{ filter: "blur(10px)" }}
                animate={{ filter: "blur(0px)" }}
                className="space-y-6 hidden lg:block transition-all duration-200"
              >
                <div className="mt-3">
                  <h3 className={`text-lg font-medium mb-3 pb-2 border-b`}>Important note</h3>
                  <p>
                    This course is not created or owned by us. It is a Creative Commons-licensed course sourced from
                    YouTube, originally produced by its respective creator(s). All credit goes to the original author(s){" "}
                    <a
                      className="font-bold text-red-500"
                      href="https://www.youtube.com/channel/UCiE7yqBDTQjtk1abuw92FQg"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Atiko Academy
                    </a>{" "}
                    for their work. We are simply providing access to this content for educational purposes.
                  </p>
                </div>

                {categories.map((category) => (
                  <div key={category.id}>
                    <h3
                      className={`text-lg font-medium mb-3 pb-2 border-b cursor-pointer ${
                        activeCategory === category.id ? "border-red-600" : "border-gray-700"
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </h3>
                    <div className="space-y-2">
                      {punchTutorials
                        .filter((punch) => category.punches.includes(punch.id))
                        .map((punch) => (
                          <button
                            key={punch.id}
                            onClick={() => handlePunchSelect(punch)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                              selectedPunch.id === punch.id
                                ? "bg-white/20 border-l-4 shadow-lg border-red-600"
                                : "hover:bg-gray-800/50"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                                style={{ backgroundColor: punch.color }}
                              >
                                {punch.code}
                              </div>
                              <span>{punch.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-400 mr-2 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(punch.timestamp)}
                              </span>
                              <ChevronRight
                                className={`w-5 h-5 transition-transform ${
                                  selectedPunch.id === punch.id ? "rotate-90" : ""
                                }`}
                              />
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2">
            {selectedPunch && (
              <div className="space-y-6 ">
                {/* Punch header */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap  justify-between w-full items-center">
                    <div className="flex items-center">
                      <div>
                        <h2 className="text-3xl my-8 font-bold">{selectedPunch.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                          {" "}
                          <div
                            className="w-8 h-8 rounded-full flex border items-center justify-center mr-4 text-white text-xl font-bold"
                            style={{ backgroundColor: selectedPunch.color }}
                          >
                            {selectedPunch.code}
                          </div>
                          <div
                            className={`text-sm px-2 py-1 rounded-full inline-flex items-center ${getDifficultyColor(
                              selectedPunch.difficulty,
                            )}`}
                          >
                            <Award className="w-4 h-4 mr-1" />
                            {selectedPunch.difficulty}
                          </div>
                          <div className="text-sm px-2 py-1 rounded-full inline-flex items-center bg-white/20">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTime(selectedPunch.timestamp)}
                          </div>
                        </div>
                      </div>{" "}
                    </div>
                    {/* Practice button */}
                    <div className="flex justify-center my-6">
                      <Link to={`/train?combo=${selectedPunch.code}`}>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center w-fit gap-2">
                          <Play className="w-5 h-5" />
                          <span>Practice This Technique</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Video player */}
                <div className="aspect-video z-[3] h-full bg-white/20 rounded-xl overflow-hidden">
                  <div id="youtube-player" className=" w-full h-[100%] ">
                    <div ref={playerRef} className="w-full h-full"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-red-600" />
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedPunch.description}</p>
                </div>

                {/* Tips */}
                <div className="bg-white/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Key Technique Tips</h3>
                  <ul className="space-y-3">
                    {selectedPunch.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Related punches */}
                <div className="bg-white/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4">Related Techniques</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedPunch.relatedPunches.map((id) => {
                      const relatedPunch = punchTutorials.find((p) => p.id === id)
                      if (!relatedPunch) return null

                      return (
                        <button
                          key={id}
                          onClick={() => handlePunchSelect(relatedPunch)}
                          className="bg-white/20 hover:bg-gray-700 rounded-lg p-4 transition-colors flex items-center"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white font-bold"
                            style={{ backgroundColor: relatedPunch.color }}
                          >
                            {relatedPunch.code}
                          </div>
                          <span>{relatedPunch.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
     
    </motion.div>
  )
}

// Add YouTube IFrame API type definitions
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | null
  }
}
