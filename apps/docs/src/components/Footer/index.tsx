import logo from '../../assets/Logo mercury.png'
import union from '../../assets/Logo mercury.png'
import { useEffect, useRef } from 'react';

const Footer = () => {
  const mercuryTextRef = useRef<HTMLHeadingElement | null>(null);


  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const footerElement = mercuryTextRef.current;
      if (!footerElement) return; // Guard against null reference

      const { width, height, left, top } = footerElement.getBoundingClientRect();
      const mouseX = event.clientX - left; // Relative to element
      const mouseY = event.clientY - top;  // Relative to element

      const mouseXpercentage = Math.round((mouseX / width) * 100); // Normalize to 0-100%
      const mouseYpercentage = Math.round((mouseY / height) * 100); // Normalize to 0-100%

      footerElement.style.background = `conic-gradient(
        at ${mouseXpercentage}% ${mouseYpercentage}%,
        #FFFFFF 0%,
        #CCE5FF 28%,
        #0071E3 50%,
        #D9EAFB 80%,
        #FFFFFF 100%
      )`;
      footerElement.style.backgroundClip = 'text';
      footerElement.style.webkitBackgroundClip = 'text';
      footerElement.style.color = 'transparent'; // Ensure text color is transparent
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  return (
    <div className="  w-full flex flex-col bg-[#00284F] p-10 rounded-t-[50px] text-center px-20" id="footer">
      <div className="grid grid-cols-12">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
        <div className="col-span-5">
          <div className="flex flex-row mt-12 gap-2 justify-start items-center">
            <img src={logo} alt="Mercury Logo" className='w-[111px] h-[69px]' />
            <div className="flex flex-col justify-start items-start gap-0">
              <h1 ref={mercuryTextRef}
                className="text-[45px]  text-white font-Manrope-ExtraBold tracking-tight mercury-gra leading-[50px]  ">
                Mercury
              </h1>
              <h2 className="text-[#0071E3] font-Manrope-Bold tracking-tight text-2xl ml-0.5 -mt-2">Software Foundation</h2>
            </div>
          </div>
          <div className="mt-8 text-[#0071E3] font-Manrope-Light tracking-normal text-start w-9/12">
            <h1>
              Scale your backend seamlessly as your project grows,
              with Mercury.js's flexible architecture.
            </h1>
          </div>
        </div>

        <div className="col-span-3">
          <div className="flex flex-row">
            <div className="mt-12 text-white flex flex-col  items-start transition-all delay-300 ease-in-out">
              <a href="/mercury-js/docs/intro"
                className="hover:bg-gradient-to-t from-[#005AB6] to-[#0071E3] rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-sm transition-all duration-300 ease-in-out"
              >
                <i className="fa-solid fa-file text-[#0071E3] transition-colors duration-300 ease-in-out"></i>
                Documentation
              </a>
              <a href="https://github.com/Mercury-Software-Foundation" className="hover:bg-gradient-to-t from-[#005AB6] to-[#0071E3] rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-sm transition-all duration-300 ease-in-out">
                <i className="fa-brands fa-github text-[#0071E3]"></i> GitHub
              </a>
              {/* <a href="#" className="hover:bg-gradient-to-t from-[#005AB6] to-[#0071E3] rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-sm transition-all duration-300 ease-in-out">
                <i className="fa-solid fa-phone text-[#0071E3]"></i> Contact Us
              </a> */}
            </div>

            {/* <div className="mt-12 text-white flex flex-col  ml-20 items-start">
              <a href="#" className="hover:bg-gradient-to-t from-[#005AB6] to-[#0071E3] rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-sm transition-all duration-300 ease-in-out">
                <i className="fa-brands fa-instagram text-[#0071E3]"></i> Instagram
              </a>
              <a href="#" className="hover:bg-gradient-to-t from-[#005AB6] to-[#0071E3] rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-sm transition-all duration-300 ease-in-out">
                <i className="fa-brands fa-twitter text-[#0071E3]"></i> Twitter
              </a>
              <a href="#" className="hover:bg-gradient-to-t from-[#005AB6] to-[#0071E3] rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-sm transition-all duration-400 ease-in-out0">
                <i className="fa-brands fa-youtube text-[#0071E3]"></i> Youtube
              </a>
            </div> */}
          </div>
        </div>

        {/* <div className="col-span-4 flex justify-start items-start flex-col ml-28">
          <h1 className=" mt-12 text-white">
            Subscribe for latest Updates & News!
          </h1>
          <div className=" mt-2">
            <div className="relative w-full">
              <input
                className="border-2 rounded-xl w-full border-[#0071E3] placeholder:text-[#0071E3] py-2 bg-[#00284F] pl-3 text-white transition duration-300 ease-in-out focus:border-[#0071E3] hover:border-[#0071E3]"
                placeholder="Enter your Email"
                type="email"
              />

              <button
                className="absolute -right-1/3 border-2 top-1/2 transform -translate-y-1/2 px-5 py-2 rounded rounded-r-xl text-white border-[#0071E3] bg-[#0071E3]"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div> */}
      </div>

      <div className="flex flex-row justify-between font-Manrope-Medium tracking-normal text-[#0055AA] bg-[#002040] rounded-2xl gap-3 px-5 py-5 mt-5 w-[100%]">
        <div>
          <p>Copyright © 2024 Mercury Software Foundation by Vithi</p>
        </div>
        <div className="flex flex-row gap-1">
          <div>
            <p>Built with </p>
          </div>

          <div className="flex gap-1">
            <p>Docusaurus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;