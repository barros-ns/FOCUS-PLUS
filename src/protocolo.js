// Cada paciente recebe arrays próprios, sem compartilhar respostas com o protocolo base.
export function criarProtocoloBase(base) {
  return base.map(([categoria, pergunta, respostas], indice) => ({
    id: 'base-' + indice,
    categoria,
    pergunta,
    respostas: [...respostas],
    ativa: true,
    personalizada: false,
  }))
}

export function prepararChecklistIndividual(protocolo) {
  return protocolo.filter((questao) => questao.ativa).map((questao) => ({
    ...questao,
    respostas: [...questao.respostas],
  }))
}

// A sessão guarda os textos e as opções usados na ocasião, inclusive sua ordem.
export function registrarChecklistIndividual(perguntas, respostas) {
  return perguntas.map((questao, indice) => ({
    id: questao.id,
    categoria: questao.categoria,
    pergunta: questao.pergunta,
    opcoes: [...questao.respostas],
    resposta: respostas[indice] ?? null,
  }))
}

// Sessões anteriores ao protocolo individual continuam legíveis pelo modelo base.
export function respostasDaSessao(sessao, base) {
  if (Array.isArray(sessao.checklist)) return sessao.checklist
  return base.map(([categoria, pergunta], indice) => ({
    categoria,
    pergunta,
    resposta: sessao.respostas?.[indice] ?? null,
  }))
}

export function moverPerguntaProtocolo(protocolo, questao, direcao) {
  const atual = protocolo.indexOf(questao)
  const destino = atual + direcao
  if (atual < 0 || destino < 0 || destino >= protocolo.length) return atual
  protocolo.splice(atual, 1)
  protocolo.splice(destino, 0, questao)
  return destino
}
