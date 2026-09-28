"use client";

type Props = {
  playing: boolean;
  onToggle: () => void;
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden
      className={filled ? "fill-white" : "fill-none stroke-white stroke-[1.75]"}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

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
        <HeartIcon filled />
      )}
    </button>
  );
}
