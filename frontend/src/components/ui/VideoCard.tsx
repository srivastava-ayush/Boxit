"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import paperTex from "../../../public/paper-texture.webp"
const VideoCard = ({ 
  title = "no title :( yet.", 
  description = "no description :( yet.",
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev)
  }

  const containerVariants = {
    initial: { y: 20, opacity: 0, filter: "blur(10px)" },
    animate: { 
      y: 0, opacity: 1, filter: "blur(0px)",
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  }

  const childVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover={{
      y: -5,
      transition: { duration: 0.3, ease: "easeOut" }
    }}
      className="w-full max-w-md rounded-xl overflow-hidden border-2 border-red-500/50 h-full bg-pink-500/10 shadow-xl hover:shadow-2xl hover:shadow-white/10 transition-all duration-300"
    >
       <img
            src={paperTex}
            alt="Paper texture overlay"
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
          />
      {/* Video */}
      <motion.div className="relative aspect-video w-full overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
          <iframe
            className="w-full h-full"
            src={videoUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
      </motion.div>
      
      {/* Content Section */}
      <motion.div className="p-5 space-y-4">
        {/* Title */}
        <motion.div className="relative">
          <motion.h3
            variants={childVariants}
            className="text-xl font-bold text-white leading-tight"
          >
            {title}
          </motion.h3>
        </motion.div>
        
        {/* Show More button */}
        <button 
          onClick={toggleDescription}
          className="text-sm  text-gray-300/80 underline underline-offset-4 cursor-pointer font-bold hover:text-red-200 transition-colors"
        > 
          {isExpanded ? "Show less" : "Show more"}
        </button>

        {/* Description with animation */}
        <AnimatePresence>
          {isExpanded && (
            <motion.p
              initial={{ height: 0, opacity: 0, filter: "blur(10px)" }}
              animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ height: 0, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="text-sm text-gray-300 overflow-hidden"
            >
              {description}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default VideoCard
