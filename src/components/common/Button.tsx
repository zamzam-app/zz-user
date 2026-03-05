import Link from "next/link";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "primary" | "outline";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  fullWidth = false,
  variant = "primary",
  className = "",
}) => {
  const baseStyles = `
    inline-block
    ${fullWidth ? "w-full" : ""}
    py-3
    px-10
    rounded-2xl
    font-['Epilogue']
    text-lg
    font-bold
    text-center
    shadow-2xl
    transition-all duration-300 ease-in-out
    cursor-pointer
    active:scale-95
  `;

  const variants = {
    primary: `
      bg-[#923a3a]
      text-[#FDF5E6]!
      hover:bg-white
      hover:text-[#923a3a]!
      hover:-translate-y-2
    `,
    outline: `
      border-2 border-[#923a3a]
      text-[#923a3a]!
      bg-white
      hover:bg-[#923a3a]
      hover:text-white!
      hover:-translate-y-2
    `,
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={finalClass}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={finalClass}>
      {children}
    </button>
  );
};

export default Button;