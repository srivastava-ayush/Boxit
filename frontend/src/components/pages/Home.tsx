import { motion } from "framer-motion";
import { useRef , lazy} from "react";
import heroImg from "../../../public/hero-img2.png";
import paperTex from "../../../public/paper-texture.webp";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import promo_1 from "../../../public/promo-1.png";
import GallerySection from "../ui/gallery";
import { useScroll, useTransform } from "framer-motion";
import promo_2 from "../../../public/promo-2.png";
import promo_3 from "../../../public/promo-3.jpeg";
const ScrollImageSequence = lazy(() => import("../ui/AnimatedCanvas"));
function Home() {
  const lines = ["Built for Warriors.", "Forged in Fire."];
  const section1Ref = useRef<HTMLElement>(null);
  const section2Ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section1Ref,
    offset: ["start end", "end start"],
  });

    const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"],
  });


  const scale2 = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const scale1 = useTransform(scrollYProgress2, [0, 0.3], [0.9, 1]);

  return (
    <div>

      <section className="relative px-8 flex flex-col md:flex-row items-center justify-between min-h-screen bg-[#202020] text-white overflow-hidden  md:px-20">
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay pointer-events-none"
        />
        <motion.img
          initial={{ x: 100, opacity: 0, filter: " blur(10px)" }}
          animate={{ x: 0, opacity: 0.55, filter: "" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:w-[70%] md:h-[100%] w-[100%] h-[59%]  object-cover absolute top-[45vh] md:top-0 md:right-[-150px] -z-0 grayscale-100 select-none pointer-events-none"
          src={heroImg}
        />

        <div className="relative z-10 max-w-3xl py-20">
          <h1 className="overflow-hidden leading-tight russo font-extrabold text-5xl md:text-8xl tracking-tight">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block"
              >
                {line}
              </motion.div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl font-medium text-gray-300 max-w-2xl"
          >
            Your Ultimate Boxing Guide – Train, Learn, and Fight! <br />
            The AI-powered coach built for warriors.
          </motion.p>
          <div className="flex gap-4 mt-6">
            <Link to={"/select"}>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative overflow-hidden border p-4 px-10 font-bold bg-gradient-to-r from-[#fd5353] to-red-600 text-white hover:bg-black"
              >
                Train
                {/* Shiny bead */}
                <motion.div
                  className="absolute top-0 left-[-50%] w-1/4 h-full bg-white opacity-50 blur-xl rounded-full"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.button>
            </Link>

            <Link to={"/learn"}>
              <motion.button
                initial={{ opacity: 0, filter: "blur(1px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="border p-4 px-10 hover:bg-black font-bold"
              >
                Learn
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <motion.section
        ref={section1Ref}
        style={{ scale: scale2 }}
        className="w-full ease duration-100 relative  flex flex-col items-center shadow-white shadow-lg justify-center bg-[#d4d3d3] rounded-t-[3.5rem] overflow-hidden py-20"
      >
        {/* Paper texture overlay */}
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
        />

        <span className="absolute w-[40%] h-[190%] bg-[#ff00002e] blur-[200px] rotate-[-45deg] top-[-140px] left-130 z-0"></span>

        {/* Inner content  */}
        <div className="max-w-6xl w-full px-6 flex flex-col items-center gap-16">
          <motion.div
            className="flex flex-col items-center lg:items-start text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-black text-center russo tracking-tight relative">
              Experience{" "}
              <span className="  bg-gradient-to-r animate-text drop-shadow-2xl animate-text">
                Next-Level Boxing
              </span>{" "}
              Training
            </h2>
          </motion.div>

          <motion.div
            // style={{ scale: scale2 }}
            className="w-full flex justify-center items-center"
          >
            <div className="w-[100%] p-3 sticky top-10 rounded-3xl overflow-hidden bg-gradient-to-b from-[#ffffff00] to-black/50 backdrop-blur-2xl border border-white/50 shadow-2xl cursor-pointer">
              <picture>
                {/* For md and above */}
                <source media="(min-width: 768px)" srcSet={promo_1} />

                {/* For sm (below md) */}
                <source media="(max-width: 767px)" srcSet={promo_2} />

                {/* Fallback (just in case) */}
                <img
                  className="rounded-2xl border border-black/50 w-full grayscale-100"
                  src={promo_1}
                  alt="Boxing Training"
                />
              </picture>

              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-white/0"
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            </div>
          </motion.div>

          <span className="flex w-full justify-center gap-4 z-10">
            <Link to="/learn">
              <button className="px-8 py-5 border-t-2 h-15 flex items-center justify-center bg-gradient-to-r from-[#fd5353] to-red-600 hover:to-red-500 text-white rounded-sm font-semibold transition-all shadow-lg hover:shadow-xl">
                Learn to box
              </button>
            </Link>

            <a
              href="https://www.youtube.com/channel/UCiE7yqBDTQjtk1abuw92FQg"
              target="_blank"
              rel="noreferrer"
            >
              <button className="flex gap-1 justify-center items-center text-center cursor-pointer border border-black/30 bg-white/60 text-black rounded-sm px-8 py-5 h-15 font-semibold transition-all shadow-lg hover:shadow-xl hover:bg-white/10">
                Atiko's YT <ArrowRight className="w-5 h-5" />
              </button>
            </a>
          </span>

      
        </div>

        <div className="w-full h-[50vh]"></div>
      </motion.section>


      <motion.section
        ref={section2Ref}
        style={{ scale: scale1 }}
        className="w-full ease duration-100 relative  -mt-[50vh] flex flex-col items-center shadow-black  justify-center bg-[#171717] rounded-t-[3.5rem] overflow-hidden py-20"
      >
        {/* Paper texture overlay */}
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 w-full ease-in h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
        />

 <span className="absolute w-[40%] h-[190%] bg-[#ffd8d852] blur-[200px] rotate-[-45deg] top-[-140px] right-130 z-0"></span>

        {/* Inner content  */}
        <div className="max-w-6xl w-full px-6 flex flex-col items-center gap-16">
          <motion.div
            className="flex flex-col items-center lg:items-start text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-white text-center russo tracking-tight relative">
              Analyize {" "}
              <span className="  bg-gradient-to-r animate-text drop-shadow-2xl animate-text">
                your punches
              </span>{" "}
              with AI
            </h2>
          </motion.div>

          <motion.div
            // style={{ scale: scale2 }}
            className="w-full flex justify-center items-center"
          >
            <div className="w-[100%] p-3 sticky top-10 rounded-3xl overflow-hidden bg-gradient-to-b from-[#ffffff00] to-black/50 backdrop-blur-2xl border border-white/50 shadow-2xl cursor-pointer">
              <picture>
                {/* For md and above */}
                <source media="(min-width: 768px)" srcSet={promo_3} />

                {/* For sm (below md) */}
                <source media="(max-width: 767px)" srcSet={promo_3} />

                {/* Fallback (just in case) */}
                <img
                  className="rounded-2xl border border-black/50 w-full grayscale-100"
                  src={promo_3}
                  alt="Boxing Training"
                />
              </picture>

              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/10 to-white/0"
                animate={{ opacity: [0, 0.15, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />
            </div>
          </motion.div>

          <span className="flex w-full justify-center gap-4 z-10">
            <Link to="/learn">
              <button className="px-8 py-5 border-t-2 h-15 flex items-center justify-center bg-gradient-to-r from-[#fd5353] to-red-600 hover:to-red-500 text-white rounded-sm font-semibold transition-all shadow-lg hover:shadow-xl">
                Learn to box
              </button>
            </Link>

            <a
              href="https://www.youtube.com/channel/UCiE7yqBDTQjtk1abuw92FQg"
              target="_blank"
              rel="noreferrer"
            >
              <button className="flex gap-1 justify-center items-center text-center cursor-pointer border border-black/30 bg-white/60 text-black rounded-sm px-8 py-5 h-15 font-semibold transition-all shadow-lg hover:shadow-xl hover:bg-white/10">
                Atiko's YT <ArrowRight className="w-5 h-5" />
              </button>
            </a>
          </span>

      
        </div>

        <div className="w-full h-[50vh]"></div>
      </motion.section>

      <section className="relative min-w-full min-h-screen -mt-[50vh] z-20 overflow-visible">
        <GallerySection />
      </section>
     ``
      
      <section  className="relative h-[200vh] ease-in  w-full ">
        <ScrollImageSequence  />
      </section>

      <footer className="w-full relative px-8 bg-gray-900 shadow-white border-t border-white/50 rounded-t-4xl text-gray-400 text-sm">
        <img
          src={paperTex}
          alt="Paper texture overlay"
          className="absolute inset-0 rounded-t-4xl border shadow-2xl shadow-white w-full h-full object-cover opacity-90 mix-blend-overlay pointer-events-none"
        />
        <div className="max-w-6xl mx-auto py-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative">
          {/* Footer Glow */}
          <span className="absolute blur-[300px] -top-20 left-1/4 w-[30%] h-[60%] bg-red-600/40" />
          <span className="absolute blur-[300px] -top-20 right-1/4 w-[30%] h-[60%] bg-blue-500/40" />

          {/* Links */}
          <div className="flex flex-col">
            <h1 className="text-6xl md:text-7xl  text-stone-100 russo mb-4">
              BOX'LIT
            </h1>

            <div className="border-t border-gray-700  pt-6 text-center text-gray-500">
              &copy; {new Date().getFullYear()} BOX'LIT. All rights reserved.
            </div>
          </div>

          {/* Legal / Credits */}
          <div className="mt-10 lg:mt-0 text-center lg:text-left max-w-sm">
            <p className="mb-2">
              Note - All video content featured in this app is the intellectual
              property of its respective owners. We do not claim ownership of
              any third-party videos.
            </p>
            <p>
              Built by –{" "}
              <a
                href="https://constayush.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-300 hover:text-red-600 transition"
              >
                Ayush
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
