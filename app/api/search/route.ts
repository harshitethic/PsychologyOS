import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";

const MAX_QUERY_LENGTH = 120;

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (!query) return NextResponse.json([]);
  if (query.length > MAX_QUERY_LENGTH || /[\\u0000-\\u001f\\u007f]/.test(query)) {
    return NextResponse.json(
      { error: "Search query must be at most 120 characters without control characters." },
      { status: 400 }
    );
  }

  const matches = await db.topic.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { detailedNotes: { contains: query } },
      ]
    },
    include: { subject: true },
    take: 20,
  });

  return NextResponse.json(matches.map((topic) => ({
    title: topic.title, slug: topic.slug, subject: topic.subject.name,
  })));
}
