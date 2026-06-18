import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChatComposer } from "./components/chat/ChatComposer";
import { ChatHeader } from "./components/chat/ChatHeader";
import { ChatMessage } from "./components/chat/ChatMessage";
import { ChatSidebar } from "./components/chat/ChatSidebar";
import { EmptyConversation } from "./components/chat/EmptyConversation";
import { TypingIndicator } from "./components/chat/TypingIndicator";
import { initialConversations } from "./data/mock-conversations";
import { agentApi } from "./services/chat.service";
import type { Conversation, Message } from "./types/chat";

const createMessage = (
  sender: Message["sender"],
  content: string,
): Message => ({
  id: crypto.randomUUID(),
  sender,
  content,
  createdAt: new Date().toISOString(),
});

export default function ChatApp({ onLogout }: { onLogout: () => void }) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversations[0].id,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ) ?? conversations[0],
    [activeConversationId, conversations],
  );

  const sendMessageMutation = useMutation({
    mutationFn: agentApi.sendMessage.bind(agentApi),
    onSuccess: (agentMessage, variables) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === variables.conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, agentMessage],
                updatedAt: agentMessage.createdAt,
              }
            : conversation,
        ),
      );
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, sendMessageMutation.isPending]);

  function handleSend(content: string) {
    if (!activeConversation || sendMessageMutation.isPending) return;

    const userMessage = createMessage("user", content);

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              title:
                conversation.messages.length === 0
                  ? content.slice(0, 42)
                  : conversation.title,
              messages: [...conversation.messages, userMessage],
              updatedAt: userMessage.createdAt,
            }
          : conversation,
      ),
    );

    sendMessageMutation.mutate({
      conversationId: activeConversation.id,
      content,
    });
  }

  function handleNewConversation() {
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: "Nova conversa",
      messages: [],
      updatedAt: new Date().toISOString(),
    };

    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    setSidebarOpen(false);
  }

  function handleSelectConversation(id: string) {
    if (sendMessageMutation.isPending) return;
    setActiveConversationId(id);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f7f8f5] text-[#19231d]">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onLogout={onLogout}
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={activeConversation?.title ?? "Nova conversa"}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <section
          aria-label="Mensagens da conversa"
          className="min-h-0 flex-1 overflow-y-auto scroll-smooth"
        >
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <EmptyConversation onSuggestion={handleSend} />
          ) : (
            <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-8 pt-6 sm:px-8 sm:pt-10">
              <div className="mb-8 flex items-center gap-3 text-xs font-medium text-[#778279]">
                <span className="h-px flex-1 bg-[#e2e7e1]" />
                Hoje
                <span className="h-px flex-1 bg-[#e2e7e1]" />
              </div>

              <div className="flex flex-col gap-7">
                {activeConversation.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {sendMessageMutation.isPending && <TypingIndicator />}
                {sendMessageMutation.isError && (
                  <p
                    role="alert"
                    className="ml-12 text-sm text-red-700"
                  >
                    Não foi possível obter uma resposta. Tente novamente.
                  </p>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </section>

        <ChatComposer
          isSending={sendMessageMutation.isPending}
          onSend={handleSend}
        />

      </main>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-[#102319]/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
