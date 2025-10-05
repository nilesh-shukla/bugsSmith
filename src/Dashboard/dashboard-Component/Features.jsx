import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Features({ icon, title, numbers, changingRate, iconBgColor, rateColor}) {
  return (
    <div className="flex relative justify-between gap-2 rounded-2xl bg-white p-2 items-center ">
        <div className="flex gap-4 items-center">
            <div className={`rounded-full ${iconBgColor} w-14 h-14 flex justify-center items-center`}>
                <FontAwesomeIcon icon={icon} className={`text-white text-[1.7rem]`}/>
            </div>
            <div>
                <h1 className="text-sm text-gray-400" style={{fontWeight: 400}}>{title}</h1>
                <h1 className="text-4xl text-black font-semibold">{numbers}</h1>
            </div>
        </div>
        <div>
            <h1 className={`text-xs absolute right-4 bottom-4 ${rateColor}`}>{changingRate}</h1>
            {/* Increasing or Decreasing Icon depending on changing rate */}
        </div>
    </div>
  )
}

export default Features