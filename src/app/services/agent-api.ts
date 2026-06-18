import type { Message, SendMessagePayload } from "../types/chat";

export interface AgentApi {
  sendMessage(payload: SendMessagePayload): Promise<Message>;
}

export class MockAgentApi implements AgentApi {
  async sendMessage(payload: SendMessagePayload): Promise<Message> {
    await new Promise((resolve) => window.setTimeout(resolve, 2200));

    return {
      id: crypto.randomUUID(),
      sender: "agent",
      content: getMockResponse(payload.content),
      createdAt: new Date().toISOString(),
    };
  }
}

function getMockResponse(content: string) {
  const normalizedContent = content.toLocaleLowerCase("pt-BR");

  if (normalizedContent.includes("semente")) {
    return "Você já registrou R$ 32.000 em sementes nesta safra.";
  }

  if (
    normalizedContent.includes("gastei") ||
    normalizedContent.includes("despesa") ||
    normalizedContent.includes("registr")
  ) {
    return "Certo, registrei essa despesa. Seu total realizado na safra agora é de R$ 186.450.";
  }

  if (
    normalizedContent.includes("orçamento") ||
    normalizedContent.includes("saldo")
  ) {
    return "Seu orçamento da safra está 68% utilizado. Ainda restam R$ 87.300 disponíveis.";
  }

  if (
    normalizedContent.includes("relatório") ||
    normalizedContent.includes("resumo")
  ) {
    return "O resumo desta safra mostra R$ 186.450 realizados de R$ 273.750 planejados. Insumos representam a maior categoria de gastos.";
  }

  return "Entendi. Posso ajudar a registrar despesas, consultar saldos e acompanhar o orçamento da sua safra.";
}

// Implementação futura: troca direta por HttpAgentApi, sem alterações na UI.
// POST https://api.redeas.com.br/api/v1/messages
