// Anima a entrada das telas reveladas pelo fluxo existente de navegação.
const movimentoReduzidoTransicoes = window.matchMedia('(prefers-reduced-motion: reduce)')
const animacoesDeTela = new Map()
const seletorDeTelas = 'section, form, #inicio-paciente, #dashboard-profissional, #conteudo-nova-senha'

function cancelarTransicoes() {
  for (const animacao of animacoesDeTela.values()) animacao.cancel()
  animacoesDeTela.clear()
}

const observadorTransicoes = new MutationObserver((alteracoes) => {
  // Só uma mudança efetiva de oculto para visível inicia a transição.
  const reveladas = [...new Set(alteracoes
    .filter((alteracao) => alteracao.oldValue !== null && !alteracao.target.hidden)
    .map((alteracao) => alteracao.target))]
    .filter((tela) => tela.matches(seletorDeTelas) &&
      !tela.closest('[hidden]') && tela.getClientRects().length > 0)

  for (const [tela, animacao] of animacoesDeTela) {
    if (tela.closest('[hidden]')) {
      animacao.cancel()
      animacoesDeTela.delete(tela)
    }
  }

  if (movimentoReduzidoTransicoes.matches) return

  for (const tela of reveladas) {
    // Quando uma página inteira aparece, seus blocos entram junto com ela.
    if (reveladas.some((outra) => outra !== tela && outra.contains(tela))) continue
    animacoesDeTela.get(tela)?.cancel()
    const animacao = tela.animate([
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 280, easing: 'cubic-bezier(.22, 1, .36, 1)' })
    animacoesDeTela.set(tela, animacao)
    // Tanto a conclusão quanto um cancelamento liberam a referência.
    animacao.finished.then(limpar, limpar)
    function limpar() {
      if (animacoesDeTela.get(tela) === animacao) animacoesDeTela.delete(tela)
    }
  }
})

observadorTransicoes.observe(document.body, {
  subtree: true,
  attributes: true,
  attributeFilter: ['hidden'],
  attributeOldValue: true,
})
movimentoReduzidoTransicoes.addEventListener('change', cancelarTransicoes)
window.addEventListener('pagehide', cancelarTransicoes)
