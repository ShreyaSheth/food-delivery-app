import React from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const options = [
    { key: "light", label: "Light" },
    { key: "dark", label: "Dark" },
    { key: "system", label: "System" },
  ];
  return (
    <div className="px-2 py-2">
      <div className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
        Theme
      </div>
      <div className="grid grid-cols-3 gap-2 px-2">
        {options.map((opt) => (
          <Button
            key={opt.key}
            type="button"
            variant={theme === opt.key ? "craveo" : "outline"}
            className="h-8 text-xs cursor-pointer"
            onClick={() => setTheme(opt.key)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
