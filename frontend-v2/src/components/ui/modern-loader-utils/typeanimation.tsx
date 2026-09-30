"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypeAnimationProps {
  words: string[];
  typingSpeed?: "fast" | "medium" | "slow" | number;
  deletingSpeed?: "fast" | "medium" | "slow" | number;
  pauseDuration?: number;
  className?: string;
}

export const TypeAnimation: React.FC<TypeAnimationProps> = ({
  words = ["Loading...", "Processing...", "Please wait..."],
  typingSpeed = "slow",
  deletingSpeed = "slow",
  pauseDuration = 2000,
  className,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const getSpeed = (speed: "fast" | "medium" | "slow" | number, isDelete: boolean) => {
    if (typeof speed === "number") return speed;
    if (isDelete) {
      switch (speed) {
        case "fast": return 30;
        case "medium": return 50;
        case "slow": return 70;
        default: return 50;
      }
    } else {
      switch (speed) {
        case "fast": return 60;
        case "medium": return 100;
        case "slow": return 140;
        default: return 100;
      }
    }
  };

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[currentWordIndex % words.length];
    const speed = getSpeed(isDeleting ? deletingSpeed : typingSpeed, isDeleting);

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Finished typing word, wait before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting backward
        if (currentText.length > 0) {
          setCurrentText(currentWord.slice(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={cn("inline-block", className)}>
      {currentText}
      <span className="animate-pulse ml-0.5 opacity-70">|</span>
    </span>
  );
};

export default TypeAnimation;
