import { useTheme } from "../hooks/useTheme";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-300 
        ${
          isDark
            ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
            : "bg-gray-500 text-white hover:bg-gray-700"
        }
      `}
    >
      {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ToggleTheme;
