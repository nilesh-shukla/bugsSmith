import React from 'react'
import Select from 'react-select'
import IntegerateCard from './dashboard-Component/IntegerateCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faS, faSearch } from '@fortawesome/free-solid-svg-icons';
import { div, label } from 'framer-motion/client';

const integrate = [
  { label: "All Integerations", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Other", value: "other" }
];

function Integrate() {
  return (
    <div className="relative">
      <img src="/dashboard-bg/integerate.png" className='absolute opacity-15 w-full h-full z-0 object-cover' />
      <div className='relative flex flex-col gap-6 p-16 justify-center items-center'>
        <div className='flex gap-2 items-center kode-font'>
          <img src="/web-logo.png" alt="" className='w-8 h-8' />
          <h1 className='text-2xl text-[#9cc0e4]'>BugsSmith</h1>
        </div>

        <h1 className='text-[2.8rem] text-[#b5c7d9] text-center'>
          Explore Integrations
        </h1>

        <p className='text-base text-white text-center'>
          Our integrations make it easy to work with the applications you and your organisation already love.
        </p>

        <div className='flex gap-4 items-center justify-center'>
          <div className='w-50'>
            <Select
              options={integrate}
              defaultValue={integrate[0]}
              isSearchable={false}
              styles={{
                control: (base, state) => ({
                  ...base,
                  border: "2px solid white",
                  borderRadius: "20px",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  boxShadow: state.isFocused ? "none" : base.boxShadow,
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white", 
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "white",
                }),
                indicatorSeparator: () => (null),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#232e3c",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#31485f" : "#232e3c",
                  color: "#e0e6ed",
                  cursor: "pointer",
                }),
              }}
            />
          </div>
          <button className='w-fit px-4 py-1.5 bg-transparent hover:border-gray-400 border-2 border-white rounded-full cursor-pointer transition-all duration-300'>
            <FontAwesomeIcon icon={faSearch} className='text-white' />
          </button>
        </div>

        <div className='grid grid-cols-4 w-full gap-6 items-center'>
          <IntegerateCard image={"/IntegerateCardImages/git.png"} heading={"GIT"} describe={"Place to commit my coding history"} tag={"other"} />
          <IntegerateCard image={"/IntegerateCardImages/react.png"} heading={"ReactJS"} describe={"The one bringing ideas to reality"} tag={"frontend"} />
          <IntegerateCard image={"/IntegerateCardImages/nodejs.png"} heading={"NodeJS"} describe={"Works best for frontend and backend"} tag={"frontend"} />
          <IntegerateCard image={"/IntegerateCardImages/javascript.webp"} heading={"JavaScript"} describe={"Language to provide dynamics"} tag={"other"} />
          <IntegerateCard image={"/IntegerateCardImages/tailwindcss.png"} heading={"TailwindCSS"} describe={"Easily provides design mechanism"} tag={"frontend"} />
          <IntegerateCard image={"/IntegerateCardImages/fastapi.png"} heading={"FastAPI"} describe={"To integerate my frontend with logic"} tag={"other"} />
          <IntegerateCard image={"/IntegerateCardImages/jupyter.png"} heading={"Jupyter"} describe={"Platform for backend logic in python"} tag={"backend"} />
          <IntegerateCard image={"/IntegerateCardImages/nextjs.png"} heading={"NextJS"} describe={"Another library to code my backend"} tag={"backend"} />
          <IntegerateCard image={"/IntegerateCardImages/render.webp"} heading={"Render"} describe={"My place for deploying sites"} tag={"other"} />
          <IntegerateCard image={"/IntegerateCardImages/fontawesome.png"} heading={"FontAwesome"} describe={"Best place to find icons"} tag={"frontend"} />
          <IntegerateCard image={"/IntegerateCardImages/python.png"} heading={"Python"} describe={"Language to code my ML logic"} tag={"backend"} />
          <IntegerateCard image={"/IntegerateCardImages/kaggle.png"} heading={"Kaggle"} describe={"Easily finding training datasets"} tag={"backend"} />
        </div>

      </div>
    </div>
  )
}

export default Integrate
