import { useEffect, useRef } from "react";
import { Info, X } from "lucide-react";
import { toast as sonnerToast } from "sonner";
import { Button } from "@/components/ui/button";
import { PopupModalContent } from "@/components/game/PopupModalContent";
import {
  Dialog,
  DialogClose,
  DialogContent
} from "@/components/ui/dialog";
import {
  POPUP_MODAL_DISMISSAL_FALLBACK_DELAY_MS,
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

const POPUP_MODAL_ENTRANCE_CLASS = "tutorial-popup-modal-enter";
const POPUP_MODAL_OVERLAY_CLASS = "tutorial-popup-modal-overlay";
const POPUP_TOAST_ENTRANCE_CLASS = "tutorial-popup-toast-enter";
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

export const Popups = () => {
  const activeModal = useGameUiStore((state) => state.popups.activeModal);
  const toasts = useGameUiStore((state) => state.popups.toasts);
  const renderedModalRef = useRef(activeModal);
  const popupDismissalTimeoutRef = useRef<number | null>(null);
  const shownToastIds = useRef(new Set<string>());
  const prunePopupToasts = useGameUiStore(
    (state) => state.prunePopupToasts
  );

  const completeModalDismissal = () => {
    if (popupDismissalTimeoutRef.current !== null) {
      window.clearTimeout(popupDismissalTimeoutRef.current);
      popupDismissalTimeoutRef.current = null;
    }

    completePopupDismissal();
  };

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const currentTimeMs = Date.now();
    const nextExpirationTimeMs = toasts.reduce(
      (earliestExpirationTimeMs, toast) =>
        Math.min(
          earliestExpirationTimeMs,
          toast.shownAtMs + POPUP_TOAST_DURATION_MS
        ),
      Number.POSITIVE_INFINITY
    );
    const pruneTimeout = window.setTimeout(
      () => {
        prunePopupToasts(Date.now(), POPUP_TOAST_DURATION_MS);
      },
      Math.max(0, nextExpirationTimeMs - currentTimeMs)
    );

    return () => {
      window.clearTimeout(pruneTimeout);
    };
  }, [prunePopupToasts, toasts]);

  useEffect(() => {
    const removeSkillAcquiredListener = onGameplayEvent(
      GAMEPLAY_EVENTS.SKILL_ACQUIRED,
      ({ skillId }) => {
        showPopupOnce(SKILL_POPUP_ID_BY_SKILL[skillId]);
      }
    );

    return () => {
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
      !renderedModalRef.current
    ) {
      return;
    }

    if (window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches) {
      completeModalDismissal();
      return;
    }

    popupDismissalTimeoutRef.current = window.setTimeout(
      completeModalDismissal,
      POPUP_MODAL_DISMISSAL_FALLBACK_DELAY_MS
    );

    return () => {
      if (popupDismissalTimeoutRef.current !== null) {
        window.clearTimeout(popupDismissalTimeoutRef.current);
        popupDismissalTimeoutRef.current = null;
      }
    };
  }, [activeModal]);

  if (activeModal) {
    renderedModalRef.current = activeModal;
  }

  const renderedModal = renderedModalRef.current;

  if (!renderedModal) {
    return null;
  }

  return (
    <Dialog
      open={activeModal !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          dismissActivePopup();
        }
      }}
    >
      <DialogContent
        className={`${POPUP_MODAL_ENTRANCE_CLASS} popup-intel-modal !left-[50vw] !top-[50vh] !w-[min(68rem,calc(100vw-4rem))] !max-w-none !translate-x-[-50%] !translate-y-[-50%] flex max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[2rem] border border-cyan-200/15 !bg-transparent bg-[linear-gradient(135deg,rgba(8,15,22,0.98),rgba(9,12,19,0.96))] p-8 text-white shadow-[0_2rem_6rem_rgba(0,0,0,0.72),inset_0_0_4rem_rgba(34,211,238,0.025)] max-md:!w-[min(42rem,calc(100vw-2rem))] max-md:p-5`}
        onAnimationEnd={(event) => {
          if (
            event.target !== event.currentTarget ||
            activeModal !== null
          ) {
            return;
          }

          completeModalDismissal();
        }}
        overlayClassName={POPUP_MODAL_OVERLAY_CLASS}
        showCloseButton={false}
      >
        <PopupModalContent
          footer={
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button
                  className="h-14 rounded-2xl border border-white/15 bg-white px-10 text-base font-black uppercase tracking-[0.14em] text-zinc-950 shadow-none hover:bg-zinc-200 focus-visible:ring-white/30"
                  type="button"
                  variant="outline"
                >
                  Continue
                </Button>
              </DialogClose>
            </div>
          }
          popup={renderedModal}
        />
      </DialogContent>
    </Dialog>
  );
};
