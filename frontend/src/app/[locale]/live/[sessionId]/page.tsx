import { LiveSessionView } from "@/components/live/LiveSessionView";

export default async function LiveSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <LiveSessionView sessionId={sessionId} />;
}
