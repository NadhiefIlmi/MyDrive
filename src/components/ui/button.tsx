import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
  secondary: "bg-card text-card-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-muted",
  icon: "size-11 bg-card text-card-foreground shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
};

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-ui border-2 border-ink px-4 py-2.5 font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}