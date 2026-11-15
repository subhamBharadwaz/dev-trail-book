import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog";
import { Menu, X } from "lucide-react";
import type { AppRoute } from "@/app/routes";
import { Sidebar } from "./sidebar";
export function MobileNavigation({ route }: { route: AppRoute }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="min-[701px]:hidden grid size-11 place-items-center rounded border-0 bg-transparent text-muted-ink hover:bg-surface-hover hover:text-ink"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </DialogTrigger>
      <DialogContent className="fixed inset-y-0 left-0 m-0 flex h-dvh max-h-none w-[280px] max-w-[90vw] flex-col overflow-y-auto border-0 border-r border-line bg-sidebar-bg px-[17px] pt-[37px] text-ink backdrop:bg-[#18241c65] backdrop:backdrop-blur-[3px]">
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <DialogClose
          className="absolute right-2 top-[7px] grid size-11 place-items-center rounded border-0 bg-transparent text-muted-ink hover:bg-surface-hover hover:text-ink"
          aria-label="Close navigation"
        >
          <X size={20} />
        </DialogClose>
        <Sidebar route={route} onNavigate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
