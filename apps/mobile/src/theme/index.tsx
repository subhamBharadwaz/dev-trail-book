import {
  createContext,
  useEffect,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import {
  Appearance,
  Platform,
  useColorScheme,
  type TextStyle,
} from "react-native";
import { storage } from "@/lib/storage";
export const palettes = {
  light: {
    background: "#F7F5EF",
    surface: "#FFFEFA",
    text: "#292A36",
    muted: "#626577",
    accent: "#5157B2",
    onAccent: "#FFFFFF",
    tint: "#EAEAF7",
    line: "#DDDCD4",
    success: "#356849",
    successTint: "#E8F0E6",
    danger: "#9F3434",
    code: "#24262F",
    codeText: "#E7E7EF",
  },
  dark: {
    background: "#242321",
    surface: "#2E2D2A",
    text: "#F2EDE3",
    muted: "#B9B4AA",
    accent: "#BCB8F2",
    onAccent: "#292641",
    tint: "#39364B",
    line: "#47443E",
    success: "#AACBA2",
    successTint: "#303E2E",
    danger: "#FFB3AC",
    code: "#1C1C1B",
    codeText: "#E9E4DA",
  },
} as const;
export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  page: 20,
  section: 36,
};
export const radius = { small: 8, medium: 16, large: 24, pill: 999 };
export const type = {
  display: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700",
    letterSpacing: -1,
  },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  heading: { fontSize: 19, lineHeight: 27, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 27 },
  small: { fontSize: 15, lineHeight: 23 },
  label: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
} as const satisfies Record<string, TextStyle>;
type Preference = "system" | "light" | "dark";
function initialPreference(): Preference {
  try {
    const value = storage.getItem("trailbook:mobile:theme");
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}
const ThemeContext = createContext({
  colors: palettes.light as { [K in keyof typeof palettes.light]: string },
  mode: "light" as "light" | "dark",
  preference: "system" as Preference,
  setPreference: (() => {}) as (value: Preference) => void,
});
export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const [preference, set] = useState<Preference>(initialPreference);
  const mode =
    preference === "system"
      ? system === "dark"
        ? "dark"
        : "light"
      : preference;
  useEffect(() => {
    if (Platform.OS !== "web")
      Appearance.setColorScheme(preference === "system" ? "auto" : preference);
  }, [preference]);
  function setPreference(value: Preference) {
    storage.setItem("trailbook:mobile:theme", value);
    set(value);
  }
  return (
    <ThemeContext
      value={{ colors: palettes[mode], mode, preference, setPreference }}
    >
      {children}
    </ThemeContext>
  );
}
export const useTheme = () => useContext(ThemeContext);
