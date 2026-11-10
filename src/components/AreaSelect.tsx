"use client";

import { AREA_GROUPS, OTHER_AREA_OPTION } from "@/lib/areas";

const field =
  "w-full rounded-md border border-grey-line bg-white px-4 py-3.5 text-ink focus:border-primary focus:outline-none";

export function AreaSelect({
  area,
  onAreaChange,
  otherArea,
  onOtherAreaChange,
  error,
  otherError,
}: {
  area: string;
  onAreaChange: (value: string) => void;
  otherArea: string;
  onOtherAreaChange: (value: string) => void;
  error?: string;
  otherError?: string;
}) {
  return (
    <div className="space-y-2">
      <div>
        <select
          aria-label="Your Area"
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          className={field}
        >
          <option value="">Your Area</option>
          {AREA_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.areas.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </optgroup>
          ))}
          <option value={OTHER_AREA_OPTION}>{OTHER_AREA_OPTION}</option>
        </select>
        {error && <p className="mt-1 text-sm text-primary">{error}</p>}
      </div>
      {area === OTHER_AREA_OPTION && (
        <div>
          <input
            type="text"
            aria-label="Please specify your area"
            placeholder="Please specify your area"
            value={otherArea}
            onChange={(e) => onOtherAreaChange(e.target.value)}
            className={field}
          />
          {otherError && <p className="mt-1 text-sm text-primary">{otherError}</p>}
        </div>
      )}
    </div>
  );
}
