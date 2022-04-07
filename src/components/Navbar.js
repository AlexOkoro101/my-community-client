import React from 'react'

function Navbar() {
    const toggleNav = () => {
        const dropdown = document.getElementById("dropdown");

        if(dropdown.classList.contains('hidden')) {
            dropdown.classList.remove('hidden');
        } else {
            dropdown.classList.add('hidden');
        }
    }
  return (
    <div className="flex justify-between h-20 items-center font-primary border-b bottom-px border-gray-300 relative z-10">
        <div className="w-10 h-10 bg-[#e76994] rounded-full items-center flex justify-center group cursor-pointer">
            <h1 className="group-hover:text-gray-200 text-white text-lg font-semibold">A</h1>
        </div>
        <ul className="absolute bg-white w-full -bottom-52 md:bg-transparent md:w-auto md:relative flex-row justify-between gap-4 text-sm font-bold text-gray-400 md:text-[#cbccd4] hidden md:flex px-4 md:bottom-auto" id="dropdown">
            <li className="hover:text-[#e76994] cursor-pointer py-4 border-b bottom-px border-gray-200 md:py-0 md:border-none">Home</li>
            <li className="hover:text-[#e76994] cursor-pointer py-4 border-b bottom-px border-gray-200 md:py-0 md:border-none">Int3ract</li>
            <li className="hover:text-[#e76994] cursor-pointer py-4 border-b bottom-px border-gray-200 md:py-0 md:border-none">Resume</li>
            <li className="hover:text-[#e76994] cursor-pointer py-4 border-b bottom-px border-gray-200 md:py-0 md:border-none">Contact Me</li>
        </ul>

        <button className="inline-block md:hidden" aria-expanded="false" type="button" data-dropdown-toggle="dropdown" onClick={toggleNav}>
            <svg className="w-8 h-8" fill="none" stroke="#cbccd4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        </button>
    </div>
  )
}

export default Navbar