export const GAME_TITLE = "VOID STRIKE";

export const MAIN_MENU_STYLES = {
  SCREEN:
    "relative z-10 flex h-full overflow-hidden",
  BACKGROUND:
    "pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center",
  CONTENT: "relative flex flex-col",
  TITLE: "font-black whitespace-nowrap uppercase",
  MENU: "flex flex-col",
  BUTTON:
    "relative isolate h-[3.625rem] w-full px-6 text-sm font-bold backdrop-blur-sm transition-[color,background-color,border-color,box-shadow,transform] duration-200",
  BUTTON_LABEL: "relative z-10",
  NAVIGATION: "absolute right-8 bottom-8 z-20 flex gap-2",
  NAVIGATION_BUTTON:
    "h-10 min-w-24 rounded-none border bg-slate-950/70 px-4 text-xs font-black tracking-[0.16em] backdrop-blur-sm"
} as const;

export const MAIN_MENU_VARIANTS = [
  {
    ALT: "A starfighter waits in an orbital hangar above a luminous planet",
    SCREEN: "items-center px-[clamp(3rem,8vw,8rem)]",
    CONTENT:
      "w-[min(34rem,44vw)] items-start gap-[clamp(2.5rem,7vh,4.5rem)]",
    TITLE:
      "bg-gradient-to-b from-white via-cyan-50 to-cyan-300 bg-clip-text text-left text-[clamp(4rem,6.5vw,6.5rem)] leading-[0.78] tracking-[-0.075em] text-transparent [filter:drop-shadow(0_0_1.5rem_rgb(34_211_238_/_0.2))]",
    MENU: "w-[min(21rem,30vw)] gap-3",
    BUTTON:
      "justify-start rounded-none border-0 bg-cyan-200/65 tracking-[0.24em] text-cyan-50 [clip-path:polygon(0_0,calc(100%_-_0.75rem)_0,100%_0.75rem,100%_100%,0_100%)] before:pointer-events-none before:absolute before:inset-px before:z-0 before:bg-slate-950/90 before:[clip-path:polygon(0_0,calc(100%_-_0.72rem)_0,100%_0.72rem,100%_100%,0_100%)] hover:translate-x-2 hover:bg-cyan-100 hover:text-white hover:shadow-[0_0_1.75rem_rgb(34_211_238_/_0.2)] hover:before:bg-cyan-950/90 focus:translate-x-2 focus:bg-cyan-100 focus:text-white focus:shadow-[0_0_1.75rem_rgb(34_211_238_/_0.2)] focus:before:bg-cyan-950/90 focus-visible:ring-cyan-300/40 active:translate-x-1",
    NAVIGATION_BUTTON:
      "border-cyan-200/45 text-cyan-50 hover:border-cyan-100 hover:bg-cyan-400/15 focus:border-cyan-100 focus:bg-cyan-400/15"
  },
  {
    ALT: "A shattered neon ring gate hangs above a violet gas giant",
    SCREEN: "items-center justify-end px-[clamp(3rem,8vw,8rem)]",
    CONTENT:
      "w-[min(34rem,42vw)] items-end gap-[clamp(2.25rem,6vh,4rem)]",
    TITLE:
      "bg-gradient-to-r from-fuchsia-300 via-white to-cyan-300 bg-clip-text text-right text-[clamp(3.5rem,5.8vw,5.75rem)] leading-[0.88] tracking-[0.035em] text-transparent [filter:drop-shadow(0_0_1.7rem_rgb(217_70_239_/_0.28))]",
    MENU: "w-[min(22rem,31vw)] gap-2",
    BUTTON:
      "justify-center rounded-sm border-fuchsia-300/35 bg-violet-950/45 tracking-[0.3em] text-fuchsia-50 shadow-[inset_0_0_1.25rem_rgb(217_70_239_/_0.04)] hover:-translate-x-2 hover:border-fuchsia-200/90 hover:bg-fuchsia-400/15 hover:shadow-[0_0_1.6rem_rgb(217_70_239_/_0.22),inset_0_0_1.25rem_rgb(34_211_238_/_0.08)] focus:-translate-x-2 focus:border-fuchsia-200/90 focus:bg-fuchsia-400/15 focus:shadow-[0_0_1.6rem_rgb(217_70_239_/_0.22),inset_0_0_1.25rem_rgb(34_211_238_/_0.08)] focus-visible:ring-fuchsia-300/40 active:-translate-x-1",
    NAVIGATION_BUTTON:
      "border-fuchsia-300/45 text-fuchsia-50 hover:border-fuchsia-200 hover:bg-fuchsia-400/15 focus:border-fuchsia-200 focus:bg-fuchsia-400/15"
  },
  {
    ALT: "A colossal warship crosses an amber eclipse",
    SCREEN: "items-center justify-end px-[clamp(3rem,7vw,7rem)]",
    CONTENT:
      "w-[min(35rem,43vw)] items-end gap-[clamp(2.75rem,7vh,4.75rem)]",
    TITLE:
      "text-right text-[clamp(3.75rem,6vw,6rem)] leading-[0.82] tracking-[-0.045em] text-transparent [-webkit-text-stroke:1px_rgb(253_186_116)] [filter:drop-shadow(0_0_1.4rem_rgb(249_115_22_/_0.3))]",
    MENU: "w-[min(23rem,32vw)] gap-3",
    BUTTON:
      "justify-end rounded-none border-0 bg-orange-300/65 tracking-[0.2em] text-orange-50 [clip-path:polygon(0.7rem_0,100%_0,100%_calc(100%_-_0.7rem),calc(100%_-_0.7rem)_100%,0_100%,0_0.7rem)] before:pointer-events-none before:absolute before:inset-px before:z-0 before:bg-stone-950/90 before:[clip-path:polygon(0.66rem_0,100%_0,100%_calc(100%_-_0.66rem),calc(100%_-_0.66rem)_100%,0_100%,0_0.66rem)] hover:-translate-x-2 hover:bg-orange-200 hover:text-white hover:shadow-[0_0_1.75rem_rgb(249_115_22_/_0.22)] hover:before:bg-orange-950/90 focus:-translate-x-2 focus:bg-orange-200 focus:text-white focus:shadow-[0_0_1.75rem_rgb(249_115_22_/_0.22)] focus:before:bg-orange-950/90 focus-visible:ring-orange-300/40 active:-translate-x-1",
    NAVIGATION_BUTTON:
      "border-orange-300/45 text-orange-50 hover:border-orange-200 hover:bg-orange-400/15 focus:border-orange-200 focus:bg-orange-400/15"
  },
  {
    ALT: "An alien cathedral rises from a fractured ice moon",
    SCREEN: "items-center px-[clamp(3rem,8vw,8rem)]",
    CONTENT:
      "w-[min(34rem,43vw)] items-start gap-[clamp(2.5rem,7vh,4.5rem)]",
    TITLE:
      "text-left text-[clamp(3.8rem,6.2vw,6.2rem)] leading-[0.84] tracking-[-0.055em] text-teal-50 [text-shadow:0_0_1.8rem_rgb(45_212_191_/_0.26),0_0.15rem_0_rgb(6_78_59)]",
    MENU: "w-[min(21rem,30vw)] gap-2",
    BUTTON:
      "justify-start rounded-none border-y-0 border-r-0 border-l-2 border-l-teal-300/55 bg-slate-950/45 tracking-[0.22em] text-teal-50 shadow-none hover:translate-x-2 hover:border-l-emerald-200 hover:bg-teal-400/12 hover:shadow-[0_0_1.5rem_rgb(45_212_191_/_0.16)] focus:translate-x-2 focus:border-l-emerald-200 focus:bg-teal-400/12 focus:shadow-[0_0_1.5rem_rgb(45_212_191_/_0.16)] focus-visible:ring-teal-300/40 active:translate-x-1",
    NAVIGATION_BUTTON:
      "border-teal-300/45 text-teal-50 hover:border-emerald-200 hover:bg-teal-400/15 focus:border-emerald-200 focus:bg-teal-400/15"
  },
  {
    ALT: "A neon orbital elevator climbs through a stormbound megacity",
    SCREEN: "items-center px-[clamp(3rem,7vw,7rem)]",
    CONTENT:
      "w-[min(50rem,58vw)] items-start gap-[clamp(2.5rem,7vh,4.75rem)]",
    TITLE:
      "bg-gradient-to-r from-white via-blue-100 to-rose-300 bg-clip-text text-left text-[clamp(3.5rem,5.6vw,5.6rem)] leading-[0.86] tracking-[0.06em] text-transparent [filter:drop-shadow(0_0_1.6rem_rgb(59_130_246_/_0.24))]",
    MENU: "w-full flex-row gap-2",
    BUTTON:
      "min-w-0 flex-1 justify-center rounded-full border-blue-200/35 bg-slate-950/60 px-4 tracking-[0.16em] text-blue-50 shadow-[inset_0_0_1rem_rgb(59_130_246_/_0.05)] hover:-translate-y-1 hover:border-rose-200/80 hover:bg-blue-500/15 hover:shadow-[0_0_1.5rem_rgb(59_130_246_/_0.2)] focus:-translate-y-1 focus:border-rose-200/80 focus:bg-blue-500/15 focus:shadow-[0_0_1.5rem_rgb(59_130_246_/_0.2)] focus-visible:ring-blue-300/40 active:translate-y-0",
    NAVIGATION_BUTTON:
      "border-blue-300/45 text-blue-50 hover:border-rose-200 hover:bg-blue-400/15 focus:border-rose-200 focus:bg-blue-400/15"
  },
  {
    ALT: "A strike fleet enters a crimson black-hole graveyard",
    SCREEN: "items-center justify-center px-[clamp(3rem,7vw,7rem)]",
    CONTENT:
      "w-[min(40rem,52vw)] items-center gap-[clamp(2rem,5vh,3.5rem)]",
    TITLE:
      "text-center text-[clamp(4rem,6.8vw,6.8rem)] leading-[0.8] tracking-[-0.06em] text-red-50 [text-shadow:0_0_0.15rem_rgb(255_255_255_/_0.65),0_0_2rem_rgb(220_38_38_/_0.34)]",
    MENU: "w-[min(26rem,36vw)] gap-2",
    BUTTON:
      "justify-center rounded-none border-x-0 border-y border-red-300/30 bg-black/55 tracking-[0.28em] text-red-50 shadow-none hover:scale-[1.025] hover:border-red-200/85 hover:bg-red-500/15 hover:shadow-[0_0_1.8rem_rgb(220_38_38_/_0.18)] focus:scale-[1.025] focus:border-red-200/85 focus:bg-red-500/15 focus:shadow-[0_0_1.8rem_rgb(220_38_38_/_0.18)] focus-visible:ring-red-300/40 active:scale-100",
    NAVIGATION_BUTTON:
      "border-red-300/45 text-red-50 hover:border-red-200 hover:bg-red-500/15 focus:border-red-200 focus:bg-red-500/15"
  }
] as const;

