import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "md", className = "", children, ...props }, ref) => {
    const baseStyles = "font-bold rounded-md transition-all duration-300 text-center";

    const variantStyles = {
      default:
        "bg-black text-[#ffdb26] hover:bg-[#f4c430] hover:text-black hover:transform hover:-translate-y-1 hover:shadow-md active:transform active:translate-y-0 active:shadow-none",
      outline: "bg-transparent text-[#f4c430] border-2 border-[#f4c430] hover:bg-[#f4c430] hover:text-black",
      secondary: "bg-[#083d24] text-white hover:bg-[#0c5e38]",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const disabledStyles = props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

    const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

    return (
      <button ref={ref} className={buttonStyles} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
