"use client";

import { motion } from "framer-motion";
import {Terminal  } from "lucide-react";
import {  useState } from "react";
const InfoItem = ({ label, value }: { label: string; value: string }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        className="relative overflow-hidden cursor-pointer text-right text-[5.5vh] font-medium"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered(!isHovered)}
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ 
            y: isHovered ? -100 : 0,
            paddingRight: isHovered ? 30 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="border-b-2 h-[10vh] flex justify-between items-end"
        >
         <Terminal strokeWidth={1.1} style={{ height: '7.4vh', width: '7.4vh' ,}}  /> <p className="truncate max-w-full">{label}</p>
        </motion.div>
        <motion.div
          initial={{ y: 100 }}
          animate={{ 
            y: isHovered ? 0 : 100,
            paddingRight: isHovered ? 30 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-0 left-0 h-[10vh] flex justify-end items-end bg-black w-full text-white"
        >
          <p className="truncate max-w-full pl-[30px] my-auto">{value}</p>
        </motion.div>
      </div>
    );
  };

  export default InfoItem;