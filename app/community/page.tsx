import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { CommunityClient } from "@/components/CommunityClient";
import { CommunityPeopleStatus } from "@/components/CommunityPeopleStatus";

export default async function Community() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [messages, people] = await Promise.all([
    db.communityMessage.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      take: 250,
      include: {
        user: { select: { username: true, course: true, year: true } },
        replyTo: { select: { id: true, content: true, user: { select: { username: true } } } },
      },
    }),
    db.user.findMany({
      select: { id: true, username: true, course: true, year: true, lastActiveAt: true },
      orderBy: { lastActiveAt: "desc" },
      take: 40,
    }),
  ]);

  return (
    <main className="main community-page">
      <CommunityPeopleStatus />
      <div className="community-heading">
        <div>
          <div className="eyebrow">STUDENT COMMUNITY</div>
          <h1 className="h1">Talk to people.</h1>
          <p className="muted">Questions, exam prep, study methods and student-to-student help.</p>
        </div>
        <a href="/profile" className="btn secondary community-edit-profile">Edit profile</a>
      </div>

      <p className="mobile-chat-rule">No links, spam, harassment or personal information. Be normal and help other students.</p>
      <div className="community-layout">
        <section className="community-card">
          <div className="community-card-head">
            <div>
              <div className="eyebrow">COMMON ROOM</div>
              <h2>Student group chat</h2>
            </div>
            <span className="pill">24-hour history · auto-expiring messages</span>
          </div>

          <CommunityClient
            initialMessages={messages.map(m => ({
              id: m.id,
              content: m.content,
              createdAt: m.createdAt.toISOString(),
              replyTo: m.replyTo
                ? { id: m.replyTo.id, content: m.replyTo.content, username: m.replyTo.user.username }
                : null,
              user: { username: m.user.username, course: m.user.course, year: m.user.year },
            }))}
            initialPeople={people.map(p => ({
              id: p.id,
              username: p.username,
              course: p.course,
              year: p.year,
              lastActiveAt: p.lastActiveAt?.toISOString() || null,
            }))}
          />
        </section>

        <aside className="community-side">
          <div className="community-people-card">
            <div className="eyebrow">WHO'S AROUND</div>
            <div className="community-people-title-row">
              <div>
                <h3>Students.</h3>
                <p className="community-people-sub">{people.length} in the room</p>
              </div>
              <span className="pill">Live</span>
            </div>
            <div className="community-people-list">
              {people.slice(0, 12).map(p => (
                <div className="person-row" key={p.id}>
                  <span className="person-dot" data-active="false" />
                  <span className="person-main">
                    <strong>@{p.username}</strong>
                    <small>{p.course || "Student"}{p.year ? ` · Year ${p.year}` : ""}</small>
                  </span>
                  <small className="person-last-seen" data-last-active={p.lastActiveAt || ""}>Checking…</small>
                </div>
              ))}
            </div>
            <p className="community-people-note">Green means active in the last 5 minutes. We only show usernames, with optional course/year.</p>
          </div>

          <div className="community-rules">
            <div className="eyebrow">GROUP RULES</div>
            <h3>Keep it useful.</h3>
            <div className="rule-list">
              <div><b>01.</b> No links or spam.</div>
              <div><b>02.</b> No harassment, hate or threats.</div>
              <div><b>03.</b> Don't post personal information.</div>
              <div><b>04.</b> Course/year are optional profile details.</div>
              <div><b>05.</b> Not professional, medical or emergency advice.</div>
              <div><b>06.</b> Moderation can remove messages or suspend access.</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
