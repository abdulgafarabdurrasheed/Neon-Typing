import type { Context } from "@netlify/functions";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface ScorePayLoad {
    uuid: string;
    nickname: string;
    wpm: number;
    accuracy: number;
    maxCombo: number;
    wordsCompleted: number;
    difficulty: string;
    theme: string;
}

export default async (request: Request, _context: Context) => {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body: ScorePayLoad;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { uuid, nickname, wpm, accuracy, maxCombo, wordsCompleted, difficulty, theme } = body;

    if (!uuid || typeof uuid !== "string" || uuid.length > 64) {
        return new Response(JSON.stringify({ error: "Invalid or missing uuid" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    if (typeof wpm !== "number" || wpm < 0 || wpm > 350) {
        return new Response(JSON.stringify({ error: "Invalid wpm" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    if (typeof accuracy !== "number" || accuracy < 0 || accuracy > 100) {
        return new Response(JSON.stringify({ error: "Invalid accuracy" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const safeName = (nickname || "ANON")
        .replace(/[^a-zA-Z0-9 _-]/g, "")
        .slice(0, 16)
        .trim() || "ANON";

    const rateLimitKey = `ratelimit:${uuid}`;
    const lastSubmit = await redis.get<number>(rateLimitKey);
    if (lastSubmit && Date.now() - lastSubmit < 10_000) {
        return new Response(JSON.stringify({ error: "Too fast, wait 10 seconds" }), {
            status: 429,
            headers: { "Content-Type": "application/json" },
        });
    }
    await redis.set(rateLimitKey, Date.now(), { ex: 15 });

    const scoreData = {
        uuid,
        nickname: safeName,
        wpm,
        accuracy,
        maxCombo,
        wordsCompleted,
        difficulty,
        theme,
        timestamp: Date.now(),
    };

    const existingWpm = await redis.zscore("leaderboard", uuid);

    if (existingWpm === null || wpm > existingWpm) {
        await redis.hset(`player:${uuid}`, scoreData);
        await redis.zadd("leaderboard", { score: wpm, member: uuid });
  }

  return new Response(JSON.stringify({ success: true, stored: safeName }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  })
}
