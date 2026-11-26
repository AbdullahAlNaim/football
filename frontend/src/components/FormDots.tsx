import type { FormResult } from "../api/types";

const styles: Record<FormResult, string> = {
  W: "bg-win text-white",
  D: "bg-draw text-slate-900",
  L: "bg-loss text-white",
};

const labels: Record<FormResult, string> = { W: "Win", D: "Draw", L: "Loss" };

const icons: Record<FormResult, string> = { W: "✓", D: "–", L: "✕" };

export function FormDots({ form }: { form: FormResult[] }) {
  if (form.length === 0) {
    return <span className="text-sm text-slate-500">–</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {form.map((result, i) => {
        const latest = i === form.length - 1;
        return (
          <span
            key={i}
            title={latest ? `${labels[result]} (most recent)` : labels[result]}
            aria-label={labels[result]}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${styles[result]} ${
              latest ? "ring-2 ring-white/70 ring-offset-2 ring-offset-card" : ""
            }`}
          >
            {icons[result]}
          </span>
        );
      })}
    </div>
  );
}