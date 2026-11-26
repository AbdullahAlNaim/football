import { useHealth } from "../../hooks/useHealth";

export function HealthDot() {
  const { data, isPending, isError } = useHealth();

  let color = "bg-slate-500";
  let label = "Checking…";
  if (isError || data?.database === false) {
    color = "bg-loss";
    label = "Backend offline";
  } else if (data) {
    color = "bg-win";
    label = "Data connected";
  } else if (!isPending) {
    label = "Unknown";
  }

  return (
    <span className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-xs text-slate-300" title={label}>
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}
