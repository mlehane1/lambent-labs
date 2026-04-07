import { useState, useEffect } from "react";

const THEMES = {
  dark: {
    label: "Dark",
    emoji: "🌙",
    vars: {
      "--bg-deep": "#020814",
      "--bg-dark": "#041128",
      "--bg-card": "#071C4D",
      "--bg-card2": "#0A2C65",
      "--border": "#0C3479",
      "--border-mid": "#1046A2",
      "--primary": "#1558CB",
      "--primary-lt": "#2A70E9",
      "--primary-llt": "#588FEE",
      "--accent": "#15CB88",
      "--accent-dim": "#0e8a5c",
      "--text-hi": "#E7EEF9",
      "--text-mid": "#8AABE5",
      "--text-lo": "#4379D5",
    },
  },
  light: {
    label: "Light",
    emoji: "☀️",
    vars: {
      "--bg-deep": "#F5F7FA",
      "--bg-dark": "#EBEEF3",
      "--bg-card": "#FFFFFF",
      "--bg-card2": "#F0F2F5",
      "--border": "#D0D5DD",
      "--border-mid": "#98A2B3",
      "--primary": "#1558CB",
      "--primary-lt": "#2A70E9",
      "--primary-llt": "#588FEE",
      "--accent": "#0D9B63",
      "--accent-dim": "#0B7A4E",
      "--text-hi": "#101828",
      "--text-mid": "#475467",
      "--text-lo": "#98A2B3",
    },
  },
  midnight: {
    label: "Midnight",
    emoji: "🔮",
    vars: {
      "--bg-deep": "#0D0221",
      "--bg-dark": "#150538",
      "--bg-card": "#1A0A4E",
      "--bg-card2": "#251566",
      "--border": "#3D2080",
      "--border-mid": "#5A35A8",
      "--primary": "#7C3AED",
      "--primary-lt": "#8B5CF6",
      "--primary-llt": "#A78BFA",
      "--accent": "#C084FC",
      "--accent-dim": "#9333EA",
      "--text-hi": "#F3E8FF",
      "--text-mid": "#C4B5FD",
      "--text-lo": "#7C3AED",
    },
  },
  sunset: {
    label: "Sunset",
    emoji: "🌅",
    vars: {
      "--bg-deep": "#1A0A0A",
      "--bg-dark": "#2D1212",
      "--bg-card": "#3D1A1A",
      "--bg-card2": "#4A2020",
      "--border": "#6B2E2E",
      "--border-mid": "#8B4040",
      "--primary": "#DC2626",
      "--primary-lt": "#EF4444",
      "--primary-llt": "#F87171",
      "--accent": "#F59E0B",
      "--accent-dim": "#D97706",
      "--text-hi": "#FEF2F2",
      "--text-mid": "#FCA5A5",
      "--text-lo": "#B91C1C",
    },
  },
  nature: {
    label: "Nature",
    emoji: "🌿",
    vars: {
      "--bg-deep": "#071209",
      "--bg-dark": "#0C1F10",
      "--bg-card": "#132E18",
      "--bg-card2": "#1A3D22",
      "--border": "#265530",
      "--border-mid": "#348442",
      "--primary": "#16A34A",
      "--primary-lt": "#22C55E",
      "--primary-llt": "#4ADE80",
      "--accent": "#A3E635",
      "--accent-dim": "#84CC16",
      "--text-hi": "#ECFDF5",
      "--text-mid": "#86EFAC",
      "--text-lo": "#22C55E",
    },
  },
  retro: {
    label: "Retro",
    emoji: "🕹️",
    vars: {
      "--bg-deep": "#0A0A0A",
      "--bg-dark": "#141414",
      "--bg-card": "#1E1E1E",
      "--bg-card2": "#282828",
      "--border": "#FF00FF33",
      "--border-mid": "#FF00FF66",
      "--primary": "#FF00FF",
      "--primary-lt": "#FF44FF",
      "--primary-llt": "#FF88FF",
      "--accent": "#00FFFF",
      "--accent-dim": "#00CCCC",
      "--text-hi": "#FFFFFF",
      "--text-mid": "#FF88FF",
      "--text-lo": "#FF00FF88",
    },
  },
  ocean: {
    label: "Ocean",
    emoji: "🌊",
    vars: {
      "--bg-deep": "#0A1628",
      "--bg-dark": "#0E2040",
      "--bg-card": "#132D55",
      "--bg-card2": "#183A6A",
      "--border": "#1E4F8E",
      "--border-mid": "#2A6BB5",
      "--primary": "#0EA5E9",
      "--primary-lt": "#38BDF8",
      "--primary-llt": "#7DD3FC",
      "--accent": "#06B6D4",
      "--accent-dim": "#0891B2",
      "--text-hi": "#F0F9FF",
      "--text-mid": "#7DD3FC",
      "--text-lo": "#0EA5E9",
    },
  },
};

const CUSTOM_FIELDS = [
  { key: "--bg-deep", label: "Background" },
  { key: "--bg-card", label: "Card BG" },
  { key: "--border", label: "Borders" },
  { key: "--primary", label: "Primary" },
  { key: "--accent", label: "Accent" },
  { key: "--text-hi", label: "Text" },
  { key: "--text-mid", label: "Text Dim" },
];

function applyTheme(vars) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

function clearTheme() {
  const root = document.documentElement;
  Object.keys(THEMES.dark.vars).forEach((k) => root.style.removeProperty(k));
}

