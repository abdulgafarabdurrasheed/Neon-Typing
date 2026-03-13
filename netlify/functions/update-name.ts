import type { Context } from "@netlify/functions";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async (request: Request, _context: Context) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { uuid, nickname } = body;
  if (!uuid || typeof String(uuid) !== "string" || String(uuid).length > 64) {
    return new Response(JSON.stringify({ error: "Invalid or missing uuid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const anonId = uuid.replace(/-/g, "").substring(0, 10).toUpperCase();
  const safeName = String(nickname || `ANON${anonId}`)
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .slice(0, 16)
    .trim() || `ANON${anonId}`;

  try {
    await redis.hset(`player:${uuid}`, { nickname: safeName });
  } catch (error) {
    console.error("Redis HSET Error:", error);
  }

  return new Response(JSON.stringify({ success: true, nickname: safeName }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
