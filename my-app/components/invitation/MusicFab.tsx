"use client";

type Props = {
  playing: boolean;
  onToggle: () => void;
};

export function MusicFab({ playing, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-label={playing ? "Tạm dừng nhạc" : "Phát nhạc"}
      onClick={onToggle}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#404A1D] text-white shadow-lg border border-white/10"
    >
      {playing ? (
        <span className="flex items-end gap-[3px] h-5 pb-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="music-bar w-[3px] h-4 bg-white rounded-sm"
              style={{ animationPlayState: "running" }}
            />
          ))}
        </span>
      ) : (
        <span className="flex items-end gap-[3px] h-5 pb-0.5 opacity-80">
          {[0.35, 0.55, 0.4, 0.5].map((h, i) => (
            <span
              key={i}
              className="w-[3px] bg-white rounded-sm"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
