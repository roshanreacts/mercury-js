import React, { useEffect, useRef } from "react";
import "../App.css";
import { featuresData } from "../constants";
import WhyChoose from "./whyChoose";


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
  return (
    <div
      className={`feature flex flex-col text-start w-[100%]  ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } md:items-center items-start lg:mt-[110px] mt-[40px] flex-col-reverse xl:gap-2 lg:gap-5 gap-3`}>
      <div className=" lg:w-[60%] md:w-[30%] flex flex-col  lg:gap-5 gap-2">
        <h3 className="xl:text-[50px] md:text-[40px] text-[34px]  xl:leading-[52.5px] font-Manrope-Bold tracking-tighter md:leading-[40px] text-[#0071E3] xl:w-[72%] lg:w-[60%]">
          {title}
        </h3>
        <p className="text-black lg:text-[25px] md:text-[16px] font-Manrope-Medium tracking-tight lg:leading-[32px] md:leading-[20px] text-[14px] leading-[17px] ">
          {description}
        </p>
      </div>
      <div className="flex justify-center xl:p-0 lg:p-6">
        <img src={imageSrc} alt={imageAlt} className="xl:w-full md:w-[100%]  w-[240px]  xl:h-[300px] h-[240px] object-contain" />
      </div>
    </div>
  );
};

const FeaturesSection: React.FC = () => {

  return (
    <div className="bg-[#E6F1FC] rounded-t-[50px]">
      <div  className="lg:py-16 max-w-[100%] lg:px-[100px] rounded-t-[50px] px-5 py-10">
        <div className="flex flex-col justify-center align-middle text-start mb-12  ">
          <h2 className="font-Manrope-Bold text-[#00284F] md:w-[95%] md:leading-[55px] lg:leading-[74px] xl:leading-[95.3px] xl:text-[85px] lg:text-[70px] md:text-[48px] text-[40px] leading-[41.34px] font-Manrope-ExtraBold tracking-tighter">
            <span className="text-[#0071E3]">Powerful Features</span> to <br className="lg:block hidden" /> Supercharge Your Development
          </h2>
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
      {/* <div>
        <Featuress/>
      </div> */}
      <div>
        <WhyChoose />
      </div>
    </div>
  );
};

export default FeaturesSection;
