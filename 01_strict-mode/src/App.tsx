import { useEffect } from "react";
import "./App.css";

function App() {
  return <IntervalDemo />;
}

export default App;

function IntervalDemo() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Interval 실행");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>IntervalDemo</>;
}
