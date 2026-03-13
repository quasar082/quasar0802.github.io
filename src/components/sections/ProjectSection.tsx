"use client";

import { useRef } from "react";
import AnimatedText from "@/components/AnimatedText";
import BaseImage from "@/components/BaseImage";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ButtonRedirect from "../ButtonRedirect";
import AnimatedDiv from "@/components/AnimatedDiv";
import GradientBackground from "../GradientBackground";

interface Project {
  id: number;
  title: string;
  image: string;
  tags: string[];
  githubUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Papery - Academic Document Chatbot",
    image: "/projects/project1.png",
    tags: [
      "Chatbot RAG",
      "Mathematical format document",
      "Translation Preserved Formats",
    ],
    githubUrl: "https://github.com/QuanMofii/PAPERY",
  },
  {
    id: 2,
    title: "Predicting Vietnamese Stock Prices",
    image: "/projects/project2.png",
    tags: ["ML", "DL", "Time Series", "ARIMA", "LSTM"],
    githubUrl: "https://github.com/QuanMofii/Predicting_Vietnamese_Stock",
  },
  {
    id: 3,
    title: "Predict Potential Customer For The Banks",
    image: "/projects/project3.png",
    tags: ["ML", "Data Cleaning", "Data Analyst", "Prediction"],
    githubUrl:
      "https://github.com/QuanMofii/Predict_potential_customers_for_the_banks_marketing_campaign",
  },
  {
    id: 4,
    title: "Chatbot Multi-Agent Company",
    image: "/projects/project4.png",
    tags: ["Chatbot", "LLM Local & GPT", "Multi-Agent workflow"],
    githubUrl: "https://github.com/QuanMofii/Chatbot_multiagent",
  },
];

const ProjectSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col   relative overflow-hidden"
      id="project"
    >
       <GradientBackground />
   
      <div className="container mx-auto px-4 xl:px-7 pt-15 pb-30 text-white  z-50 ">
        <div className="flex flex-col lg:flex-row justify-between mt-20 mb-30">
          <AnimatedText text={"My Work"} className="text-[20vw] md:text-9xl" />
          <div className="md:text-base mt-5 md:mt-0 flex flex-col items-end  justify-end mb-3">
            <AnimatedText text="I build machines that think" />
            <AnimatedText text="Frontend design is my obsession" />
            <AnimatedText text="I aspire to master system architecture." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-x-11 gap-y-20 mt-50 overflow-hidden">
          {projects.map((project, index) => (
            <Link
              href={project.githubUrl}
              key={project.id}
              target="_blank"
              rel="noopener noreferrer"
              className={`${index % 2 === 1 ? 'md:mt-[16vw]' : ''} h-fit`}
            >
              <AnimatedDiv
                delay={index * 0.2}
                initialScale={0.85}
                finalScale={1}
                withRotate={true}
                className="group relative overflow-hidden  cursor-pointer"
              >
                <div className="relative  aspect-[13/9]  overflow-hidden rounded-3xl">
                  <div className="relative shadow-3xl h-full w-full transition-transform duration-500 group-hover:scale-110 ">
                    <BaseImage
                      src={project.image}
                      alt={project.title}
                      className="object-fit rounded-3xl"
                    />
                  </div>
                </div>

                <div className="py-6">
                  <div className="flex items-center mb-3 whitespace-nowrap  ">
                    {project.tags.map((tag, i) => (
                      <div key={i} className="flex items-center shrink-0">
                        <span className="text-sm">{tag}</span>
                        {i < project.tags.length - 1 && (
                          <span className="mx-3 inline-block w-1 h-1 bg-white rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 transition-transform duration-300 -translate-x-7 group-hover:translate-x-0">
                    <div className="text-lg font-semibold opacity-0 -translate-x-5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      <ArrowRight size={20} />
                    </div>
                    <h3 className="text-3xl font-bold line-clamp-1">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </AnimatedDiv>
            </Link>
          ))}
        </div>
        <div className="flex justify-center w-full h-auto mt-40 mb-20">
          <ButtonRedirect
            href="https://github.com/QuanMofii"
            content="View All Projects"
          />
        </div>
      </div>
      
    </section>
  );
};

export default ProjectSection;
