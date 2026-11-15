import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";
interface Account {
  user: User | null;
  loading: boolean;
  error: string;
  retry: () => void;
  signOut: () => Promise<void>;
}
export const AccountContext = createContext<Account>({
  user: null,
  loading: false,
  error: "",
  retry() {},
  async signOut() {},
});
export const useAccount = () => useContext(AccountContext);
