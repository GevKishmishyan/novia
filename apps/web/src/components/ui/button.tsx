import Link from "next/link";
import { type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-forest text-warm-white hover:bg-forest-soft",
        outline: "border border-forest/25 text-forest hover:bg-forest/5",
        light: "bg-warm-white text-forest hover:bg-parchment",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant }), className)} {...props} />;
}
