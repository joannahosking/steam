import { getOwnedGames, PrivateProfileError } from "@/lib/steam/getOwnedGames";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ steamid: string }> },
) {
  const { steamid } = await params;

  try {
    const games = await getOwnedGames(steamid);
    return Response.json({ games });
  } catch (error) {
    if (error instanceof PrivateProfileError) {
      return Response.json({ error: "private_profile" }, { status: 403 });
    }
    console.error("getOwnedGames failed:", error); // <- look at this in your terminal
    return Response.json({ error: "unknown_error" }, { status: 500 });
  }
}
