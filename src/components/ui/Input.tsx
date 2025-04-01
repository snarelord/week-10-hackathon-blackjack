import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`px-3 py-2 rounded-md border-none bg-[#f0f0f0] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#f4c430] ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
