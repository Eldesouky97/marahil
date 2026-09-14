"use client";

import { useTranslations } from "next-intl";
import { Hand, LogOut, Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useLiveSession } from "@/lib/hooks/useLiveSession";
import { useLiveChat } from "@/lib/hooks/useLiveChat";
import { useLiveWhiteboard } from "@/lib/hooks/useLiveWhiteboard";
import { useLivePoll } from "@/lib/hooks/useLivePoll";
import { useLiveParticipants } from "@/lib/hooks/useLiveParticipants";
import { clearWhiteboard, closePoll, openPoll, startLiveSession } from "@/lib/firebase/liveSessions";
import { LiveWhiteboard } from "./LiveWhiteboard";
import { LiveChat } from "./LiveChat";
import { LivePoll } from "./LivePoll";
import { LiveParticipants } from "./LiveParticipants";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function LiveSessionView({ sessionId }: { sessionId: string }) {
  const { profile } = useAuth();
  const { session, loading } = useLiveSession(sessionId);
  const t = useTranslations("liveSessions");

  const isLive = session?.status === "live";
  const isTeacher = !!profile && !!session && profile.uid === session.teacherId;

  const { messages, send, remove } = useLiveChat(sessionId);
  const { strokes, draw } = useLiveWhiteboard(sessionId, session?.whiteboardClearedAt ?? 0);
  const { tally, myVote, totalVotes, vote } = useLivePoll(sessionId, session?.poll, profile?.uid);
  const { participants, handRaised, toggleHand } = useLiveParticipants(
    sessionId,
    isLive,
    profile?.uid,
    profile?.name,
    profile?.photoURL
  );

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return <p className="py-24 text-center text-dim">{t("notFound")}</p>;
  }

  if (session.status === "ended") {
    return (
      <Container className="py-24 text-center">
        <p className="mb-6 text-dim">{t("ended")}</p>
        <Link href={`/courses/${session.courseId}`}>
          <Button variant="outline">{t("backToCourse")}</Button>
        </Link>
      </Container>
    );
  }

  if (session.status === "scheduled") {
    return (
      <Container className="py-24 text-center">
        <p className="mb-2 text-lg font-bold text-heading">{session.title}</p>
        <p className="mb-6 text-dim">{t("scheduledNotice", { date: new Date(session.scheduledAt).toLocaleString() })}</p>
        {isTeacher ? (
          <Button onClick={() => startLiveSession(sessionId)}>{t("startSession")}</Button>
        ) : (
          <Link href={`/courses/${session.courseId}`}>
            <Button variant="outline">{t("backToCourse")}</Button>
          </Link>
        )}
      </Container>
    );
  }

  return (
    <Container size="lg" className="py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
            <Radio size={13} /> {t("liveBadge")}
          </span>
          <h1 className="text-lg font-bold text-heading">{session.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!isTeacher && (
            <Button
              variant={handRaised ? "primary" : "outline"}
              className="px-4 py-2 text-sm"
              onClick={toggleHand}
            >
              <Hand size={15} /> {t("raiseHand")}
            </Button>
          )}
          <Link href={`/courses/${session.courseId}`}>
            <Button variant="outline" className="px-4 py-2 text-sm">
              <LogOut size={15} /> {t("leave")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <LiveWhiteboard
            strokes={strokes}
            canDraw={isTeacher}
            onDraw={draw}
            onClear={isTeacher ? () => clearWhiteboard(sessionId) : undefined}
          />
          <LivePoll
            poll={session.poll}
            tally={tally}
            myVote={myVote}
            totalVotes={totalVotes}
            onVote={vote}
            isTeacher={isTeacher}
            onOpenPoll={(question, options) => openPoll(sessionId, question, options)}
            onClosePoll={() => session.poll && closePoll(sessionId, session.poll)}
          />
        </div>
        <div className="space-y-4">
          <LiveParticipants participants={participants} />
          <div className="h-80">
            <LiveChat
              messages={messages}
              onSend={(text) => profile && send(profile.uid, profile.name, text)}
              onDelete={isTeacher ? remove : undefined}
              canModerate={isTeacher}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
