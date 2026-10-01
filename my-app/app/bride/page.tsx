import { InvitationExperience } from "@/components/InvitationExperience";
import { getPublicWeddingConfig } from "@/lib/config";
import { getGuestInviteBySlug } from "@/lib/data";
import { inviteLineFromGuest } from "@/lib/guest-invite";

export default async function BrideInvitationPage(
  props: PageProps<"/bride">,
) {
  const searchParams = await props.searchParams;
  const guestParam =
    typeof searchParams?.guest === "string" ? searchParams.guest : undefined;
  const inviteSlug =
    typeof searchParams?.invite === "string"
      ? searchParams.invite.trim().toLowerCase()
      : undefined;

  const guestInvite =
    inviteSlug && inviteSlug.length > 0
      ? await getGuestInviteBySlug(inviteSlug)
      : null;

  const guestName = guestInvite?.name ?? guestParam;
  const inviteLine =
    guestInvite != null ? inviteLineFromGuest(guestInvite) : undefined;

  const config = getPublicWeddingConfig();

  return (
    <InvitationExperience
      config={config}
      guestName={guestName}
      inviteLine={inviteLine}
      partySide="bride"
    />
  );
}
