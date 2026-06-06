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
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "border border-blue-500 text-blue-500 hover:bg-blue-50";

  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center rounded px-5 text-b1 transition-colors ${variantClass} ${className}`}
      {...props}
    />
  );
}
