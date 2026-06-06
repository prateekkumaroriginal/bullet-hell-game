import { MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";

export const App = () => {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-8 text-foreground">
      <section className="grid max-w-3xl gap-5 rounded-lg border bg-card p-8 text-card-foreground">
        <div className="text-primary" aria-hidden="true">
          <MonitorPlay className="size-12" />
        </div>
        <div className="grid gap-5">
          <p className="text-sm font-medium uppercase text-primary">
            Electron + React renderer ready
          </p>
          <h1 className="text-5xl font-semibold leading-none">
            Bullet Hell Game
          </h1>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            The desktop shell is running. Next iteration can mount Phaser inside
            this renderer without giving the game loop to React.
          </p>
        </div>
        <Button type="button">Ready for Phaser</Button>
      </section>
    </main>
  );
};
