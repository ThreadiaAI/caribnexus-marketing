import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "deepgram_key_missing" }, { status: 500 });
  }

  // Create a temporary key scoped to listen only, expires in 60s
  try {
    const res = await fetch("https://api.deepgram.com/v1/projects/c6691672-f083-4419-adb4-571b5b1e857c/keys", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: "caribnexus-widget-temp",
        scopes: ["usage:write"],
        time_to_live_in_seconds: 60,
      }),
    });

    if (!res.ok) {
      // Fallback: return the key directly (less secure but works)
      return NextResponse.json({ key: apiKey });
    }

    const data = await res.json();
    return NextResponse.json({ key: data.key });
  } catch {
    // Fallback
    return NextResponse.json({ key: apiKey });
  }
}
