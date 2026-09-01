import Image from "next/image";
import { cn } from "@/lib/utils";

export function NoviaMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative block h-10 w-30 overflow-hidden", className)}>
      <Image
        alt="novia"
        className="absolute left-1/2 top-1/2 h-auto w-[190%] max-w-none -translate-x-1/2 -translate-y-1/2"
        height={1080}
        priority
        src="/brand/novia-wordmark.svg"
        width={1080}
      />
    </span>
  );
}
