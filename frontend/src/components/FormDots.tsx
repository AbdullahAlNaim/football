import type { FormResult } from "../api/types";

const styles: Record<FormResult, string> = {
  W: "bg-win text-white",
  D: "bg-draw text-slate-900",
  L: "bg-loss text-white",
};

const labels: Record<FormResult, string> = { W: "Win", D: "Draw", L: "Loss" };

export function FormDots({ form }: { form: FormResult[] }) {
  if (form.length === 0) {
    return <span className="text-sm text-slate-500">–</span>;
  }

  return (
    <div className="flex gap-1.5">
      {form.map((result, i) => (
        <span
          key={i}
          title={labels[result]}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${styles[result]}`}
        >
          {result}
        </span>
      ))}
    </div>
  );
}