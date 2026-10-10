import React from 'react';

interface BrandLogoProps {
  className?: string; // Container className (e.g. for sizing: w-12 h-12)
  src?: string;       // Optional custom source, defaults to CU logo
  alt?: string;
  imageClassName?: string;
}

export function BrandLogo({ 
  className = "w-12 h-12", 
  src = "/cu-logo.png",
  alt = "University Logo",
  imageClassName = ""
}: BrandLogoProps) {
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain object-center ${imageClassName}`}
      />
    </div>
  );
}
