import { useEffect, useRef } from "react";
import { Info, X } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  ENEMY_POPUP_ID_BY_TYPE,
  POPUP_TOAST_DURATION_MS,
  SKILL_POPUP_ID_BY_SKILL
} from "@/game/config/popup-config";
import {
  GAMEPLAY_EVENTS,
  onGameplayEvent
} from "@/game/events/gameplay-events";
import {
  completePopupDismissal,
  dismissActivePopup,
  showPopupOnce
} from "@/game/state/popup-ui-service";
import { useGameUiStore } from "@/game/state/use-game-ui-store";

const TOAST_PRUNE_INTERVAL_MS = 500;
const POPUP_MODAL_ENTRANCE_CLASS = "tutorial-popup-modal-enter";
const POPUP_MODAL_OVERLAY_CLASS = "tutorial-popup-modal-overlay";
const POPUP_TOAST_ENTRANCE_CLASS = "tutorial-popup-toast-enter";
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

export const Popups = () => {
  const activeModal = useGameUiStore((state) => state.popups.activeModal);
  const toasts = useGameUiStore((state) => state.popups.toasts);
  const renderedModalRef = useRef(activeModal);
  const shownToastIds = useRef(new Set<string>());
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

  useEffect(() => {
    const removeEnemyIntroReadyListener = onGameplayEvent(
      GAMEPLAY_EVENTS.ENEMY_INTRO_READY,
      ({ enemyTypeId }) => {
        showPopupOnce(ENEMY_POPUP_ID_BY_TYPE[enemyTypeId]);
      }
    );
    const removeSkillAcquiredListener = onGameplayEvent(
      GAMEPLAY_EVENTS.SKILL_ACQUIRED,
      ({ skillId }) => {
        showPopupOnce(SKILL_POPUP_ID_BY_SKILL[skillId]);
      }
    );

    return () => {
      removeEnemyIntroReadyListener();
      removeSkillAcquiredListener();
    };
  }, []);

  useEffect(() => {
    const nextToastIds = new Set<string>(toasts.map((toast) => toast.id));

    shownToastIds.current.forEach((toastId) => {
      if (!nextToastIds.has(toastId)) {
        sonnerToast.dismiss(toastId);
        shownToastIds.current.delete(toastId);
      }
    });

    toasts.forEach((popupToast) => {
      if (shownToastIds.current.has(popupToast.id)) {
        return;
      }

      shownToastIds.current.add(popupToast.id);
      sonnerToast.custom(
        () => (
          <div className={`${POPUP_TOAST_ENTRANCE_CLASS} pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] gap-3 rounded-2xl border border-white/15 bg-zinc-950/92 p-4 text-white shadow-xl backdrop-blur-[2px]`}>
            <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/8 text-amber-100">
              <Info className="size-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-amber-200">
                {popupToast.eyebrow}
              </div>
              <h3 className="text-base font-black uppercase leading-tight tracking-wide">
                {popupToast.title}
              </h3>
              <p className="text-sm leading-6 text-zinc-200">
                {popupToast.body}
              </p>
            </div>
            <Button
              aria-label={`Dismiss ${popupToast.title}`}
              className="size-8 shrink-0 rounded-none p-0 text-zinc-400 hover:text-white"
              onClick={() => {
                useGameUiStore.getState().dismissPopup(popupToast.id);
                sonnerToast.dismiss(popupToast.id);
              }}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        ),
        {
          duration: Infinity,
          id: popupToast.id
        }
      );
    });

  }, [toasts]);

  useEffect(
    () => () => {
      shownToastIds.current.forEach((toastId) => {
        sonnerToast.dismiss(toastId);
      });
      shownToastIds.current.clear();
    },
    []
  );

  useEffect(() => {
    if (
      activeModal !== null ||
      !renderedModalRef.current ||
      !window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches
    ) {
      return;
    }

    completePopupDismissal();
  }, [activeModal]);

  if (activeModal) {
    renderedModalRef.current = activeModal;
  }

  const renderedModal = renderedModalRef.current;

  if (!renderedModal && toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-30 text-white">
      <Dialog
        open={activeModal !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            dismissActivePopup();
          }
        }}
      >
        {renderedModal && (
          <DialogContent
            className={`${POPUP_MODAL_ENTRANCE_CLASS} !left-[50vw] !top-[50vh] !w-[min(58rem,calc(100vw-4rem))] !max-w-none !translate-x-[-50%] !translate-y-[-50%] flex min-h-[30rem] flex-col justify-between gap-10 rounded-[2rem] border border-white/15 bg-zinc-950/95 p-10 text-white shadow-2xl max-md:!w-[min(42rem,calc(100vw-2rem))] max-md:min-h-[26rem] max-md:p-7`}
            onAnimationEnd={(event) => {
              if (
                event.target !== event.currentTarget ||
                activeModal !== null
              ) {
                return;
              }

              completePopupDismissal();
            }}
            overlayClassName={POPUP_MODAL_OVERLAY_CLASS}
            showCloseButton={false}
          >
            <div className="flex items-start gap-8 max-md:flex-col max-md:gap-5">
              <div className="grid size-20 shrink-0 place-items-center rounded-3xl border border-white/15 bg-white/8 text-cyan-100 max-md:size-16">
                <Info className="size-8 max-md:size-7" />
              </div>
              <DialogHeader className="min-w-0 flex-1 gap-6 text-left">
                <div className="text-base font-black uppercase tracking-[0.24em] text-cyan-200 max-md:text-sm">
                  {renderedModal.eyebrow}
                </div>
                <DialogTitle className="text-7xl font-black uppercase leading-none tracking-wide text-white max-md:text-4xl">
                  {renderedModal.title}
                </DialogTitle>
                <DialogDescription className="max-w-[44rem] text-2xl leading-10 text-zinc-200 max-md:text-lg max-md:leading-8">
                  {renderedModal.body}
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex justify-end pt-2">
              <DialogClose asChild>
                <Button
                  className="h-14 rounded-2xl border border-white/15 bg-white px-10 font-black uppercase tracking-[0.14em] text-zinc-950 shadow-none hover:bg-zinc-200 focus-visible:ring-white/30"
                  type="button"
                  variant="outline"
                >
                  Continue
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        )}
      </Dialog>

    </div>
  );
};
