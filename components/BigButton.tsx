import Link from "next/link";
import type { ReactNode } from "react";

type BigButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
};

const variants = {
  primary: "bg-[#b42318] text-white hover:bg-[#8a1c14]",
  secondary: "bg-[#0f766e] text-white hover:bg-[#115e59]",
  danger: "bg-[#7f1d1d] text-white hover:bg-[#641717]",
};

export function BigButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
}: BigButtonProps) {
  const classes = `inline-flex min-h-14 w-full items-center justify-center rounded-[1.25rem] px-6 py-4 text-center text-[1rem] font-bold shadow-sm transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {children}
    </button>
  );
}
