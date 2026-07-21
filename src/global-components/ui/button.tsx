import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "bg-white text-blue-900 hover:bg-blue-100"
      : "bg-[#051b5e] text-white hover:bg-[#0b2a7a]";

  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-b1 transition-colors ${variantClass} ${className}`}
      {...props}
    />
  );
}
