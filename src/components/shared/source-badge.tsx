import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  name: string;
  url?: string;
  className?: string;
}

export function SourceBadge({ name, url, className }: SourceBadgeProps) {
  const content = (
    <>
      <span>{name}</span>
      <ExternalLink size={10} className="shrink-0 opacity-50" />
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-1.5 rounded bg-surface px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-muted transition-colors duration-200",
    url && "hover:text-text-secondary",
    className
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return <span className={classes}>{content}</span>;
}
