import { useState } from 'react';
import union from '../../assets/Union.png';
import onbar from '../../assets/Dark Toggle.png';
import offbar from '../../assets/Property 1=Dark.png';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleColor = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.body.classList.remove('bg-[#0071E3]');
      document.body.classList.add('bg-blue-500');
    } else {
      document.body.classList.remove('bg-blue-500');
      document.body.classList.add('bg-[#0071E3]');
    }
  };

  return (
    <div className={'bg-transparent bg-opacity-45 flex flex-row w-full justify-between items-center p-5 px-16'}>

      <div className='w-full h-full'>
        <img className='w-[50px] h-[30px]' src={union} alt="Union Logo" />
      </div>
      <div className='flex items-center text-white gap-4 justify-start'>
        <a href="/mercury-js/docs/intro" style={{
          textDecoration: "none"
        }} className="hover:bg-[linear-gradient(180deg,#0071E3_0%,#005AB6_100%)] hover:text-white rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-lg transition-all duration-300 ease-in-out">
          <i className="fa-solid fa-file "></i> Docs
        </a>
        <a href="https://github.com/Mercury-Software-Foundation" style={{
          textDecoration: "none"
        }} target='_blank' className="hover:bg-[linear-gradient(180deg,#0071E3_0%,#005AB6_100%)] hover:text-white rounded-full px-5 py-2.5 flex items-center justify-start gap-2 text-lg transition duration-300">
          <i className="fa-brands fa-github"></i> GitHub
        </a>
        <button
          onClick={toggleColor}
          className='rounded-2xl bg-[#0071E3A6] flex items-center justify-center min-w-11 min-h-6 transition delay-300 ease-in-out'
        >
          <img
            src={isDark ? offbar : onbar}
            alt="Toggle Icon"
            style={{ width: '45px', height: '25px' }} // Adjust icon size as needed
          />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
