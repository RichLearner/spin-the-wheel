"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import confetti from "canvas-confetti";

const LotteryWheel = () => {
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [numbers] = useState(() => Array.from({ length: 70 }, (_, i) => i + 1));
  const [colors] = useState(() => {
    // Define rainbow colors
    const rainbowColors = [
      "#FF0000", // Red
      "#FF7F00", // Orange
      "#FFFF00", // Yellow
      "#00FF00", // Green
      "#0000FF", // Blue
      "#4B0082", // Indigo
      "#9400D3", // Violet
    ];

    // Assign colors to numbers sequentially, repeating the pattern
    return Array.from({ length: 70 }, (_, i) => {
      const colorIndex = i % rainbowColors.length;
      return rainbowColors[colorIndex];
    });
  });
  const [desiredNumber, setDesiredNumber] = useState(42);
  const [showSettings, setShowSettings] = useState(false);
  const [wheelSize, setWheelSize] = useState(600);

  useEffect(() => {
    const updateWheelSize = () => {
      const screenWidth = window.innerWidth;
      // For mobile (< 768px), use 80% of screen width
      // For larger screens, use 600px or 80% of screen width, whichever is smaller
      const newSize =
        screenWidth < 768
          ? Math.min(screenWidth * 0.75, 500)
          : Math.min(screenWidth * 0.75, 600);
      setWheelSize(newSize);
    };

    // Initial size calculation
    updateWheelSize();

    // Add resize listener
    window.addEventListener("resize", updateWheelSize);
    return () => window.removeEventListener("resize", updateWheelSize);
  }, []);

  const CENTER = wheelSize / 2;
  const SPIN_DURATION = 5000;

  const getNumberPosition = (index: number) => {
    const angle = index * (360 / 70) * (Math.PI / 180);
    const radius = wheelSize * 0.4;
    return {
      x: CENTER + radius * Math.cos(angle),
      y: CENTER + radius * Math.sin(angle),
      angle: index * (360 / 70) + 90,
    };
  };

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinCount((prev) => prev + 1);

    // Determine if this is the 3rd spin
    const isThirdSpin = (spinCount + 1) % 3 === 0;

    // Select either the desired number or a random number
    const targetNumber = isThirdSpin
      ? desiredNumber
      : Math.floor(Math.random() * 70) + 1;

    // Calculate the current position of the target number
    const numberIndex = numbers.indexOf(targetNumber);

    // Calculate rotation needed to align number at top (270 degrees)
    const sectorAngle = 360 / 70;
    const currentRotation = rotation % 360; // Get current base rotation
    const targetAngle = 270 - numberIndex * sectorAngle; // We want the number at 270 degrees (top)

    // Calculate the minimal rotation needed
    let angleToRotate = targetAngle - currentRotation;
    // Ensure we always rotate at least 360 * 5 degrees
    angleToRotate =
      angleToRotate + Math.ceil(Math.abs(angleToRotate) / 360) * 360;
    angleToRotate = angleToRotate + 5 * 360; // Add 5 full rotations

    // Set the new rotation
    const targetRotation = rotation + angleToRotate;

    // Animate the wheel
    setRotation(targetRotation);
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedNumber(targetNumber);

      // Add confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, SPIN_DURATION);
  };

  const handleDesiredNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 70) {
      setDesiredNumber(value);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4 w-full">
      {/* Header with Settings Button */}
      <div className="text-center mb-4 relative w-full">
        <h1 className="text-3xl font-bold mb-2 text-white">Spin The Wheel</h1>
        <p className="text-gray-300">Spin Count: {spinCount}</p>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute right-4 top-0 p-2 rounded-full hover:bg-white hover:text-gray-800 text-white"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lucky Number (1-70)
                </label>
                <input
                  type="number"
                  min="1"
                  max="70"
                  value={desiredNumber}
                  onChange={handleDesiredNumberChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedNumber && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-xl font-bold text-white"
          >
            Selected Number: {selectedNumber}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wheel Container */}
      <div
        className="relative mb-8 w-full max-w-[600px] p-10"
        style={{ width: wheelSize, height: wheelSize }}
      >
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full" />

        {/* Rotating Wheel */}
        <motion.div
          className="absolute inset-0"
          style={{
            transformOrigin: "center",
            rotate: 0,
          }}
          animate={{
            rotate: rotation,
          }}
          transition={{
            duration: SPIN_DURATION / 1000,
            ease: "easeOut",
          }}
        >
          <svg width={wheelSize} height={wheelSize}>
            {numbers.map((number, index) => {
              const { x, y, angle } = getNumberPosition(index);
              const section = index * (360 / 70);
              const currentColor = colors[index];
              const textColor =
                currentColor === "#FFFF00" ||
                currentColor === "#FF7F00" ||
                currentColor === "#00FF00"
                  ? "black"
                  : "white";

              return (
                <g key={number}>
                  <path
                    d={`
                      M ${CENTER} ${CENTER}
                      L ${
                        CENTER +
                        wheelSize *
                          0.45 *
                          Math.cos((section - 2.5) * (Math.PI / 180))
                      } 
                        ${
                          CENTER +
                          wheelSize *
                            0.45 *
                            Math.sin((section - 2.5) * (Math.PI / 180))
                        }
                      A ${wheelSize * 0.45} ${wheelSize * 0.45} 0 0 1 
                        ${
                          CENTER +
                          wheelSize *
                            0.45 *
                            Math.cos((section + 2.5) * (Math.PI / 180))
                        }
                        ${
                          CENTER +
                          wheelSize *
                            0.45 *
                            Math.sin((section + 2.5) * (Math.PI / 180))
                        }
                      Z
                    `}
                    fill={currentColor}
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={textColor}
                    fontSize="12"
                    fontWeight="bold"
                    transform={`rotate(${angle}, ${x}, ${y})`}
                  >
                    {number}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center Hub and Arrow Button - Now outside the rotating wheel */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className="absolute inset-0 pointer-events-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full z-10"
          style={{ width: wheelSize, height: wheelSize }}
        >
          <svg
            width={wheelSize}
            height={wheelSize}
            className="pointer-events-none"
          >
            {/* Center Hub */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r="20"
              fill={isSpinning ? "#E5E5E5" : "white"}
              stroke="#E5E5E5"
              strokeWidth="2"
            />

            {/* Arrow from center to top */}
            <path
              d={`M ${CENTER} ${CENTER} 
                  L ${CENTER} ${CENTER - wheelSize * 0.07}`}
              stroke={isSpinning ? "#E5E5E5" : "white"}
              strokeWidth="4"
              markerEnd="url(#arrowhead)"
              className="z-0"
            />

            {/* SPIN Text */}
            <text
              x={CENTER}
              y={CENTER}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isSpinning ? "#999" : "#666"}
              fontSize="12"
              fontWeight="bold"
              className="z-100"
            >
              {isSpinning ? "..." : "SPIN"}
            </text>

            {/* Arrow definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill={isSpinning ? "#E5E5E5" : "white"}
                />
              </marker>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LotteryWheel;
