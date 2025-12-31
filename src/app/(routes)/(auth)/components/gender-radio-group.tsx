import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const options = [
  { id: "male", label: "Male", value: false },
  { id: "female", label: "Female", value: true },
];

export function GenderRadioGroup({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <RadioGroup
      value={String(value)}
      onValueChange={(val) => onChange(val === "true")}
      className="grid grid-cols-2 gap-3"
    >
      {options.map((opt) => (
        <div
          key={opt.id}
          className={cn(
            "mt-2 flex items-center space-x-2 rounded-xl px-4 py-3 border-2 transition-all duration-300 cursor-pointer",
            value === opt.value
              ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-red-200 dark:hover:border-red-900/50",
          )}
        >
          <RadioGroupItem
            id={opt.id}
            value={String(opt.value)}
            className="peer sr-only"
          />
          <Label
            htmlFor={opt.id}
            className="mx-auto flex w-full cursor-pointer items-center justify-center text-sm font-medium transition-all duration-300"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
