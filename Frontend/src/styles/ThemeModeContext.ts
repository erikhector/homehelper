import { createContext } from "react";

import type { PaletteMode } from "@mui/material";

export const ThemeModeContext = createContext<{ mode: PaletteMode; toggleMode: () => void }>({
  mode: "dark",
  toggleMode: () => undefined
});
