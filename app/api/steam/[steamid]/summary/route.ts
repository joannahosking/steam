import {
  getPlayerSummary,
  PrivateProfileError,
} from "@/lib/steam/getPlayerSummary";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ steamid: string }> },
) {
  const { steamid } = await params;

  try {
    const player = await getPlayerSummary(steamid);
    return Response.json(player);
  } catch (error) {
    if (error instanceof PrivateProfileError) {
      return Response.json({ error: "private_profile" }, { status: 403 });
    }
    console.error(error);
    return Response.json({ error: "unknown_error" }, { status: 500 });
  }
}
