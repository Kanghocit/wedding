import { InvitationExperience } from "@/components/InvitationExperience";
import { getPublicWeddingConfig } from "@/lib/config";

export default async function BrideInvitationPage(
  props: PageProps<"/bride">,
) {
  const searchParams = await props.searchParams;
  const guest =
    typeof searchParams?.guest === "string" ? searchParams.guest : undefined;
  const config = getPublicWeddingConfig();

  return (
    <InvitationExperience config={config} guestName={guest} partySide="bride" />
  );
}
