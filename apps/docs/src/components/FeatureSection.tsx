import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../App.css";
import { featuresData } from "../constants";
import WhyChoose from "./whyChoose";

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);


interface FeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

const Feature: React.FC<FeatureProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}) => {
  const featureRef = useRef<HTMLDivElement | null>(null);

  // GSAP animation on mount
  useEffect(() => {
    gsap.fromTo(
      featureRef.current,
      { opacity: 0, x: reverse ? 100 : -100 }, // Start from off-screen
      {
        opacity: 1,
        x: 0, // Slide in to original position
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: featureRef.current,
          start: "top 80%", // Animation starts when the feature is near the viewport
          toggleActions: "play none none none",
        },
      }
    );
  }, [reverse]);

  return (
    <div
      ref={featureRef}
      className={`flex flex-col text-start w-[100%]  ${reverse ? "md:flex-row-reverse" : "md:flex-row"
        } items-center mt-[120px]`}
    >
      <div className="w-[30%] flex flex-col gap-5">
        <h3 className="text-[55px] leading-[58.5px] font-Manrope-Bold tracking-tighter text-[#0071E3] mb-4 w-[70%]">
          {title}
        </h3>
        <p className="text-black text-[25px] font-Manrope-Medium tracking-tight leading-[32px] ">
          {description}
        </p>
      </div>
      <div className="flex justify-center p-6">
        <img src={imageSrc} alt={imageAlt} className="w-full max-w-md" />
      </div>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);



  return (
    <div className="bg-[#E6F1FC] rounded-t-[50px]">

    <div ref={sectionRef} className="py-16 max-w-[100%] px-[100px] rounded-t-[50px]">
      <div className="flex flex-col justify-center align-middle text-start mb-12 font-Manrope-ExtraBold tracking-tighter  text-[85px] leading-[95.3px] ">
        <h2 className="flex flex-row gap-2">
          <span className="text-[#0071E3]">Powerful Features</span>
          <span className="text-[#00284F]">to</span>
        </h2>
        <h2 className="text-[#00284F]">Supercharge Your Development</h2>
      </div>

      {/* Features */}
      {featuresData.map((feature, index) => (
        <Feature
          key={index}
          title={feature.title}
          description={feature.description}
          imageSrc={feature.imageSrc}
          imageAlt={feature.imageAlt}
          reverse={feature.reverse}
        />
      ))}
      
    </div>
    <div className="">
        <WhyChoose />
      </div>
    </div>
  );
};

export default FeaturesSection;
