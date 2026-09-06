import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessagesSquare } from "lucide-react";
import { Screen, TopBar } from "@/components/AppShell";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { listThreads } from "@/lib/chat";

export const Route = createFileRoute("/chats")({
  head: () => ({
    meta: [
      { title: "My chats — MARUDHARA" },
      {
        name: "description",
        content: "Your conversations with village makers about their products and orders.",
      },
      { property: "og:title", content: "My chats — MARUDHARA" },
      { property: "og:description", content: "Talk directly to the maker before you buy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatsPage,
});

function ChatsPage() {
  const { user, loading } = useSupabaseUser();
  const navigate = useNavigate();

  const q = useQuery({
    queryKey: ["chat-threads", user?.id],
    enabled: !!user,
    queryFn: () => listThreads(user!.id),
  });

  if (loading) {
    return (
      <Screen>
        <TopBar title="मेरी बातचीत / My chats" />
        <p className="px-4 pt-6 text-sm text-muted-foreground">लोड हो रहा है…</p>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <TopBar title="मेरी बातचीत / My chats" />
        <div className="grid gap-3 px-4 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            बात करने के लिए पहले लॉगिन करें / Sign in to chat with makers.
          </p>
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

  return (
    <Screen>
      <TopBar title="मेरी बातचीत / My chats" />
      {q.data?.length ? (
        <ul className="grid gap-2 px-4 pt-4">
          {q.data.map((t) => (
            <li key={t.id}>
              <Link
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="surface flex items-center gap-3 p-3"
              >
                <MessagesSquare className="h-5 w-5 shrink-0 text-teal" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {t.product_name ?? "सामान्य बातचीत / General chat"}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {new Date(t.last_message_at).toLocaleString("en-IN")}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 pt-6 text-sm text-muted-foreground">
          अभी कोई बातचीत नहीं / No chats yet. किसी कारीगर के पेज पर “कारीगर से बात करें” दबाएँ।
        </p>
      )}
    </Screen>
  );
}
