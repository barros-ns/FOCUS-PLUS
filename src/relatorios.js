// Converte os registros semanais existentes em sessões datadas, preservando a origem.
export function listarSessoesRelatorios(semanas) {
  return semanas.flatMap((semana, indiceSemana) => semana.sessoes.map((sessao) => {
    const data = new Date(semana.inicio)
    data.setDate(data.getDate() + sessao.dia)
    return { ...sessao, data, indiceSemana, origem: sessao }
  })).sort((a, b) => a.data - b.data)
}

export function chaveDiaRelatorio(data) {
  return [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0'),
  ].join('-')
}

export function filtrarSessoesRelatorio(sessoes, tipo, valor) {
  if (!valor) return []
  return sessoes.filter((sessao) => {
    const chave = chaveDiaRelatorio(sessao.data)
    return tipo === 'mensal' ? chave.slice(0, 7) === valor : chave === valor
  })
}

export function consolidarIndicadoresRelatorio(sessoes) {
  let tempoComOlhar = 0
  let tempoParaPercentual = 0
  let tempoObservado = 0
  let possuiTempo = false
  let saidas = 0
  let possuiSaidas = false
  let sessoesComOlhar = 0

  for (const sessao of sessoes) {
    const dados = sessao.indicadoresVisuais ?? {}
    const tempo = dados.tempoObservadoMs
    const percentual = dados.percentualOlharTela
    if (Number.isFinite(tempo) && tempo >= 0) {
      tempoObservado += tempo
      possuiTempo = true
    }
    if (Number.isFinite(tempo) && tempo > 0 &&
        Number.isFinite(percentual) && percentual >= 0 && percentual <= 100) {
      tempoComOlhar += tempo * percentual / 100
      tempoParaPercentual += tempo
      sessoesComOlhar += 1
    }
    if (Number.isInteger(dados.saidasEnquadramento) && dados.saidasEnquadramento >= 0) {
      saidas += dados.saidasEnquadramento
      possuiSaidas = true
    }
  }
  return {
    percentualOlharTela: tempoParaPercentual > 0 ? tempoComOlhar * 100 / tempoParaPercentual : null,
    tempoObservadoMs: possuiTempo ? tempoObservado : null,
    saidasEnquadramento: possuiSaidas ? saidas : null,
    sessoesComOlhar,
  }
}

export function quantidadeCheckins(sessao) {
  if (Array.isArray(sessao.checkins)) return sessao.checkins.length
  return Number.isInteger(sessao.checkins) && sessao.checkins >= 0 ? sessao.checkins : 0
}
