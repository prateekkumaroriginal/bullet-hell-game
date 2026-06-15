import {
  emitGameplayCommand,
  GAMEPLAY_COMMANDS,
} from "@/game/events/gameplay-commands";
import { useGameUiStore } from "@/game/state/use-game-ui-store";
import {
  ScreenButton,
  ScreenCenter,
  ScreenMenuGrid,
  ScreenTitle,
  StageDivider,
} from "./ScreenPrimitives";
import { quitToDesktop } from "./screen-actions";
import { SkillStars } from "./SkillStars";

export const PauseMenuScreen = () => {
  const wave = useGameUiStore((state) => state.wave);
  const learnedSkills = useGameUiStore((state) => state.learnedSkills);

  return (
    <ScreenCenter>
      <div className="flex flex-col items-center gap-9">
        <div className="flex flex-col items-center gap-7">
          <div className="flex flex-col items-center gap-5">
            <ScreenTitle>PAUSED</ScreenTitle>
            <StageDivider label={`WAVE ${wave.current}`} />
          </div>
          <ScreenMenuGrid>
            <ScreenButton
              autoFocus
              onClick={() => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.RESUME_GAME, undefined);
              }}
            >
              RESUME
            </ScreenButton>
            <ScreenButton
              onClick={() => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.RESTART_GAME, undefined);
              }}
            >
              RESTART STAGE
            </ScreenButton>
            <ScreenButton
              onClick={() => {
                emitGameplayCommand(GAMEPLAY_COMMANDS.RETURN_TO_MENU, undefined);
              }}
            >
              MAIN MENU
            </ScreenButton>
            <ScreenButton onClick={quitToDesktop}>
              QUIT TO DESKTOP
            </ScreenButton>
          </ScreenMenuGrid>
        </div>
        <StageDivider label="SKILLS" />
        <div className="grid w-[min(42rem,calc(100vw-3rem))] grid-cols-2 gap-3 max-md:grid-cols-1">
          {learnedSkills.length === 0 ? (
            <div className="col-span-full grid min-h-12 place-items-center border border-zinc-500/25 bg-zinc-950/60 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              No skills selected
            </div>
          ) : (
            learnedSkills.map((skill) => (
              <div
                className="flex items-center justify-between gap-4 border border-cyan-200/25 bg-zinc-950/66 px-4 py-3 text-zinc-100 shadow-[0_0_16px_rgba(45,255,231,0.1)]"
                key={skill.id}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="truncate text-sm font-black uppercase tracking-[0.14em] text-white">
                    {skill.name}
                  </span>
                  <span className="truncate text-xs font-semibold text-cyan-100/80">
                    {skill.summary}
                  </span>
                </div>
                <SkillStars className="shrink-0" stackCount={skill.stackCount} />
              </div>
            ))
          )}
        </div>
      </div>
    </ScreenCenter>
  );
};