function getSaved() {
  try {
    return JSON.parse(localStorage.getItem("dib-theme")) || null;
  } catch {
    return null;
  }
}

function saveTheme(name, customVars) {
  localStorage.setItem(
    "dib-theme",
    JSON.stringify({ name, customVars: customVars || null })
  );
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("dark");
  const [customPanel, setCustomPanel] = useState(false);
  const [customVars, setCustomVars] = useState({ ...THEMES.dark.vars });

  // Load saved theme on mount
  useEffect(() => {
    const saved = getSaved();
    if (saved) {
      if (saved.name === "custom" && saved.customVars) {
        setCustomVars(saved.customVars);
        applyTheme(saved.customVars);
        setCurrent("custom");
      } else if (THEMES[saved.name]) {
        applyTheme(THEMES[saved.name].vars);
        setCurrent(saved.name);
      }
    }
  }, []);

  function selectTheme(name) {
    if (name === "dark") {
      clearTheme();
    } else {
      applyTheme(THEMES[name].vars);
    }
    setCurrent(name);
    setCustomPanel(false);
    saveTheme(name);
  }

  function updateCustomVar(key, value) {
    const updated = { ...customVars, [key]: value };
    // Auto-derive related vars
    if (key === "--bg-deep") {
      updated["--bg-dark"] = lighten(value, 15);
      updated["--bg-card"] = lighten(value, 30);
      updated["--bg-card2"] = lighten(value, 40);
    }
    if (key === "--primary") {
      updated["--primary-lt"] = lighten(value, 20);
      updated["--primary-llt"] = lighten(value, 40);
    }
    if (key === "--accent") {
      updated["--accent-dim"] = darken(value, 20);
    }
    if (key === "--text-hi") {
      updated["--text-lo"] = mixColor(value, updated["--bg-deep"], 0.4);
    }
    if (key === "--border") {
      updated["--border-mid"] = lighten(value, 20);
    }
    setCustomVars(updated);
    applyTheme(updated);
    setCurrent("custom");
    saveTheme("custom", updated);
  }

  const fab = {
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 9999,
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    transition: "transform 0.2s",
    transform: open ? "rotate(30deg)" : "none",
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={fab} title="Change theme">
        🎨
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => { setOpen(false); setCustomPanel(false); }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.3)",
        }}
      />

      {/* Theme panel */}
      <div
        style={{
          position: "fixed",
          bottom: 72,
          right: 20,
          zIndex: 9999,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
          width: customPanel ? 300 : 240,
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          transition: "width 0.2s",
        }}
      >
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "var(--text-hi)",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{customPanel ? "Custom Theme" : "Choose a Theme"}</span>
          {customPanel && (
            <button
              onClick={() => setCustomPanel(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-mid)",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Back
            </button>
          )}
        </div>

        {!customPanel ? (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 8,
              }}
            >
              {Object.entries(THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => selectTheme(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border:
                      current === key
                        ? "2px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      current === key
                        ? "rgba(21,203,136,0.08)"
                        : "var(--bg-deep)",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    color: "var(--text-hi)",
                    fontWeight: current === key ? 600 : 400,
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>{theme.emoji}</span>
                  {theme.label}
                </button>
              ))}
            </div>

            {/* Custom button */}
            <button
              onClick={() => {
                setCustomPanel(true);
                setCustomVars(
                  current !== "custom" && THEMES[current]
                    ? { ...THEMES[current].vars }
                    : customVars
                );
              }}
              style={{
                width: "100%",
                marginTop: 8,
                padding: "10px",
                borderRadius: 8,
                border:
                  current === "custom"
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border)",
                background:
                  current === "custom"
                    ? "rgba(21,203,136,0.08)"
                    : "var(--bg-deep)",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "var(--text-hi)",
                fontWeight: current === "custom" ? 600 : 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: "1rem" }}>🎛️</span>
              Custom
            </button>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CUSTOM_FIELDS.map((field) => (
              <div
                key={field.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <input
                  type="color"
                  value={customVars[field.key] || "#000000"}
                  onChange={(e) => updateCustomVar(field.key, e.target.value)}
                  style={{
                    width: 32,
                    height: 32,
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: 2,
                    background: "var(--bg-deep)",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--text-mid)",
                    flex: 1,
                  }}
                >
                  {field.label}
                </span>
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.7rem",
                    color: "var(--text-lo)",
                  }}
                >
                  {customVars[field.key]?.toUpperCase()}
                </span>
              </div>
            ))}
            <button
              onClick={() => {
                selectTheme("dark");
                setCustomPanel(false);
              }}
              style={{
                padding: "8px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.75rem",
                color: "var(--text-mid)",
                marginTop: 4,
              }}
            >
              Reset to Default
            </button>
          </div>
        )}
      </div>

      <button onClick={() => setOpen(true)} style={fab}>
        🎨
      </button>
    </>
  );
}

// Color utility helpers
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function lighten(hex, amount) {
  try {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(h, s, Math.min(100, l + amount));
  } catch { return hex; }
}

function darken(hex, amount) {
  try {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex(h, s, Math.max(0, l - amount));
  } catch { return hex; }
}

function mixColor(hex1, hex2, ratio) {
  try {
    const r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
    const r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio).toString(16).padStart(2, "0");
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio).toString(16).padStart(2, "0");
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  } catch { return hex1; }
}
