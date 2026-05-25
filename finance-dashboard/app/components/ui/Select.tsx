"use client";

type Props = {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  optional?: boolean;
};

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  optional,
}: Props) {
  return (
    <label className="block">
      <span className="label flex items-center gap-2">
        {label}
        {optional && (
          <span className="text-[10px] font-medium normal-case text-ink-500/80">
            (opcional)
          </span>
        )}
      </span>
      <select
        className="input mt-1"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
