import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

const SCROLL_THEMES = {
  default: {
    handleClass: "scroll-handle-default",
    centerBgClass: "scroll-center-default",
  },
  human: {
    handleClass: "scroll-handle-human",
    centerBgClass: "scroll-center-human",
  },
  undead: {
    handleClass: "scroll-handle-undead",
    centerBgClass: "scroll-center-undead",
  },
  orc: {
    handleClass: "scroll-handle-orc",
    centerBgClass: "scroll-center-orc",
  },
  elf: {
    handleClass: "scroll-handle-elf",
    centerBgClass: "scroll-center-elf",
  },
} as const;

const toastTextVariants = cva(
  "w-full h-full flex flex-col items-center justify-center px-2 py-2 text-center font-serif",
  {
    variants: {
      variant: {
        default: "text-[#211306]",
        success: "text-green-900",
        error: "text-red-900",
        warning: "text-yellow-950",
        info: "text-blue-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconVariants = cva(
  "shrink-0 inline mr-1 align-middle",
  {
    variants: {
      variant: {
        default: "text-[#332211]",
        success: "text-green-800",
        error: "text-red-800",
        warning: "text-yellow-900",
        info: "text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const scrollTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.8,
};

const VARIANT_ICON = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

type ScrollFaction = keyof typeof SCROLL_THEMES;
type ToastVariant = "default" | "success" | "error" | "warning" | "info";
type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface ScrollToastProps {
  id: string;
  message: string;
  faction?: ScrollFaction;
  variant?: ToastVariant;
}

const ScrollToast: React.FC<ScrollToastProps> = ({
  id,
  message,
  faction = "default",
  variant = "default",
}) => {
  const [phase, setPhase] = useState(0);

  // Memoize theme lookup for consistency/perf
  const theme = useMemo(
    () => SCROLL_THEMES[faction] ?? SCROLL_THEMES.default,
    [faction]
  );
  // Memoize icon for this variant
  const Icon = useMemo(() => {
    if (variant && variant !== "default" && VARIANT_ICON[variant]) {
      return VARIANT_ICON[variant];
    }
    return null;
  }, [variant]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setPhase(1), 600));
    timers.push(setTimeout(() => setPhase(2), 3800));
    timers.push(setTimeout(() => toast.dismiss(id), 4800));
    return () => timers.forEach(clearTimeout);
  }, [id]);

  return (
    <div className={cn("w-[300px] h-28 relative mx-auto pointer-events-auto flex justify-center")}>
      <motion.div className="h-full flex items-center">
        <motion.div
          layout
          transition={scrollTransition}
          className={cn("w-5 h-full z-20 shrink-0", theme.handleClass)}
        />
        <motion.div
          layout
          initial={{ width: 0 }}
          animate={{ width: phase === 1 ? 264 : 0 }}
          transition={scrollTransition}
          className={cn("h-[100px] z-10 overflow-hidden relative shrink-0 -mx-2", theme.centerBgClass)}
        >
          <motion.div
            className={toastTextVariants({ variant })}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{
              opacity: phase === 1 ? 1 : 0,
              scale: phase === 1 ? 1 : 0.95,
              filter: phase === 1 ? "blur(0px)" : "blur(4px)",
            }}
            transition={{
              duration: 0.5,
              delay: phase === 1 ? 0.25 : 0,
              ease: "easeInOut",
            }}
          >
            <div className="flex flex-row items-center justify-center gap-1 w-full">
              {Icon && (
                <Icon
                  size={18}
                  className={iconVariants({ variant })}
                  aria-hidden="true"
                />
              )}
              <span className="text-xs truncate leading-snug fantasy align-middle">
                {message}
              </span>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          layout
          transition={scrollTransition}
          className={cn("w-5 h-full z-20 shrink-0", theme.handleClass, "scroll-handle-flip")}
        />
      </motion.div>
    </div>
  );
};

type TriggerOptions = {
  message?: string;
  faction?: ScrollFaction;
  position?: ToastPosition;
  variant?: ToastVariant;
};

const triggerScrollToast = ({
  message = "",
  faction,
  position = "top-center",
  variant = "default",
}: TriggerOptions = {}) => {
  toast.custom(
    (id) => (
      <ScrollToast
        id={id as string}
        message={message}
        faction={faction}
        variant={variant}
      />
    ),
    {
      duration: Infinity,
      position,
    }
  );
};

export { triggerScrollToast };