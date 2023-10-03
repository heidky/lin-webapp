const Tab = ({ id, label, selected, onClick }) => (
  <button
    className={`py-3 w-full text-md transition-all tracking-wider ${
      selected === id
        ? 'text-fuchsia-300 font-bold bg-gray-600 bg-opacity-75 '
        : 'text-white hover:bg-gray-700 bg-opacity-50'
    }`}
    onClick={() => onClick(id)}
  >
    {label}
  </button>
)

export default function ControlsSelectionTab({ selected, onSelect }) {
  return (
    <div className="flex flex-row bg-gray-700 bg-opacity-75 m-2 rounded-lg overflow-hidden">
      <Tab id="knob" label="Knob" onClick={onSelect} selected={selected} />
      <Tab id="2d" label="2D" onClick={onSelect} selected={selected} />
    </div>
  )
}
