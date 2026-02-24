"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/warcraftcn/checkbox";

export function CheckboxGroup({
  faction,
}: {
  faction: "default" | "human" | "orc" | "elf" | "undead";
}) {
  const [cooldowns, setCooldowns] = useState(true);
  const [minimap, setMinimap] = useState(false);
  const [health, setHealth] = useState(true);

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        checked={cooldowns}
        faction={faction}
        label="Show Cooldowns"
        onChange={(e) => setCooldowns(e.target.checked)}
      />
      <Checkbox
        checked={minimap}
        faction={faction}
        label="Enable Minimap"
        onChange={(e) => setMinimap(e.target.checked)}
      />
      <Checkbox
        checked={health}
        faction={faction}
        label="Display Health Bars"
        onChange={(e) => setHealth(e.target.checked)}
      />
    </div>
  );
}
