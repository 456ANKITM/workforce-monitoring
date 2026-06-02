import { useState, useEffect } from "react";

const Success = ({
  title = "Success!",
  message = "Action completed successfully.",
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
    top-4 right-4  w-[92%] max-w-sm
    md:top-15 md:right-6 md:translate-x-0 md:w-auto
    bg-[#1c1c1c] text-white inline-flex space-x-3 p-4 text-sm rounded-2xl border border-gray-700 shadow-2xl animate-fadeIn">

      {/* ICON */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mt-0.5"
      >
        <path
          d="M16.5 8.31V9a7.5 7.5 0 1 1-4.447-6.855M16.5 3 9 10.508l-2.25-2.25"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* TEXT */}
      <div>
        <h3 className="text-white font-semibold">
          {title}
        </h3>

        <p className="text-gray-300 text-sm mt-1">
          {message}
        </p>
      </div>

      {/* CLOSE BUTTON */}
      <button
        type="button"
        aria-label="close"
        onClick={() => setVisible(false)}
        className="cursor-pointer mb-auto text-gray-400 hover:text-white active:scale-95 transition"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="12.532"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-45.74 0 12.532)"
            fill="currentColor"
            fillOpacity=".7"
          />
          <rect
            x="12.531"
            y="13.914"
            width="17.498"
            height="2.1"
            rx="1.05"
            transform="rotate(-135.74 12.531 13.914)"
            fill="currentColor"
            fillOpacity=".7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Success;