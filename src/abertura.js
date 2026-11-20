// A abertura usa uma cópia visual do logo. O original reserva sua posição na Home.
export function iniciarAbertura() {
  const marca = document.querySelector('#marca-olho-inicio')
  const principal = document.querySelector('main')
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (!marca || !principal || movimentoReduzido.matches || document.hidden) return
  if (document.querySelector('.abertura-camada')) return

  const focoAnterior = document.activeElement
  const estavaInerte = principal.inert
  const camada = document.createElement('div')
  camada.className = 'abertura-camada'
  const fundo = document.createElement('div')
  fundo.className = 'abertura-fundo'
  const olho = marca.cloneNode(true)
  olho.removeAttribute('id')
  olho.classList.remove('olho-recorrente')
  olho.classList.add('abertura-olho')
  const pular = document.createElement('button')
  pular.type = 'button'
  pular.className = 'abertura-pular'
  pular.textContent = 'Pular animação'
  camada.append(fundo, olho, pular)

  // Mede o destino antes de ocultar o logo, sem mudar o espaço ocupado por ele.
  const destino = marca.getBoundingClientRect()
  if (!destino.width || !destino.height) return
  const tamanho = Math.min(420, window.innerWidth * .7, window.innerHeight * .6)
  olho.style.width = tamanho + 'px'
  olho.style.height = tamanho + 'px'
  olho.style.left = (window.innerWidth - tamanho) / 2 + 'px'
  olho.style.top = (window.innerHeight - tamanho) / 2 + 'px'
  let terminou = false
  const animacoes = []
  let limite

  function concluir() {
    if (terminou) return
    terminou = true
    clearTimeout(limite)
    for (const animacao of animacoes) animacao.cancel()
    principal.inert = estavaInerte
    marca.classList.remove('marca-em-abertura')
    const focoNaCamada = camada.contains(document.activeElement)
    camada.remove()
    atualizarPiscadasRecorrentes()
    window.removeEventListener('resize', concluir)
    window.removeEventListener('pagehide', concluir)
    document.removeEventListener('visibilitychange', verificarVisibilidade)
    movimentoReduzido.removeEventListener('change', concluir)
    if (focoNaCamada && focoAnterior instanceof HTMLElement && focoAnterior !== document.body) {
      focoAnterior.focus({ preventScroll: true })
    }
  }

  function verificarVisibilidade() {
    if (document.hidden) concluir()
  }

  pular.addEventListener('click', concluir)
  camada.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') concluir()
  })
  // Mudanças na janela encerram a abertura no logo correto, já no layout atualizado.
  window.addEventListener('resize', concluir)
  window.addEventListener('pagehide', concluir)
  document.addEventListener('visibilitychange', verificarVisibilidade)
  movimentoReduzido.addEventListener('change', concluir)
  principal.inert = true
  marca.classList.add('marca-em-abertura')
  document.body.append(camada)
  atualizarPiscadasRecorrentes()
  if (focoAnterior === document.body) pular.focus({ preventScroll: true })
  limite = setTimeout(concluir, 5500)

  async function animar() {
    try {
      // Duas piscadas: o desenho fecha no eixo vertical e volta à abertura original.
      const piscadas = olho.querySelector('.olho-desenho').animate([
        { transform: 'scaleY(1)', offset: 0 },
        { transform: 'scaleY(1)', offset: .18 },
        { transform: 'scaleY(.035)', offset: .26 },
        { transform: 'scaleY(1)', offset: .36 },
        { transform: 'scaleY(1)', offset: .56 },
        { transform: 'scaleY(.035)', offset: .64 },
        { transform: 'scaleY(1)', offset: .74 },
        { transform: 'scaleY(1)', offset: 1 },
      ], { duration: 1300, easing: 'ease-in-out' })
      animacoes.push(piscadas)
      await piscadas.finished
      if (terminou) return

      // Calcula o deslocamento e a escala a partir da posição real do logo.
      const origem = olho.getBoundingClientRect()
      const dx = destino.left + destino.width / 2 - origem.left - origem.width / 2
      const dy = destino.top + destino.height / 2 - origem.top - origem.height / 2
      const viagem = olho.animate([
        { transform: 'translate(0, 0) scale(1)' },
        { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(' + destino.width / origem.width + ')' },
      ], { duration: 1400, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'forwards' })
      const revelar = fundo.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 1400, easing: 'ease-in-out', fill: 'forwards',
      })
      animacoes.push(viagem, revelar)
      await Promise.all([viagem.finished, revelar.finished])
    } catch {
      // Pular ou cancelar uma animação também libera imediatamente a página.
    } finally {
      concluir()
    }
  }
  animar()
}

// Uma volta pelo histórico do navegador também conta como nova visita à Home.
window.addEventListener('pageshow', (evento) => {
  if (evento.persisted && !document.querySelector('#tela-inicio')?.hidden) iniciarAbertura()
})


// CSS controla os ciclos, sem intervalos JavaScript adicionais.
// A classe é removida ao esconder a tela, ocultar a aba ou pedir movimento reduzido.
const preferenciaMovimentoOlho = window.matchMedia('(prefers-reduced-motion: reduce)')

function atualizarPiscadasRecorrentes() {
  const permitir = !document.hidden &&
    !preferenciaMovimentoOlho.matches &&
    !document.querySelector('.abertura-camada')
  for (const id of ['tela-inicio', 'tela-perfil']) {
    const tela = document.getElementById(id)
    const marca = tela?.querySelector('.marca-olho-inicio')
    marca?.classList.toggle('olho-recorrente', permitir && !tela.hidden)
  }
}

const observadorTelasOlho = new MutationObserver(atualizarPiscadasRecorrentes)
for (const id of ['tela-inicio', 'tela-perfil']) {
  const tela = document.getElementById(id)
  if (tela) observadorTelasOlho.observe(tela, { attributes: true, attributeFilter: ['hidden'] })
}
document.addEventListener('visibilitychange', atualizarPiscadasRecorrentes)
preferenciaMovimentoOlho.addEventListener('change', atualizarPiscadasRecorrentes)
window.addEventListener('pageshow', atualizarPiscadasRecorrentes)
atualizarPiscadasRecorrentes()
