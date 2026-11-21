import type { ScoreKey } from "@/domain/breed.schema";
import { SCORE_META } from "./breed-labels";

interface ScoreBarProps {
  criterion: ScoreKey;
  score: number;
  compact?: boolean;
}

export function ScoreBar({ criterion, score, compact = false }: ScoreBarProps) {
  const meta = SCORE_META[criterion];
  const segments = [1, 2, 3, 4, 5];

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={compact ? "text-xs font-semibold text-[#5c4d42]" : "text-sm font-semibold text-[#241b15]"}>
          {meta.label}
        </span>
        <span className={compact ? "text-xs font-bold text-[#241b15]" : "text-sm font-bold text-[#c24115]"}>
          {score}/5
        </span>
      </div>

      <div
        role="img"
        aria-label={`${meta.label} : ${score} sur 5`}
        className="grid grid-cols-5 gap-1.5"
      >
        {segments.map((step) => {
          const filled = step <= score;
          return (
            <span
              key={step}
              className={`rounded-full transition-colors ${compact ? "h-2" : "h-2.5"} ${
                filled ? "bg-[#c24115]" : "bg-[#efe5d7]"
              }`}
            />
          );
        })}
      </div>

      {!compact && (
        <div className="flex justify-between text-[11px] font-medium text-[#7a695c]">
          <span>{meta.lowHint}</span>
          <span>{meta.highHint}</span>
        </div>
      )}
    </div>
  );
}
