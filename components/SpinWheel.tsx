"use client";

import { useState, useRef } from "react";
import { Settings, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TOTAL_NUMBERS = 70;
const SPIN_DURATION = 5000; // 5 seconds

const RAINBOW_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
];

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [predestinedNumber, setPredestinedNumber] = useState(7);
  const [spinCount, setSpinCount] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const generateRandomNumber = () => {
    if ((spinCount + 1) % 3 === 0) {
      return predestinedNumber;
    }
    const usedNumber = selectedNumber !== null ? selectedNumber : -1;
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
    } while (randomNum === usedNumber);
    return randomNum;
  };

  const calculateRotation = (targetNumber: number) => {
    const degreePerNumber = 360 / TOTAL_NUMBERS;
    const targetDegree = 360 - (targetNumber - 1) * degreePerNumber;
    const extraSpins = 5 * 360; // 5 full rotations
    return rotation + extraSpins + targetDegree;
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const targetNumber = generateRandomNumber();
    const newRotation = calculateRotation(targetNumber);

    setRotation(newRotation);
    setSpinCount((prev) => prev + 1);

    setTimeout(() => {
      setSelectedNumber(targetNumber);
      setIsSpinning(false);
    }, SPIN_DURATION);
  };

  const resetWheel = () => {
    setSelectedNumber(null);
    setSpinCount(0);
    setRotation(0);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
        {/* Pointer */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-4 h-16 bg-white shadow-lg relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[16px] border-l-transparent border-r-transparent border-b-white"></div>
          </div>
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full border-8 border-white relative overflow-hidden shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${SPIN_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
              : "none",
          }}
        >
          {Array.from({ length: TOTAL_NUMBERS }).map((_, index) => {
            const number = index + 1;
            const rotation = (360 / TOTAL_NUMBERS) * index;
            const colorIndex = index % RAINBOW_COLORS.length;
            const skewDegree = 360 / TOTAL_NUMBERS / 2;

            return (
              <div
                key={number}
                className={`absolute w-full h-[50%] origin-bottom ${RAINBOW_COLORS[colorIndex]}`}
                style={{
                  transform: `rotate(${rotation}deg) skew(${
                    90 - skewDegree
                  }deg)`,
                }}
              >
                <div
                  className="absolute left-1/2 bottom-full -translate-x-1/2 -translate-y-2 text-white font-bold origin-bottom"
                  style={{
                    transform: `rotate(${-(90 - skewDegree)}deg)`,
                  }}
                >
                  {number}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {selectedNumber && (
          <div className="text-2xl font-bold text-white mb-4">
            Selected: {selectedNumber}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            size="lg"
            onClick={spinWheel}
            disabled={isSpinning}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            {isSpinning ? "Spinning..." : "Spin"}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Wheel Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="predestined">
                    Predestined Number (Every 3rd Spin)
                  </Label>
                  <Input
                    id="predestined"
                    type="number"
                    min="1"
                    max={TOTAL_NUMBERS}
                    value={predestinedNumber}
                    onChange={(e) =>
                      setPredestinedNumber(Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            size="lg"
            variant="outline"
            onClick={resetWheel}
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-white/60 text-sm">
          Spin Count: {spinCount}
          {spinCount > 0 && spinCount % 3 === 0 && (
            <span className="ml-2">(Predestined spin)</span>
          )}
        </div>
      </div>
    </div>
  );
}
