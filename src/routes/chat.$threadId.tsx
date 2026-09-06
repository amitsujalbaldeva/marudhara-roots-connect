import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Screen, TopBar } from "@/components/AppShell";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { getThread, listMessages, sendMessage } from "@/lib/chat";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Chat with the maker — MARUDHARA" },
      {
        name: "description",
        content: "Message a Rajasthan village maker about a product, price or delivery.",
      },
      { property: "og:title", content: "Chat with the maker — MARUDHARA" },
      { property: "og:description", content: "Ask the maker anything before you pay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  const { user, loading } = useSupabaseUser();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const threadQ = useQuery({
    queryKey: ["chat-thread", threadId],
    enabled: !!user,
    queryFn: () => getThread(threadId),
  });

  const msgsQ = useQuery({
    queryKey: ["chat-messages", threadId],
    enabled: !!user,
    queryFn: () => listMessages(threadId),
    refetchInterval: 5000,
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgsQ.data?.length]);

  const send = useMutation({
    mutationFn: async () => {
      if (!user || !text.trim()) throw new Error("संदेश खाली है / Message is empty");
      await sendMessage(threadId, user.id, text);
    },
    onSuccess: () => {
      setText("");
      qc.invalidateQueries({ queryKey: ["chat-messages", threadId] });
      qc.invalidateQueries({ queryKey: ["chat-threads"] });
    },
    onError: (e: Error) => {
      toast.error(e.message);
    },
  });

  if (loading || (user && threadQ.isLoading)) {
    return (
      <Screen>
        <TopBar title="बातचीत / Chat" />
        <p className="px-4 pt-6 text-sm text-muted-foreground">लोड हो रहा है…</p>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <TopBar title="बातचीत / Chat" />
        <div className="grid gap-3 px-4 pt-8 text-center">
          <p className="text-sm text-muted-foreground">लॉगिन करें / Sign in to continue.</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/auth" })}
            className="tap btn-primary w-full text-sm"
          >
            लॉगिन / Sign in
          </button>
        </div>
      </Screen>
    );
  }

  if (!threadQ.data) {
    return (
      <Screen>
        <TopBar title="बातचीत / Chat" />
        <p className="px-4 pt-6 text-sm text-muted-foreground">
          यह बातचीत नहीं मिली / This chat was not found.
        </p>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title={threadQ.data.product_name ?? "बातचीत / Chat"} action={<span className="w-1" />} />

      <ul className="grid gap-2 px-4 pb-40 pt-4">
        {msgsQ.data?.length ? (
          msgsQ.data.map((m) => {
            const mine = m.sender_id === user.id;
            return (
              <li
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine
                    ? "justify-self-end bg-primary text-primary-foreground"
                    : "justify-self-start bg-card text-foreground shadow-sm"
                }`}
              >
                {m.body}
                <span
                  className={`mt-1 block text-[10px] ${
                    mine ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {new Date(m.created_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            );
          })
        ) : (
          <li className="text-sm text-muted-foreground">
            नमस्ते लिखकर बात शुरू करें / Say hello to start the conversation.
          </li>
        )}
        <li ref={endRef as never} />
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send.mutate();
        }}
        className="fixed bottom-[72px] left-0 right-0 z-30 mx-auto flex max-w-md items-center gap-2 bg-background/95 px-4 py-2 backdrop-blur"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="संदेश लिखें / Type a message"
          className="h-12 min-w-0 flex-1 rounded-2xl border border-border bg-card px-3 text-base"
        />
        <button
          type="submit"
          disabled={send.isPending || !text.trim()}
          aria-label="Send"
          className="tap btn-primary h-12 w-12 shrink-0 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </Screen>
  );
}
