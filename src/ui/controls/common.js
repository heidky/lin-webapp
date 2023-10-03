export const StopButton = ({ onClick, disabled }) => (
  <button
    disabled={disabled}
    className="text-white text-lg p-2 bg-pink-500 hover:bg-opacity-90 active:bg-pink-400 disabled:bg-gray-700 disabled:text-gray-400 rounded-lg w-full font-bold transition-colors"
    onClick={onClick}
  >
    STOP
  </button>
)

export const Indicator = ({ isOn }) => (
  <div
    className={`${
      isOn ? 'bg-pink-500' : 'bg-gray-700'
    } h-1 rounded-full mb-1 mx-2 transition-colors`}
  />
)
