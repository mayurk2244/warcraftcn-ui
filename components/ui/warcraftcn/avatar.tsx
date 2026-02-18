import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import "@/components/ui/warcraftcn/styles/warcraft.css";

const avatarVariants = cva("fantasy relative", {
  variants: {
    faction: {
      default: "wc-avatar-default",
      orc: "wc-avatar-orc",
      elf: "wc-avatar-elf",
      human: "wc-avatar-human",
      undead: "wc-avatar-undead",
    },
    size: {
      sm: "w-24 h-24",
      md: "w-48 h-48",
      lg: "w-96 h-96",
    },
  },
  defaultVariants: {
    faction: "default",
    size: "md",
  },
});

export interface AvatarProps
  extends Omit<React.ComponentProps<"div">, "children">,
  VariantProps<typeof avatarVariants> {
  src?: string; // Avatar image URL
  alt?: string; // Alt text
  fallback?: React.ReactNode; // Fallback if no image
  // size is now sm | md | lg
  faction?: "default" | "orc" | "elf" | "human" | "undead";
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt = "",
  fallback,
  faction = "default",
  size = "md",
  ...props
}) => {
  const frameClasses = avatarVariants({ faction, size });

  return (
    <div
      className={cn("relative", frameClasses, className)}
      {...props}
    >
      <div className="absolute inset-[20%] overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover mt-0 mb-0"
            draggable={false}
          />
        ) : fallback ? (
          <div className="flex items-center justify-center w-full h-full text-2xl select-none">
            {fallback}
          </div>
        ) : null}
      </div>

      <div className="pointer-events-none absolute inset-0 scale-[1.05] wc-avatar-frame" />
    </div>
  );
};

export { avatarVariants };
