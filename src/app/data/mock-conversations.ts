import type { Conversation } from "../types/chat";

export const initialConversations: Conversation[] = [
  {
    id: "safra-atual",
    title: "Resumo da safra atual",
    updatedAt: "2026-06-18T13:42:00.000Z",
    messages: [
      {
        id: "welcome",
        sender: "agent",
        content:
          "Olá, João! Sou o agente financeiro da Fazenda Santa Clara. Como posso ajudar hoje?",
        createdAt: "2026-06-18T13:40:00.000Z",
      },
      {
        id: "seed-question",
        sender: "user",
        content: "Quanto já gastei em sementes?",
        createdAt: "2026-06-18T13:41:00.000Z",
      },
      {
        id: "seed-answer",
        sender: "agent",
        content:
          "Você já registrou R$ 32.000 em sementes nesta safra.",
        createdAt: "2026-06-18T13:42:00.000Z",
      },
    ],
  },
  {
    id: "diesel",
    title: "Gastos com diesel",
    updatedAt: "2026-06-17T17:20:00.000Z",
    messages: [
      {
        id: "diesel-answer",
        sender: "agent",
        content:
          "Os gastos com diesel somam R$ 18.750 neste mês, 6% abaixo do valor planejado.",
        createdAt: "2026-06-17T17:20:00.000Z",
      },
    ],
  },
  {
    id: "budget",
    title: "Planejamento de orçamento",
    updatedAt: "2026-06-15T11:10:00.000Z",
    messages: [
      {
        id: "budget-answer",
        sender: "agent",
        content:
          "O orçamento da safra está 68% utilizado. Restam R$ 87.300 disponíveis.",
        createdAt: "2026-06-15T11:10:00.000Z",
      },
    ],
  },
  {
    id: "report",
    title: "Relatório de maio",
    updatedAt: "2026-06-02T09:30:00.000Z",
    messages: [
      {
        id: "report-answer",
        sender: "agent",
        content:
          "O relatório de maio foi consolidado. As despesas ficaram 4,2% abaixo do planejado.",
        createdAt: "2026-06-02T09:30:00.000Z",
      },
    ],
  },
];