export const MAIN_MENU_INITIAL_VARIANT_INDEX = 0;
export const MAIN_MENU_VARIANT_DIRECTION = {
  PREVIOUS: -1,
  NEXT: 1
} as const;

export const SCREEN_BACKDROP = {
  Z_INDEX: 20,
  BORDER_OPACITY: 0.5,
  RADIAL_CENTER: {
    x: "50%",
    y: "42%",
  },
  RADIAL_OPACITY: 0.12,
  RADIAL_FADE_STOP: "34%",
  GRADIENT_OPACITY_TOP: 0.82,
  GRADIENT_OPACITY_BOTTOM: 0.94,
  GRID_SMALL_SIZE: 42,
  GRID_LARGE_SIZE: 168,
  GRID_OPACITY_DIM: 0.05,
  GRID_OPACITY_BRIGHT: 0.075,
  SHADOW_BLUR: 140,
  SHADOW_OPACITY: 0.92,
} as const;

export const SAVE_ERROR_DIALOG = {
  CORRUPTED_ACTIVE_RUN_MESSAGE: "Saved run could not be loaded.",
} as const;

export const getGameOverStats = (currentWave: number, totalWaves: number) =>
  [["WAVES REACHED", `${currentWave}/${totalWaves}`]] as const;

export const getStageCompleteStats = (totalWaves: number) =>
  [
    ["STAGE CLEAR", "100%"],
    ["WAVES CLEARED", `${totalWaves}/${totalWaves}`],
  ] as const;
