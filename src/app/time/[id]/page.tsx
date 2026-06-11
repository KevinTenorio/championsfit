import { TeamDetailClient } from "@/components/TeamDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeamPage({ params }: Props) {
  const { id } = await params;
  return <TeamDetailClient teamId={id} />;
}
