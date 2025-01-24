"use client";

import { Slider } from "@nextui-org/react";
import { useState } from "react";

export default function HelloMDX() {
  const [opacity, setOpacity] = useState(0);

  return (
    <div className="relative p-6 rounded-xl overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
        style={{
          opacity: 1 - opacity,
        }}
      />
      <div className="relative">
        <h3 className="font-bold mb-3 text-white text-xl">Hello MDX</h3>
        <p className="text-sm text-white/90">
          This is a card component rendered from MDX with interactive
          components.
        </p>
        <div className="mt-6">
          <Slider
            label="Glass Effect"
            step={0.01}
            maxValue={1}
            minValue={0}
            defaultValue={0}
            className="max-w-md"
            classNames={{
              base: "gap-3",
              label: "text-white font-medium",
              value: "text-white/90",
            }}
            onChange={(value) =>
              setOpacity(Array.isArray(value) ? value[0] : value)
            }
          />
        </div>
      </div>
    </div>
  );
}
