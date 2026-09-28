"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PublicWeddingConfig } from "@/lib/config";
import { googleCalendarUrl } from "@/lib/date-utils";
import { colors, headingClassName, layout, type } from "@/lib/theme";
import type { WishEntry } from "@/lib/types";
import { CeremonySection } from "./invitation/CeremonySection";
import { EnvelopeCover } from "./invitation/EnvelopeCover";
import { FloralLayer } from "./invitation/FloralLayer";
import { GalleryCards } from "./invitation/GalleryCards";
import { GiftEnvelopes } from "./invitation/GiftEnvelopes";
import { GiftModal } from "./invitation/GiftModal";
import { GuestbookSection } from "./invitation/GuestbookSection";
import { HeroHeader } from "./invitation/HeroHeader";
import { MusicFab } from "./invitation/MusicFab";
import { PartyCalendarSection } from "./invitation/PartyCalendarSection";
import { PhotoLightbox } from "./invitation/PhotoLightbox";
import { RsvpModal } from "./invitation/RsvpModal";
import { useIdleAutoScroll } from "./invitation/useIdleAutoScroll";
import { useScrollParallax } from "./invitation/useScrollParallax";
import { PartyVenuesSection } from "./invitation/PartyVenuesSection";
import { WeddingTimelineSection } from "./invitation/WeddingTimelineSection";

type Props = {
  config: PublicWeddingConfig;
  guestName?: string;
};

