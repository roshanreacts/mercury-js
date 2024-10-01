import whyChooseImage from "../assets/whyChooseImage.png";
import SpeedIcon from "../assets/speedIcon.png";
import lock from "../assets/lock.png";
import Scalability from "../assets/scalability.png"
import Footer from "./Footer";

const data = [
  {
    title: "Speed",
    content:
      "Launch APIs faster, reduce manual coding, and focus on what matters—building features.",
    imageSrc: SpeedIcon,
  },
  {
    title: "Security",
    content:"Implement detailed access control with ease, protecting your data and ensuring compliance.",
    imageSrc: lock,
  }, {
    title: "Scalability",
    content:"Scale your backend seamlessly as your project grows, with Mercury.js's flexible architecture.",
    imageSrc: Scalability,
  },
];
function WhyChoose() {
  return (
    <div className="bg-[#003366] rounded-t-[50px]">

    <div className="min-h-screen flex flex-col gap-36  relative py-14 pl-[100px]">
      <h1 className="text-[85px] font-bold font-Manrope-ExtraBold tracking-tighter text-white">
        Why Choose <span className="text-[#0071E3]">Mercury.js</span>?
      </h1>
      <div className="grid grid-cols-12 gap-5 flex-grow">
        <div className="col-span-4 text-[white] h-[100%]">
          <div className="flex flex-col gap-10 h-[90%]">
            {data?.map((item, index: number) => (
              <div className="flex flex-col gap-5 " key={index}>
                <img
                  src={item?.imageSrc}
                  alt="icon"
                  className="w-[74px]  h-[59px] object-contain"
                />
                <div className="">
                <h3 className="text-[35px] font-bold font-Manrope-Bold tracking-tight text-[#B0D3F6]">
                  {item?.title}
                </h3>
                <p className="text-[20px] font-Manrope-Medium tracking-tight leading-[28px] w-[88%]">{item?.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-8">
          <img
            src={whyChooseImage}
            alt="Why Choose Image"
            className="h-[100%] w-[100%] object-contain"
          />
        </div>
      </div>
      
    </div>
    <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default WhyChoose;
