import { NextResponse } from "next/server";

const BASE = "https://proxy.royaleapi.dev/v1";

function normalizeLevel(rarity, level) {
  switch (rarity?.toLowerCase()) {
    case "common": return level;
    case "rare": return level + 2;
    case "epic": return level + 5;
    case "legendary": return level + 8;
    case "champion": return level + 10;
    default: return level;
  }
}

export async function GET(req, { params }) {
  const tag  = params.tag;
  const cleanTag = tag.toUpperCase().replace(/^#*/, "");

  if (!/^[0289CGJLPQRUVY]+$/.test(cleanTag)) {
    return NextResponse.json({ error: "Invalid player tag format" }, { status: 400 });
  }

  const url = `${BASE}/players/%23${encodeURIComponent(cleanTag)}`;

  try {
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // ensures fresh data
    });

    const body = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      const msg = body.message || `HTTP status ${resp.status}`;
      if (resp.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
      return NextResponse.json({ error: msg }, { status: resp.status });
    }

    const cards = (body.cards || []).map((c) => ({
      playername: body.name,
      trophies: body.trophies,
      bestTrophies: body.bestTrophies,
      clan: body.clan?.name,
      wins: body.wins,
      losses: body.losses,
      tcw: body.threeCrownWins,
      name: c.name,
      type: c.rarity || c.type,
      level: normalizeLevel(c.rarity, c.level),
      count: c.count ?? c.amount,
      img: c.iconUrls?.medium,
    }));

    return NextResponse.json({ cards });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