export function InvitationExperience({ config, guestName }: Props) {
  const mainRef = useRef<HTMLDivElement>(null);
  const parallaxA = useScrollParallax(mainRef, 0.35);
  const parallaxB = useScrollParallax(mainRef, -0.2);

  const [coverMounted, setCoverMounted] = useState(true);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [rsvpName, setRsvpName] = useState(guestName ?? "");
  const [rsvpAttending, setRsvpAttending] = useState<boolean | null>(null);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const photos = config.galleryUrls;

  useIdleAutoScroll({
    enabled: !coverMounted,
    paused: lightbox || rsvpOpen || giftOpen,
  });

  const calendarLink = useMemo(
    () =>
      googleCalendarUrl({
        title: `Đám cưới ${config.groomFullName} & ${config.brideFullName}`,
        isoDate: config.weddingDate,
        startTime: config.partyTime,
        endTime: "13:00",
        timezone: config.timezone,
        details: `Tiệc cưới của ${config.groomFullName} & ${config.brideFullName}`,
        location: `Nhà trai: ${config.groomPartyAddress} | Nhà gái: ${config.bridePartyAddress}`,
      }),
    [config],
  );

  const loadWishes = useCallback(async () => {
    const res = await fetch("/api/wishes");
    if (res.ok) {
      const data = (await res.json()) as { wishes: WishEntry[] };
      setWishes(data.wishes);
    }
  }, []);

  useEffect(() => {
    void loadWishes();
  }, [loadWishes]);

  useEffect(() => {
    if (guestName) setRsvpName(guestName);
  }, [guestName]);

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || !config.musicUrl) return;
    void audio
      .play()
      .then(() => setMusicPlaying(true))
      .catch(() => {});
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      void audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  };

  const submitRsvp = async () => {
    if (!rsvpName.trim() || rsvpAttending === null) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rsvpName, attending: rsvpAttending }),
      });
      if (res.ok) setRsvpDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  const submitWish = async () => {
    if (!wishName.trim() || !wishMessage.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wishName, message: wishMessage }),
      });
      if (res.ok) {
        setWishName("");
        setWishMessage("");
        await loadWishes();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillSuggestion = () => {
    const list = config.wishSuggestions;
    if (!list.length) return;
    setWishMessage(list[Math.floor(Math.random() * list.length)] ?? "");
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const closeRsvp = () => {
    setRsvpOpen(false);
    setRsvpDone(false);
  };

  return (
    <>
      {config.musicUrl ? (
        <audio ref={audioRef} src={config.musicUrl} loop preload="auto" />
      ) : null}

      {coverMounted && (
        <EnvelopeCover
          groomShort={config.groomShortName}
          brideShort={config.brideShortName}
          weddingDate={config.weddingDate}
          onOpenStart={startMusic}
          onDismiss={() => setCoverMounted(false)}
        />
      )}

      <div className="flex w-full justify-center overflow-x-clip bg-white scrollbar-none">
        <div
          ref={mainRef}
          className={`relative w-full ${layout.containerMax} md:mx-auto overflow-hidden md:border md:border-[#404A1D22]`}
          style={{ backgroundColor: colors.cream, color: colors.olive }}
          data-testid="mai-lan-white-template"
        >
          <FloralLayer
            className="top-0 pointer-events-none overflow-hidden"
            style={{ right: "50%" }}
            flip
            parallaxY={parallaxA}
            opacity={0.5}
          />

          <HeroHeader
            groomShort={config.groomShortName}
            brideShort={config.brideShortName}
          />

          <section
            className={`relative flex flex-col ${layout.sectionGap} ${layout.sectionPadX} pt-20 md:pt-28 pb-14 md:pb-20 z-10`}
          >
            <FloralLayer
              className="pointer-events-none top-[22%]"
              style={{ right: "42%" }}
              opacity={0.35}
              flip
              rotate={-45}
              extraTransform="translateY(-50%)"
              parallaxY={parallaxB}
            />
            <FloralLayer
              className="pointer-events-none overflow-hidden -top-[50px] md:-top-[100px] lg:-top-[113px]"
              style={{ left: "50%" }}
              extraTransform="scaleY(-1)"
              parallaxY={parallaxA * 0.5}
              opacity={0.3}
            />

            <CeremonySection {...config} />

            {!coverMounted ? (
              <GalleryCards
                photos={photos}
                invitationOpen
                onOpenLightbox={(i) => {
                  setPhotoIndex(i);
                  setLightbox(true);
                }}
              />
            ) : null}

            <PartyCalendarSection
              weddingDate={config.weddingDate}
              partyTime={config.partyTime}
              guestReceptionTime={config.guestReceptionTime}
              calendarLink={calendarLink}
              onRsvp={() => setRsvpOpen(true)}
            />
          </section>

          <PartyVenuesSection
            groom={{
              label: config.groomPartyLabel,
              address: config.groomPartyAddress,
            }}
            bride={{
              label: config.bridePartyLabel,
              address: config.bridePartyAddress,
            }}
          />

          <section
            className={`relative ${layout.sectionPadWide} pb-10 md:pb-12 z-10 text-center`}
          >
            <h2 className={`${headingClassName()} mb-4`}>DRESS CODE</h2>
            <p className={`${type.bodySerif} opacity-80 mb-6`}>
              {config.dressCodeLabel}
            </p>
            <div className="flex justify-center gap-4 md:gap-5 flex-wrap">
              {config.dressColors.map((color) => (
                <span
                  key={color}
                  className="h-14 w-14 md:h-[4.5rem] md:w-[4.5rem] rounded-full border border-[#404A1D22] shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </section>

          <WeddingTimelineSection items={config.timeline} />

          <GuestbookSection
            wishes={wishes}
            wishName={wishName}
            wishMessage={wishMessage}
            submitting={submitting}
            onNameChange={setWishName}
            onMessageChange={setWishMessage}
            onSuggest={fillSuggestion}
            onSubmit={() => void submitWish()}
            formatTime={formatTime}
          />

          <GiftEnvelopes onOpen={() => setGiftOpen(true)} />

          <footer
            className={`relative flex flex-col items-center ${layout.sectionPadWide} pb-16 md:pb-20 text-center z-10`}
          >
            <p className={`${type.footerNote} max-w-md px-4`}>
              {config.footerMessage}
            </p>
          </footer>

          {config.musicUrl ? (
            <MusicFab playing={musicPlaying} onToggle={toggleMusic} />
          ) : null}
        </div>
      </div>

      {lightbox && photos.length > 0 && (
        <PhotoLightbox
          photos={photos}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
          onClose={() => setLightbox(false)}
        />
      )}

      <RsvpModal
        open={rsvpOpen}
        name={rsvpName}
        attending={rsvpAttending}
        done={rsvpDone}
        submitting={submitting}
        onClose={closeRsvp}
        onNameChange={setRsvpName}
        onAttendingChange={setRsvpAttending}
        onSubmit={() => void submitRsvp()}
      />

      <GiftModal
        open={giftOpen}
        banks={config.banks}
        onClose={() => setGiftOpen(false)}
      />
    </>
  );
}
