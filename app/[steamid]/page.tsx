import type { Metadata } from "next";
import { getPlayerSummary } from "@/lib/steam/getPlayerSummary";
import { DashboardView } from "@/components/dashboard/DashboardView";

interface PageProps {
  params: Promise<{ steamid: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { steamid } = await params;

  try {
    const player = await getPlayerSummary(steamid);
    return {
      title: `Steam Dashboard: ${player.personaName}'s Steam Library`,
      description: `See ${player.personaName}'s genre breakdown, backlog, and playtime stats.`,
    };
  } catch {
    return {
      title: "Steam Library Dashboard",
    };
  }
}

export default async function DashboardPage({ params }: PageProps) {
  const { steamid } = await params;
  return <DashboardView steamid={steamid} />;
}
