import Link from 'next/link';
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: 'primary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  fullWidth = false,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseStyles = `
    inline-block
    ${fullWidth ? 'w-full' : ''}
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
    disabled:opacity-60
    disabled:cursor-not-allowed
    disabled:active:scale-100
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

  // When rendering as Link, add !important so colors override antd's anchor styles
  const linkOverrideClass =
    variant === 'primary'
      ? '!bg-[#923a3a] !text-[#FDF5E6] hover:!bg-white hover:!text-[#923a3a]'
      : '!bg-white !text-[#923a3a] !border-[#923a3a] hover:!bg-[#923a3a] hover:!text-white';

  if (href) {
    if (disabled) {
      return (
        <span
          className={`${finalClass} ${linkOverrideClass}`}
          aria-disabled='true'
        >
          {children}
        </span>
      );
    }
    return (
      <Link href={href} className={`${finalClass} ${linkOverrideClass}`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={finalClass} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
