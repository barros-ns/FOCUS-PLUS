// Contrato dos indicadores que serão preenchidos pelo monitoramento visual.
// null representa uma medição ausente. Zero representa uma medição válida.
export function criarIndicadoresVisuais() {
  return {
    percentualOlharTela: null,
    saidasEnquadramento: null,
    tempoObservadoMs: null,
  }
}

export function exibirIndicadoresVisuais(container, indicadores) {
  const dados = indicadores ?? {}
  const percentual = dados.percentualOlharTela
  const saidas = dados.saidasEnquadramento
  const tempo = dados.tempoObservadoMs
  const formato = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

  container.querySelector('[data-indicador-olhar]').textContent =
    Number.isFinite(percentual) && percentual >= 0 && percentual <= 100
      ? formato.format(percentual) + '%'
      : 'Não medido'
  container.querySelector('[data-indicador-saidas]').textContent =
    Number.isInteger(saidas) && saidas >= 0 ? String(saidas) : 'Não medido'

  let tempoFormatado = 'Não medido'
  if (Number.isFinite(tempo) && tempo >= 0) {
    const segundos = Math.floor(tempo / 1000)
    tempoFormatado = [
      Math.floor(segundos / 3600),
      Math.floor(segundos / 60) % 60,
      segundos % 60,
    ].map((valor) => String(valor).padStart(2, '0')).join(':')
  }
  container.querySelector('[data-indicador-tempo]').textContent = tempoFormatado
}
