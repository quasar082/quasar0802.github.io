"use client";

import { useRef} from "react";
import AnimatedText from "@/components/AnimatedText";
import { motion, useInView } from "framer-motion";
import ButtonDownloadCV from "@/components/ButtonDownloadCV";
import BaseVideo from "@/components/BaseVideo";
import InfoItem from "@/components/InfoItem";




const IntroduceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false });
  const bottomViewRef = useRef<HTMLDivElement>(null);
  const isBottomInView = useInView(bottomViewRef, { once: false });
  const infoRef = useRef<HTMLDivElement>(null);

  const infoItems = [
    { label: "Country", value: "Viet Nam" },
    { label: "Year Of Birth", value: "2002" },
    { label: "Graduation School", value: "Nguyen Tat Thanh University" },
    { label: "Year Experience", value: "1 Year +" },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen h-[350vh] flex flex-col container mx-auto px-4 xl:px-7 pt-17 w-full z-10"
      id="introduct"
    >
      <div className="flex flex-col justify-between mb-12 md:mb-20 overflow-hidden text-6xl sm:text-[10vw]/22 lg:text-9xl">
        <motion.div
          initial={{ y: -100, x: -200, opacity: 0 }}
          animate={
            isInView
              ? { y: 0, x: 0, opacity: 1 }
              : { y: -100, x: -200, opacity: 0 }
          }
          transition={{
            y: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.4,
              delay: 0.1,
            },
            x: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.7,
              delay: 0.5,
            },
            opacity: {
              duration: 0.3,
              delay: 0.1,
            },
          }}
          className="self-center"
        >
          <AnimatedText text={"Artificial Minds"} />
        </motion.div>
        <motion.div
          initial={{ y: 100, x: 200, opacity: 0 }}
          animate={
            isInView
              ? { y: 0, x: 0, opacity: 1 }
              : { y: 100, x: 200, opacity: 0 }
          }
          transition={{
            y: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.4,
              delay: 0.1,
            },
            x: {
              type: "tween",
              ease: "easeInOut",
              duration: 0.7,
              delay: 0.5,
            },
            opacity: {
              duration: 0.3,
              delay: 0.1,
            },
          }}
        >
          <AnimatedText text={"Natural Words"} />
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-25 lg:h-full flex-1">
        {/* Video Section */}
        <div className="w-full lg:w-1/2 relative lg:h-full">
          <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col items-center justify-center py-8">
            <motion.div
              initial={{ opacity: 0, }}
              animate={
                isBottomInView ? { opacity: 1, } : { opacity: 0,  }
              }
              transition={{
                duration: 0.8,
                type: "spring",
                ease: "easeInOut",

              }}
              className="text-3xl font-medium  w-full flex flex-row justify-between"
            >
              <div>+</div><div>+</div><div>+</div><div>+</div>
            </motion.div>

            <BaseVideo
              src="/introduce/video.mp4"
              className="w-full h-full max-h-[50vh] object-cover rounded-4xl"
              style={{ objectPosition: "center 30%" }}
            />

            <motion.div
              initial={{ opacity: 0  }}
              animate={
                isBottomInView ? { opacity: 1,  } : { opacity: 0,  }
              }
              transition={{
                duration: 0.8,
                type: "spring",
                ease: "easeInOut",
              }}
               className="text-3xl font-medium  w-full flex flex-row justify-between"
            >
               <div>+</div><div>+</div><div>+</div><div>+</div>
            </motion.div>
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="text-xl md:text-2xl">
            <p>
              I&apos;m an AI engineer driven by a passion for language,
              cognition, and the potential of intelligent systems. With a deep
              foundation in natural language processing, large language models,
              agents, my work aims to create accessible, high-impact AI language
              solutions.
            </p>
            <p className="mt-10 mb-20">
              My vision is to bring intelligence closer to daily life—making it
              more human, more intuitive, and ultimately more valuable.
            </p>
              <div className="">
              <ButtonDownloadCV
              
              content="Download CV"
            />
              </div>
           
          </div>

          <div ref={bottomViewRef} className="h-[100vh] flex items-center justify-center">
            <motion.div
              ref={infoRef}
              className="w-full space-y-0"
              initial={{ opacity: 0 }}
              animate={isBottomInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.8,
                type: "spring",
                ease: "easeInOut",
              }}
            >
              {infoItems.map((item, index) => (
                <InfoItem key={index} label={item.label} value={item.value} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroduceSection;
