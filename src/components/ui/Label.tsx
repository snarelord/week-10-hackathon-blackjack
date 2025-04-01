import type React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ className = "", children, ...props }) => {
  return (
    <label className={`text-[#f4c430] font-medium mb-1 block ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;
