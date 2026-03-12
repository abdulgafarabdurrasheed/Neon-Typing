import type { Context } from "@netlify/functions";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async (request: Request, _context: Context) => {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const topUuids = await redis.zrange("leaderboard", 0, 49, { rev: true });

  if (!topUuids.length) {
    return new Response(JSON.stringify({ leaderboard: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pipeline = redis.pipeline();
  for (const uuid of topUuids) {
    pipeline.hgetall(`player:${uuid}`);
  }
  const results = await pipeline.exec();

  const leaderboard = results
    .filter(Boolean)
    .map((entry: any, index: number) => ({
      rank: index + 1,
      nickname: entry.nickname || "ANON",
      wpm: Number(entry.wpm) || 0,
      accuracy: Number(entry.accuracy) || 0,
      maxCombo: Number(entry.maxCombo) || 0,
      difficulty: entry.difficulty || "easy",
      theme: entry.theme || "cyberpunk",
      uuid: entry.uuid,
    }));

  return new Response(JSON.stringify({ leaderboard }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=30",
    },
  });
};