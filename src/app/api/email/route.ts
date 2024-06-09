import { auth } from "@/auth";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

async function getEmailContent(messageId: string, auth: any) {
  const gmail = google.gmail({ version: "v1", auth: auth });
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  });
  return response.data;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  let accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const maxResults = searchParams.get("maxResults") || "15";

  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2({
    clientId: process.env.AUTH_GOOGLE_ID?.toString(),
    clientSecret: process.env.AUTH_GOOGLE_SECRET?.toString(),
  });
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: parseInt(maxResults),
    });

    if (!response) {
      return NextResponse.json(
        { message: "No Mail Found", success: false },
        { status: 404 }
      );
    }

    const messageId = response.data.messages?.map((message) => message.id);
    if (!messageId) {
      return NextResponse.json(
        { message: "No Mail Found", success: false },
        { status: 404 }
      );
    }
    const messages = await Promise.all(
      messageId.map((id) => id && getEmailContent(id, oauth2Client))
    );

    return NextResponse.json(
      {
        message: "Data Fetched",
        success: true,
        data: messages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      if (refreshToken) {
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2({
          clientId: process.env.AUTH_GOOGLE_ID?.toString(),
          clientSecret: process.env.AUTH_GOOGLE_SECRET?.toString(),
        });
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        try {
          if (!refreshToken) {
            return NextResponse.json(
              { message: "No Mail Found", success: false },
              { status: 404 }
            );
          }

          // Retry the API call with the new access token
          const gmail = google.gmail({ version: "v1", auth: oauth2Client });
          const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: parseInt(maxResults),
          });
          if (!response) {
            return NextResponse.json(
              { message: "No Mail Found", success: false },
              { status: 404 }
            );
          }
          const messageId = response.data.messages?.map(
            (message) => message.id
          );
          if (!messageId) {
            return NextResponse.json(
              { message: "No Mail Found", success: false },
              { status: 404 }
            );
          }

          const messages = await Promise.all(
            messageId.map((id) => id && getEmailContent(id, oauth2Client))
          );
          return NextResponse.json(
            {
              message: "Data Fetched",
              success: true,
              data: messages,
            },
            { status: 200 }
          );
        } catch (refreshError) {
          return NextResponse.json(
            {
              error: "Unauthorized",
              details: "Failed to refresh access token",
            },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.json(
      {
        message: "Error fetching emails",
        success: false,
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
