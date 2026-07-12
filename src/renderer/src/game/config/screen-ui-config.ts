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
    "relative isolate h-[3.625rem] w-full px-6 text-sm font-bold backdrop-blur-sm transition-[color,background-color,border-color,box-shadow,filter,transform] duration-200",
  BUTTON_LABEL: "relative z-10",
  NAVIGATION: "absolute right-8 bottom-8 z-20 flex gap-2",
  NAVIGATION_BUTTON:
    "h-10 min-w-24 rounded-none border bg-slate-950/70 px-4 text-xs font-black tracking-[0.16em] backdrop-blur-sm"
} as const;

export const SPACE_SILVER_DREAM_VARIANT_ID = "space-silver-dream";

export const SPACE_SILVER_DREAM_BORDER = {
  CLASS_NAME:
    "pointer-events-none absolute inset-0 z-[2] size-full overflow-visible",
  VIEW_BOX: "0 0 1000 100",
  POLYGON_POINTS:
    "32,6 818,6 824,11 902,11 908,6 980,6 993,19 993,82 980,94 760,94 752,88 608,88 600,94 18,94 7,83 7,22 11,14 22,6",
  TOP_LEFT_SHINE_PATH: "M 82 6 H 32 L 22 6 L 11 14 L 7 22 V 30",
  BOTTOM_RIGHT_GLOW_PATH: "M 948 94 H 980 L 993 82 V 72",
  GLOW_CLASS_NAME:
    "stroke-cyan-200/15 [filter:drop-shadow(0_0_0.18rem_rgb(103_232_249_/_0.3))] group-focus/button:stroke-white/30 group-hover/button:stroke-white/30",
  STEEL_CLASS_NAME:
    "stroke-slate-700 group-focus/button:stroke-slate-400 group-hover/button:stroke-slate-400",
  SILVER_CLASS_NAME:
    "stroke-slate-500 group-focus/button:stroke-slate-300 group-hover/button:stroke-slate-300",
  TOP_LEFT_SHINE_CLASS_NAME:
    "stroke-slate-200 [filter:drop-shadow(0_0_0.12rem_rgb(203_213_225_/_0.72))] group-focus/button:stroke-white group-focus/button:[filter:drop-shadow(0_0_0.3rem_rgb(255_255_255_/_0.9))] group-hover/button:stroke-white group-hover/button:[filter:drop-shadow(0_0_0.3rem_rgb(255_255_255_/_0.9))]",
  BOTTOM_RIGHT_GLOW_CLASS_NAME:
    "stroke-slate-300 [filter:drop-shadow(0_0_0.14rem_rgb(148_163_184_/_0.76))] group-focus/button:stroke-cyan-100/65 group-hover/button:stroke-cyan-100/65",
  GLOW_COLOR: "rgb(165 243 252 / 0.15)",
  STEEL_COLOR: "#1e293b",
  SILVER_COLOR: "#64748b",
  TOP_LEFT_SHINE_COLOR: "#cbd5e1",
  BOTTOM_RIGHT_GLOW_COLOR: "#94a3b8",
  GLOW_STROKE_WIDTH: 7,
  STEEL_STROKE_WIDTH: 4.5,
  SILVER_STROKE_WIDTH: 2,
  SHINE_STROKE_WIDTH: 2.75
} as const;

export const MAIN_MENU_VARIANTS = [
  {
    ID: "orbital-hangar",
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
    ID: "ring-gate",
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
    ID: "eclipse-warship",
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
    ID: "ice-cathedral",
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
    ID: "orbital-city",
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
    ID: "red-singularity",
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
  },
  {
    ID: SPACE_SILVER_DREAM_VARIANT_ID,
    ALT: "A silver-violet black hole shines above a dark observation deck",
    SCREEN: "items-center px-[clamp(3rem,7vw,7rem)]",
    CONTENT:
      "w-[min(42rem,51vw)] items-start gap-[clamp(2.5rem,6vh,4rem)]",
    TITLE:
      "bg-gradient-to-b from-white via-slate-100 to-cyan-200 bg-clip-text text-left text-[clamp(3.75rem,6vw,6rem)] leading-[0.82] tracking-[0.08em] text-transparent [filter:drop-shadow(0_0_1.8rem_rgb(207_250_254_/_0.24))]",
    MENU: "w-[min(38rem,48vw)] gap-3",
    BUTTON:
      "h-20 justify-start rounded-none border-0 bg-slate-950/55 px-10 text-xl tracking-[0.32em] text-slate-100 [clip-path:polygon(3%_3%,82%_3%,82.6%_8%,90%_8%,90.6%_3%,98.4%_3%,99.7%_17%,99.7%_85%,98.4%_97%,75.8%_97%,75%_91%,61%_91%,60.2%_97%,1.6%_97%,0.3%_84%,0.3%_20%,0.8%_12%,2%_3%)] hover:bg-[linear-gradient(110deg,rgb(226_232_240)_0%,rgb(148_163_184)_34%,rgb(241_245_249)_72%,rgb(100_116_139)_100%)] hover:text-slate-950 hover:shadow-[0_0_1.6rem_rgb(148_163_184_/_0.26)] hover:[&>span]:text-slate-950 focus:bg-[linear-gradient(110deg,rgb(226_232_240)_0%,rgb(148_163_184)_34%,rgb(241_245_249)_72%,rgb(100_116_139)_100%)] focus:text-slate-950 focus:shadow-[0_0_1.6rem_rgb(148_163_184_/_0.26)] focus:[&>span]:text-slate-950 focus-visible:ring-0 active:scale-[0.99]",
    NAVIGATION_BUTTON:
      "border-slate-200/55 text-slate-50 hover:border-white hover:bg-white hover:text-slate-950 focus:border-white focus:bg-white focus:text-slate-950"
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
