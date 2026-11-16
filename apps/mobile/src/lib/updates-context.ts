import { createContext, useContext } from "react";
export interface AppUpdateState {
  supported: boolean;
  pending: boolean;
  busy: boolean;
  message: string;
  error: string;
  check(): Promise<void>;
  apply(): Promise<void>;
}
export const UpdateContext = createContext<AppUpdateState>({
  supported: false,
  pending: false,
  busy: false,
  message: "Updates are available in the installed release app.",
  error: "",
  async check() {},
  async apply() {},
});
export const useAppUpdates = () => useContext(UpdateContext);
