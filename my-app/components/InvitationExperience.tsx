"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type PublicWeddingConfig,
  resolveCeremonyTime,
  resolvePreEvent,
} from "@/lib/config";
import { ceremonyTargetMs, googleCalendarUrl } from "@/lib/date-utils";
import { colors, layout, type } from "@/lib/theme";
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
import { PhotoLightbox } from "./invitation/PhotoLightbox";
import { RsvpModal } from "./invitation/RsvpModal";
import { ScrollReveal } from "./invitation/ScrollReveal";
import { WeddingCountdown } from "./invitation/WeddingCountdown";
import { useIdleAutoScroll } from "./invitation/useIdleAutoScroll";
import { useScrollParallax } from "./invitation/useScrollParallax";
import { useScrollReveal } from "./invitation/useScrollReveal";
import {
  PartyVenuesSection,
  type PartySide,
} from "./invitation/PartyVenuesSection";

type Props = {
  config: PublicWeddingConfig;
  guestName?: string;
  partySide?: PartySide;
};

export function InvitationExperience({ config, guestName, partySide }: Props) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const userGestureAtRef = useRef(0);
  const parallaxA = useScrollParallax(mainRef, 0.35, scrollRootRef);
  const parallaxB = useScrollParallax(mainRef, -0.2, scrollRootRef);

  const [coverMounted, setCoverMounted] = useState(true);
  /** Bật auto-scroll ngay lúc chạm "Mở thiệp" (iOS cần trong user gesture). */
  const [invitationUnlocked, setInvitationUnlocked] = useState(false);
  const [autoScrollKey, setAutoScrollKey] = useState(0);
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
    active: invitationUnlocked,
    paused: lightbox || rsvpOpen || giftOpen,
    scrollRootRef,
    restartKey: autoScrollKey,
  });

  useScrollReveal({
    active: invitationUnlocked,
    scrollRootRef,
    contentRef: mainRef,
  });

  const preEvent = useMemo(
    () => resolvePreEvent(config, partySide),
    [config, partySide],
  );

  const ceremonyTime = useMemo(
    () => resolveCeremonyTime(config, partySide),
    [config, partySide],
  );

  const ceremonyCountdownTargetMs = useMemo(
    () => ceremonyTargetMs(config.weddingDate, ceremonyTime, config.timezone),
    [config.weddingDate, config.timezone, ceremonyTime],
  );

  const ceremonyLocation = useMemo(() => {
    if (partySide === "groom") return config.groomAddress;
    if (partySide === "bride") return config.brideAddress;
    return config.brideAddress;
  }, [config, partySide]);

  const calendarLink = useMemo(
    () =>
      googleCalendarUrl({
        title: `Lễ thành hôn ${config.groomFullName} & ${config.brideFullName}`,
        isoDate: config.weddingDate,
        startTime: ceremonyTime,
        endTime: "13:00",
        timezone: config.timezone,
        details: config.ceremonyHeader.replace(/\n/g, " "),
        location: ceremonyLocation,
      }),
    [config, ceremonyLocation, ceremonyTime],
  );

  const preEventCalendarLink = useMemo(() => {
    if (!preEvent) return null;
    return googleCalendarUrl({
      title: preEvent.title,
      isoDate: preEvent.date,
      startTime: preEvent.time,
      endTime: "18:30",
      timezone: config.timezone,
      details: preEvent.subtitle,
      location: preEvent.address,
    });
  }, [config.timezone, preEvent]);

  const handleCoverDismiss = useCallback(() => {
    setCoverMounted(false);
  }, []);

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

  const handleCoverOpenStart = useCallback(() => {
    userGestureAtRef.current = performance.now();
    startMusic();
    setInvitationUnlocked(true);
    setAutoScrollKey((k) => k + 1);

    const root = scrollRootRef.current;
    if (root) {
      root.scrollTo({ top: 0, behavior: "auto" });
      // Một bước cuộn đồng bộ trong user gesture (Safari iOS).
      root.scrollTop = 1;
      root.scrollTop = 0;
    }
  }, [config.musicUrl]);

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
          onOpenStart={handleCoverOpenStart}
          onDismiss={handleCoverDismiss}
        />
      )}

      <div
        ref={scrollRootRef}
        data-invitation-scroll
        className="h-[100dvh] w-full overflow-y-auto overflow-x-clip overscroll-y-contain touch-pan-y bg-white scrollbar-none [-webkit-overflow-scrolling:touch]"
      >
        <div className="flex w-full justify-center">
          <div
            ref={mainRef}
            className={`relative w-full ${layout.containerMax} md:mx-auto overflow-x-clip overflow-y-visible md:border md:border-[#404A1D22]`}
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
              className={`relative flex flex-col ${layout.sectionGap} ${layout.sectionPadX} pt-6 md:pt-28 pb-14 md:pb-20 z-10`}
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

              <CeremonySection
                {...config}
                partySide={partySide}
                preEvent={preEvent}
                ceremonyTime={ceremonyTime}
                calendarLink={calendarLink}
                preEventCalendarLink={preEventCalendarLink}
                onRsvp={() => setRsvpOpen(true)}
              />

              {!coverMounted ? (
                <ScrollReveal className="relative z-20 -mx-2 md:-mx-4 overflow-visible w-[calc(100%+1rem)] md:w-[calc(100%+2rem)] max-w-none">
                  <GalleryCards
                    photos={photos}
                    invitationOpen
                    onOpenLightbox={(i) => {
                      setPhotoIndex(i);
                      setLightbox(true);
                    }}
                  />
                </ScrollReveal>
              ) : null}
            </section>

            <PartyVenuesSection
              partySide={partySide}
              groom={{
                label: config.groomPartyLabel,
                address: config.groomPartyAddress,
              }}
              bride={{
                label: config.bridePartyLabel,
                address: config.bridePartyAddress,
              }}
            />

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

            <ScrollReveal className="relative z-10 py-8 md:py-10">
              <WeddingCountdown targetMs={ceremonyCountdownTargetMs} />
            </ScrollReveal>

            <ScrollReveal
              as="footer"
              className={`relative flex flex-col items-center ${layout.sectionPadWide} pb-16 md:pb-20 text-center z-10`}
            >
              <p className={`${type.footerNote} max-w-md px-4`}>
                {config.footerMessage}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {config.musicUrl ? (
        <MusicFab playing={musicPlaying} onToggle={toggleMusic} />
      ) : null}

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
