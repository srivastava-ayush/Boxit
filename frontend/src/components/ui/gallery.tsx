"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useRef } from "react";

import effect_img_1 from "../../../public/effect_1.jpeg";
import effect_img_2 from "../../../public/effect_5.jpeg";
import effect_img_3 from "../../../public/effect_3.jpeg";
import effect_img_4 from "../../../public/effect_4.jpeg";
import effect_img_5 from "../../../public/effect_2.jpeg";
import effect_img_6 from "../../../public/effect_6.jpeg";
import effect_img_7 from "../../../public/effect_7.jpeg";
import effect_img_8 from "../../../public/effect_8.jpeg";
import paperTex from "../../../public/paper-texture.webp";

function GallerySection() {
  const galleryRef = useRef<HTMLDivElement>(null);

  /* -------------------------------------------------------
     1. SCROLL
  ------------------------------------------------------- */
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });

  /* -------------------------------------------------------
     2. LIQUID TEXT ENGINE (TEXT ONLY)
  ------------------------------------------------------- */
  const liquidScroll = useSpring(scrollYProgress, {
    stiffness: 35,
    damping: 22,
    mass: 1.6,
  });

  /* -------------------------------------------------------
     3. SCENE SCALE (ORIGINAL)
  ------------------------------------------------------- */
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);
  const scaleh1 = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  /* -------------------------------------------------------
     4. LIQUID TEXT — "TO BE THE"
  ------------------------------------------------------- */
  const toBeTheOpacity = useTransform(
    liquidScroll,
    [0.15, 0.28, 0.5, 0.62],
    [0, 1, 1, 0]
  );

  const toBeTheX = useTransform(
    liquidScroll,
    [0.15, 0.28, 0.5, 0.62],
    ["140%", "0%", "0%", "-140%"]
  );

  const toBeTheY = useTransform(
    liquidScroll,
    [0.15, 0.62],
    ["10%", "-12%"]
  );

  const toBeTheScale = useTransform(
    liquidScroll,
    [0.15, 0.28, 0.5, 0.62],
    [0.92, 1.04, 1, 0.94]
  );

  const toBeTheRotate = useTransform(
    liquidScroll,
    [0.15, 0.62],
    [3, -3]
  );

  /* -------------------------------------------------------
     5. LIQUID TEXT — "GREATEST"
  ------------------------------------------------------- */
  const greatestOpacity = useTransform(
    liquidScroll,
    [0.6, 0.78],
    [0, 1]
  );

  const greatestScale = useTransform(
    liquidScroll,
    [0.6, 0.85],
    [1.12, 1]
  );

  const greatestY = useTransform(
    liquidScroll,
    [0.6, 0.85],
    ["16%", "0%"]
  );

  const greatestRotate = useTransform(
    liquidScroll,
    [0.6, 0.85],
    [-2, 0]
  );

  const greatestLetterSpacing = useTransform(
    liquidScroll,
    [0.65, 0.95],
    ["1.2rem", "0rem"]
  );

  /* -------------------------------------------------------
     6. ORIGINAL IMAGE ANIMATION (UNCHANGED)
  ------------------------------------------------------- */
  const baseScale = useTransform(scrollYProgress, [0, 1], [1, 2]);
  const baseX = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const pictures = [
    {
      src: effect_img_1,
      offset: 0.6,
      direction: "left",
      classes:
        "w-[50vw] md:w-[25vw] h-[40vh] top-[1vh] md:top-[-1vh] left-[6vh] md:left-[4vw]",
    },
    {
      src: effect_img_2,
      offset: 0.1,
      direction: "right",
      classes:
        "top-[-30vh] md:top-[-22vh] right-[-12vw] md:right-[-20vw] w-[39vw] md:w-[12vw] h-[30vh]",
    },
    {
      src: effect_img_3,
      offset: 0.2,
      direction: "left",
      classes:
        "top-[-30vh] md:top-[-18vh] left-[-18vw] md:left-[-23vw] w-[25vw] md:w-[15vw] h-[30vh]",
    },
    {
      src: effect_img_4,
      offset: 0.3,
      direction: "right",
      classes:
        "left-[27.5vw] w-[20vw] h-[25vh] md:left-[38vw] top-[-4.5vh] md:top-[22vh]",
    },
    {
      src: effect_img_5,
      offset: 0.4,
      direction: "up",
      classes:
        "top-[32vh] left-[2vw] w-[25vw] md:w-[18vw] h-[25vh] md:left-[37vw] md:top-[-16vh]",
    },
    {
      src: effect_img_6,
      offset: 0.5,
      direction: "left",
      classes:
        "top-[27.5vh] left-[-30vw] w-[25vw] md:w-[12vw] h-[39vh] md:top-[22vh] md:left-[-16vw]",
    },
    {
      src: effect_img_7,
      offset: 0.6,
      direction: "right",
      classes:
        "top-[22.5vh] left-[30vw] md:w-[15vw] w-[25vw] h-[35vh] md:top-[17vh] md:left-[15vw]",
    },
    {
      src: effect_img_8,
      offset: 0.7,
      direction: "up",
      classes:
        "top-[0vh] left-[-26vw] md:left-[-35vw] md:top-[17vh] w-[15vw] h-[30vh] md:h-[60vh]",
    },
  ];

  /* -------------------------------------------------------
     7. RENDER
  ------------------------------------------------------- */
  return (
    <motion.div
      ref={galleryRef}
      style={{ scale }}
      className="relative h-[300vh] w-full"
    >
      <motion.div className="sticky -top-12 h-[calc(100vh+48px)] overflow-hidden bg-[#d4d3d3] rounded-t-[3rem] flex items-center justify-center">

        <img
          src={paperTex}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
        />

        {/* TEXT */}
        <div className="absolute inset-0 flex items-center justify-center z-[99] overflow-hidden">
          <motion.div
            style={{
              opacity: toBeTheOpacity,
              x: toBeTheX,
              y: toBeTheY,
              scale: toBeTheScale,
              rotate: toBeTheRotate,
            }}
            className="absolute flex gap-6 will-change-transform"
          >
            {["TO", "BE", "THE"].map((word) => (
              <h1
                key={word}
                className="russo font-extrabold text-[5rem] text-white mix-blend-difference"
              >
                {word}
              </h1>
            ))}
          </motion.div>

          <motion.h1
            style={{
              opacity: greatestOpacity,
              scale: greatestScale,
              y: greatestY,
              rotate: greatestRotate,
              letterSpacing: greatestLetterSpacing,
            }}
            className="font-extrabold text-[clamp(3rem,9vw,8rem)] text-red-600 will-change-transform"
          >
            GREATEST
          </motion.h1>
        </div>

        {/* IMAGES (ORIGINAL BEHAVIOR) */}
        {pictures.map(({ src, offset, direction, classes }, index) => {
          const localScale = useTransform(
            baseScale,
            (v) => 1 + (v - 1) * (1 + offset)
          );

          const localX = useTransform(baseX, (v) =>
            direction === "left"
              ? v * (1 + offset * 1.5)
              : direction === "right"
              ? -v * (1 + offset * 1.5)
              : 0
          );

          const localY = useTransform(
            scrollYProgress,
            [0, 1],
            [0, direction === "up" ? -150 : 0]
          );

          return (
            <motion.div
              key={index}
              style={{
                scale: localScale,
                x: localX,
                y: localY,
                zIndex: 10 - index,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className={`relative ${classes}`}>
                <img
                  src={src}
                  className="object-cover w-full h-full rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default GallerySection;
