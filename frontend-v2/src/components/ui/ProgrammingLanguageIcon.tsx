import React from "react";

export function ProgrammingLanguageIcon({
  language,
  className = "w-4 h-4",
}: {
  language: string;
  className?: string;
}) {
  const getIconUrl = (lang: string) => {
    switch (lang) {
      case "cpp":
      case "c++":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg";
      case "java":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg";
      case "javascript":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg";
      case "python":
      case "python3":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg";
      case "c":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg";
      case "go":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg";
      case "rust":
        // Rust original is black, so let's use plain to ensure it looks okay, or rust-plain.svg
        // But devicon has rust-original.svg
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg";
      case "csharp":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg";
      case "kotlin":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg";
      case "swift":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg";
      case "php":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg";
      case "ruby":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg";
      case "typescript":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg";
      case "scala":
        return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scala/scala-original.svg";
      default:
        return null;
    }
  };

  const url = getIconUrl(language);

  if (url) {
    return (
      <img
        src={url}
        alt={`${language} icon`}
        className={`${className} object-contain`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
