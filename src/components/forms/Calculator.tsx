"use client";

import { useState, type FormEvent } from "react";

const UNITS = ["Meter", "Feet", "Inches"] as const;
type Unit = (typeof UNITS)[number];

const METERS_PER_UNIT: Record<Unit, number> = {
  Meter: 1,
  Feet: 0.3048,
  Inches: 0.0254,
};

const CUBIC_FEET_PER_CUBIC_METER = 35.3147;

const field =
  "w-full rounded-md border border-grey-line bg-white px-4 py-3.5 text-ink placeholder:text-grey-2 focus:border-primary focus:outline-none";

function parsePositive(value: string): number | undefined {
  const n = Number(value);
  return value.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
}

export function Calculator() {
  const [unit, setUnit] = useState<Unit>("Meter");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ m3: number; ft3: number } | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const l = parsePositive(length);
    const w = parsePositive(width);
    const h = parsePositive(height);
    if (!l) nextErrors.length = "Enter a positive length.";
    if (!w) nextErrors.width = "Enter a positive width.";
    if (!h) nextErrors.height = "Enter a positive height.";
    setErrors(nextErrors);
    if (!l || !w || !h) {
      setResult(null);
      return;
    }

    const metersPerUnit = METERS_PER_UNIT[unit];
    const m3 = l * metersPerUnit * (w * metersPerUnit) * (h * metersPerUnit);
    setResult({ m3, ft3: m3 * CUBIC_FEET_PER_CUBIC_METER });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Select Unit:</label>
        <select
          aria-label="Select Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value as Unit)}
          className={field}
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Length:</label>
          <input
            type="number"
            step="any"
            min="0"
            aria-label="Length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className={field}
          />
          {errors.length && <p className="mt-1 text-sm text-primary">{errors.length}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Width:</label>
          <input
            type="number"
            step="any"
            min="0"
            aria-label="Width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className={field}
          />
          {errors.width && <p className="mt-1 text-sm text-primary">{errors.width}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Height:</label>
          <input
            type="number"
            step="any"
            min="0"
            aria-label="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className={field}
          />
          {errors.height && <p className="mt-1 text-sm text-primary">{errors.height}</p>}
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-6 py-3.5 text-xl font-medium text-white transition-colors hover:bg-primary/90 sm:w-auto"
      >
        Calculate Volume
      </button>
      <p className="text-lg font-semibold text-secondary">
        {result
          ? `Volume: ${result.m3.toFixed(2)} m³ (${result.ft3.toFixed(2)} ft³)`
          : "Volume: 0"}
      </p>
    </form>
  );
}
