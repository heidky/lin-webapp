import { deviceManger } from "./store/store";

function App() {
  const onConnect = () => {
    deviceManger.connectPrompt()
  }


  return (
    <div className="min-h-screen flex flex-col items-stretch justify-stretch bg-gray-900">

      <header className="App-header">
        <h1 className="text-white text-4xl">Hello world!</h1>
      </header>
      <button onClick={onConnect}>Connect</button>
    </div>
  );
}

export default App;
