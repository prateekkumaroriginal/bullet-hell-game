import { useEffect } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS
} from "@/game/events/gameplay-commands";
import { POPUP_TOAST_DURATION_MS } from "@/game/config/popup-config";
import { useGameUiStore } from "@/game/state/use-game-ui-store";

const TOAST_PRUNE_INTERVAL_MS = 500;

export const Popups = () => {
  const activeModal = useGameUiStore((state) => state.popups.activeModal);
  const toasts = useGameUiStore((state) => state.popups.toasts);
  const prunePopupToasts = useGameUiStore(
    (state) => state.prunePopupToasts
  );

  useEffect(() => {
    const pruneToasts = () => {
      prunePopupToasts(Date.now(), POPUP_TOAST_DURATION_MS);
    };

    pruneToasts();
    const pruneInterval = window.setInterval(
      pruneToasts,
      TOAST_PRUNE_INTERVAL_MS
    );

    return () => {
      window.clearInterval(pruneInterval);
    };
  }, [prunePopupToasts]);

  if (!activeModal && toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 text-white">
      <Dialog
        open={activeModal !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            emitGameplayCommand(GAMEPLAY_COMMANDS.DISMISS_POPUP, undefined);
          }
        }}
      >
        {activeModal && (
          <DialogContent
            className="flex max-w-[min(34rem,calc(100vw-2.5rem))] flex-col gap-5 rounded-none border-cyan-200/45 bg-zinc-950/92 p-6 text-white shadow-[0_0_42px_rgba(45,255,231,0.22),inset_0_0_36px_rgba(45,255,231,0.08)]"
            showCloseButton={false}
          >
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center border border-cyan-300/55 bg-cyan-400/12 text-cyan-200 shadow-[0_0_18px_rgba(45,255,231,0.28)]">
                <Info className="size-5" />
              </div>
              <DialogHeader className="min-w-0 flex-1 text-left">
                <div className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                  {activeModal.eyebrow}
                </div>
                <DialogTitle className="text-3xl font-black uppercase leading-tight tracking-wide text-white max-md:text-2xl">
                  {activeModal.title}
                </DialogTitle>
                <DialogDescription className="text-base leading-7 text-zinc-200">
                  {activeModal.body}
                </DialogDescription>
              </DialogHeader>
            </div>

            <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
              <DialogClose asChild>
                <Button
                  className="rounded-none border border-cyan-200/40 bg-cyan-300 px-5 font-black uppercase tracking-[0.18em] text-zinc-950 shadow-[0_0_18px_rgba(45,255,231,0.34)] hover:bg-white"
                  type="button"
                >
                  Continue
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <section className="absolute bottom-6 right-6 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 max-md:bottom-4 max-md:right-4">
        {toasts.map((toast) => (
          <article
            className="pointer-events-auto flex gap-3 border border-amber-200/35 bg-zinc-950/88 p-4 shadow-[0_0_26px_rgba(255,200,87,0.16),inset_0_0_24px_rgba(255,200,87,0.06)] backdrop-blur-[2px]"
            key={toast.id}
          >
            <div className="grid size-9 shrink-0 place-items-center border border-amber-200/50 bg-amber-300/12 text-amber-200">
              <Info className="size-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-amber-200">
                {toast.eyebrow}
              </div>
              <h3 className="text-base font-black uppercase leading-tight tracking-wide">
                {toast.title}
              </h3>
              <p className="text-sm leading-6 text-zinc-200">{toast.body}</p>
            </div>
            <button
              aria-label={`Dismiss ${toast.title}`}
              className="grid size-8 shrink-0 place-items-center text-zinc-400 transition hover:text-white"
              onClick={() => {
                useGameUiStore.getState().dismissPopup(toast.id);
              }}
              type="button"
            >
              <X className="size-4" />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
};
