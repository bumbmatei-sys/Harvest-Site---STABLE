import React from "react";
import { BORDER, GOLD_BTN } from "../../utils/course.constants";

interface ProgressBarProps {
  pct: number;
  height?: number;
}

export function ProgressBar({ pct, height = 5 }: ProgressBarProps) {
  return (
    <div style={{ background: BORDER, borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: GOLD_BTN, borderRadius: 99, transition: "width 0.4s" }} />
    </div>
  );
}
