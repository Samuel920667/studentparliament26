// src/components/ui/Button.tsx
import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "navy"
  | "outline"
  | "outline-dark"
  | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    external?: undefined;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--blue)] text-white border-[var(--foreground)] shadow-[4px_4px_0px_0px_#111827] hover:bg-[var(--blue-hover)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_0px_#111827] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111827]",
  navy:
    "bg-[var(--navy)] text-white border-[var(--foreground)] shadow-[4px_4px_0px_0px_#111827] hover:bg-[var(--navy-deep)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_0px_#111827] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111827]",
  outline:
    "bg-[var(--white)] text-[var(--foreground)] border-[var(--foreground)] shadow-[3px_3px_0px_0px_#111827] hover:bg-[var(--navy)] hover:text-white hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#111827]",
  "outline-dark":
    "bg-transparent text-white border-white/80 shadow-[3px_3px_0px_0px_#2563EB] hover:bg-white hover:text-[var(--navy-deep)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#2563EB]",
  ghost:
    "bg-transparent text-[var(--navy)] border-transparent hover:border-[var(--navy)] hover:bg-[var(--white)]/70",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs tracking-wider",
  md: "px-5 py-3 text-sm tracking-wide",
  lg: "px-7 py-4 text-sm sm:text-base tracking-wider",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    children,
    ...elementProps
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2.5",
    "rounded-[2px] border-[1.5px] font-display font-semibold uppercase",
    "transition-[transform,box-shadow,background-color,color,border-color] duration-150",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer select-none whitespace-normal text-center max-w-full min-w-0 [&_svg]:shrink-0",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );

  if (typeof elementProps.href === "string") {
    const {
      href,
      external,
      ...anchorProps
    } = elementProps;

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const {
    type = "button",
    ...buttonProps
  } = elementProps;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
