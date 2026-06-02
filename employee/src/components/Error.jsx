import { useState, useEffect } from "react";

const Error = ({
  title = "Error!",
  message = "Oops! Something went terribly wrong.",
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed z-50
    top-4 right-4 w-[92%] max-w-sm
    md:top-15 md:right-6 md:translate-x-0 md:w-auto
    flex items-center justify-between
    bg-[#1c1c1c] text-red-400 shadow-2xl rounded-2xl overflow-hidden border border-red-900 animate-fadeIn">

      {/* LEFT BAR */}
      <div className="h-full w-1.5 bg-red-500"></div>

      {/* CONTENT */}
      <div className="flex items-center py-4 px-4 flex-1">
        {/* ICON */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            style={{
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "1.95",
            }}
            d="M11.95 16.5h.1"
          />

          <path
            d="M3 12a9 9 0 0 1 9-9h0a9 9 0 0 1 9 9h0a9 9 0 0 1-9 9h0a9 9 0 0 1-9-9m9 0V7"
            style={{
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "1.5",
            }}
          />
        </svg>

        {/* TEXT */}
        <div className="ml-3">
          <p className="font-semibold text-sm text-white">
            {title}
          </p>

          <p className="text-xs text-red-300 mt-1">
            {message}
          </p>
        </div>
      </div>

      {/* CLOSE BUTTON */}
      <button
        type="button"
        aria-label="close"
        onClick={() => setVisible(false)}
        className="active:scale-90 transition-all mr-3 text-gray-400 hover:text-white"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Error;