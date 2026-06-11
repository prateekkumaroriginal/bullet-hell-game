import { Trophy } from "lucide-react";
import { STAGE_COMPLETE_STATS } from "@/game/config/screen-ui-config";
import { ResultScreen } from "./ResultScreen";

export const StageCompleteScreen = () => (
  <ResultScreen
    icon={<Trophy className="size-20 fill-zinc-200 text-zinc-100" />}
    stats={STAGE_COMPLETE_STATS}
    subtitle="ALL WAVES CLEARED"
    title="STAGE COMPLETE"
  />
);
