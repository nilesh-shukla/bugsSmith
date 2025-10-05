import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from "@fortawesome/free-solid-svg-icons"

function ProfileActivity() {
  return (
    <div className="bg-white w-full p-4 rounded-3xl">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl">Profile Activity</h1>
                <button className="bg-gray-200 hover:bg-gray-400 text-xl cursor-pointer px-3 py-2 rounded-2xl transition-all duration-200">
                    <FontAwesomeIcon icon={faEllipsis} />
                </button>
            </div>
    </div>
  )
}

export default ProfileActivity