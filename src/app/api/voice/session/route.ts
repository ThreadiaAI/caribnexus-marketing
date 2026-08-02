import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddb = new DynamoDBClient({ region: "us-east-1" });
const SESSIONS_TABLE = "caribnexus-voice-sessions";
const LEADS_TABLE = "caribnexus-voice-leads";

// POST /api/voice/session — create or update a session
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, session_id, mode, messages, lead_info } = body;

  if (action === "create") {
    const now = new Date().toISOString();
    await ddb.send(new PutItemCommand({
      TableName: SESSIONS_TABLE,
      Item: marshall({
        session_id,
        mode: mode || "ask",
        messages: [],
        status: "active",
        created_at: now,
        updated_at: now,
        source_page: body.source_page || "/",
      }),
    }));
    return NextResponse.json({ ok: true, session_id });
  }

  if (action === "append") {
    const now = new Date().toISOString();
    await ddb.send(new UpdateItemCommand({
      TableName: SESSIONS_TABLE,
      Key: marshall({ session_id }),
      UpdateExpression: "SET messages = :msgs, updated_at = :now, #s = :status",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: marshall({
        ":msgs": messages,
        ":now": now,
        ":status": "active",
      }),
    }));
    return NextResponse.json({ ok: true });
  }

  if (action === "complete") {
    const now = new Date().toISOString();
    await ddb.send(new UpdateItemCommand({
      TableName: SESSIONS_TABLE,
      Key: marshall({ session_id }),
      UpdateExpression: "SET #s = :status, updated_at = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: marshall({
        ":status": lead_info ? "lead_captured" : "completed",
        ":now": now,
      }),
    }));

    // If lead info captured, write to leads table
    if (lead_info) {
      const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await ddb.send(new PutItemCommand({
        TableName: LEADS_TABLE,
        Item: marshall({
          lead_id: leadId,
          session_id,
          name: lead_info.name || "",
          email: lead_info.email || "",
          business_name: lead_info.business_name || "",
          industry: lead_info.industry || "",
          employee_count: lead_info.employee_count || "",
          needs: lead_info.needs || "",
          status: "new",
          created_at: now,
        }),
      }));
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400 });
}
