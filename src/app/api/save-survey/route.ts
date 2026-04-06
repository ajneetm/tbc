import { NextRequest, NextResponse } from "next/server";

const GSHEET_URL = process.env.GSHEET_URL;

export async function POST(req: NextRequest) {
  if (!GSHEET_URL || GSHEET_URL === "YOUR_APPS_SCRIPT_URL_HERE") {
    return NextResponse.json({ error: "Sheet not configured" }, { status: 500 });
  }

  try {
    const body = await req.json();

    // Basic validation - reject obviously fake requests
    if (!body.name || !body.email || !body.surveyType) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Forward to Google Sheets (URL stays server-side only)
    const [userRes, answersRes] = await Promise.all([
      fetch(GSHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "user_info", ...body }),
      }),
      body.answers?.length
        ? fetch(GSHEET_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "answers",
              sessionId: body.sessionId,
              name: body.name,
              surveyType: body.surveyType,
              answers: body.answers,
            }),
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[save-survey]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
