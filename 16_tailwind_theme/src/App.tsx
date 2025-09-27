import "./App.css";
import ToggleTheme from "./component/ToggleTheme";

function App() {
  return (
    <>
      <div className="flex justify-between items-center mb-8 flex-col">
        <h1 className="text-3xl font-bold">Tailwind Dark Theme</h1>
        <ToggleTheme />
      </div>
    </>
  );
}

export default App;
