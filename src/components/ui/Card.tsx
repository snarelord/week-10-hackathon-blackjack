import type React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return <div className={`bg-[#0a4d2e] rounded-lg shadow-lg p-6 text-white ${className}`}>{children}</div>;
};

export default Card;
