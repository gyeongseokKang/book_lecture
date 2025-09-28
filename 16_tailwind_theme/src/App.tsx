import "./App.css";

function App() {
  return (
    <>
      <div>
        <BuiltIn />
        <hr />
        <Env />
      </div>
    </>
  );
}

export default App;

const BuiltIn = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Built-in</h2>
      <p>Current Mode: {import.meta.env.MODE}</p>
      <p>Base URL: {import.meta.env.BASE_URL}</p>
      <p>Is Production: {import.meta.env.PROD ? "Yes" : "No"}</p>
      <p>Is Development: {import.meta.env.DEV ? "Yes" : "No"}</p>
      <p>Is Server-Side Rendering: {import.meta.env.SSR ? "Yes" : "No"}</p>
    </div>
  );
};

const Env = () => {
  console.log("컴포넌트 랜더링");
  return (
    <div>
      <h2 className="text-2xl font-bold">Env</h2>
      <p>VITE_SAMPLE_KEY: {import.meta.env.VITE_SAMPLE_KEY}</p>
      <p>DB_SECRET_KEY: {import.meta.env.DB_SECRET_KEY}</p>
    </div>
  );
};
