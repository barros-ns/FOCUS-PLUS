import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'

const botaoComecar = document.querySelector('#btn-comecar')
const telaInicio = document.querySelector('#tela-inicio')
const telaPerfil = document.querySelector('#tela-perfil')
const telaLogin = document.querySelector('#tela-login')
const tituloPerfil = document.querySelector('#titulo-perfil')
const tituloLogin = document.querySelector('#titulo-login')
const formularioLogin = document.querySelector('#login-form')
const statusLogin = document.querySelector('#login-status')
const formularioRecuperacao = document.querySelector('#recuperar-senha')
const emailLogin = document.querySelector('#login-email')
const emailRecuperacao = document.querySelector('#recuperar-email')
const statusRecuperacao = document.querySelector('#recuperar-status')
const botaoEsqueciSenha = document.querySelector('#esqueci-senha')
const telaTermos = document.querySelector('#tela-termos')
const tituloTermos = document.querySelector('#titulo-termos')
const formularioTermos = document.querySelector('#formulario-termos')
const telaMonitoramento = document.querySelector('#tela-monitoramento')
const tituloMonitoramento = document.querySelector('#titulo-monitoramento')
const telaTesteCamera = document.querySelector('#tela-teste-camera')
const tituloTesteCamera = document.querySelector('#titulo-teste-camera')
const telaConfiguracaoTelas = document.querySelector('#tela-configuracao-telas')
const tituloConfiguracaoTelas = document.querySelector('#titulo-configuracao-telas')
const formularioConfiguracaoTelas = document.querySelector('#formulario-configuracao-telas')
const telaAcessoPaciente = document.querySelector('#tela-acesso-paciente')
const tituloAcessoPaciente = document.querySelector('#titulo-acesso-paciente')
let rotuloLogin = ''
let ultimoPerfil = null

function trocarTela(atual, proxima, foco) {
  atual.hidden = true
  proxima.hidden = false
  foco.focus()
}

botaoComecar.addEventListener('click', () => {
  trocarTela(telaInicio, telaPerfil, tituloPerfil)
})

document.querySelector('#voltar-inicio').addEventListener('click', () => {
  trocarTela(telaPerfil, telaInicio, botaoComecar)
})

for (const opcao of telaPerfil.querySelectorAll('[data-perfil]')) {
  opcao.addEventListener('click', () => {
    ultimoPerfil = opcao
    rotuloLogin = opcao.dataset.perfil === 'paciente'
      ? 'Entrar como paciente'
      : 'Entrar como médico'
    tituloLogin.textContent = rotuloLogin
    formularioLogin.reset()
    formularioLogin.hidden = false
    formularioRecuperacao.reset()
    formularioRecuperacao.hidden = true
    statusRecuperacao.textContent = ''
    statusLogin.textContent = ''
    trocarTela(telaPerfil, telaLogin, tituloLogin)
  })
}

document.querySelector('#voltar-perfis').addEventListener('click', () => {
  trocarTela(telaLogin, telaPerfil, ultimoPerfil ?? tituloPerfil)
})

formularioLogin.addEventListener('submit', (evento) => {
  evento.preventDefault()
  if (ultimoPerfil?.dataset.perfil === 'paciente') {
    formularioTermos.reset()
    document.querySelector('#login-senha').value = ''
    trocarTela(telaLogin, telaTermos, tituloTermos)
    return
  }

  statusLogin.textContent = 'A autenticação ainda está em configuração.'
})

botaoEsqueciSenha.addEventListener('click', () => {
  emailRecuperacao.value = emailLogin.value
  document.querySelector('#login-senha').value = ''
  statusRecuperacao.textContent = ''
  tituloLogin.textContent = 'Recuperar senha'
  trocarTela(formularioLogin, formularioRecuperacao, emailRecuperacao)
})

document.querySelector('#voltar-login').addEventListener('click', () => {
  tituloLogin.textContent = rotuloLogin
  trocarTela(formularioRecuperacao, formularioLogin, botaoEsqueciSenha)
})

formularioRecuperacao.addEventListener('submit', (evento) => {
  evento.preventDefault()
  statusRecuperacao.textContent = 'O envio do link ainda está em configuração.'
})

document.querySelector('#voltar-termos').addEventListener('click', () => {
  trocarTela(telaTermos, telaLogin, tituloLogin)
})

formularioTermos.addEventListener('submit', (evento) => {
  evento.preventDefault()
  if (!formularioTermos.reportValidity()) return
  trocarTela(telaTermos, telaMonitoramento, tituloMonitoramento)
})

document.querySelector('#continuar-monitoramento').addEventListener('click', () => {
  trocarTela(telaMonitoramento, telaTesteCamera, tituloTesteCamera)
})

document.querySelector('#continuar-teste-camera').addEventListener('click', () => {
  formularioConfiguracaoTelas.reset()
  trocarTela(telaTesteCamera, telaConfiguracaoTelas, tituloConfiguracaoTelas)
})

formularioConfiguracaoTelas.addEventListener('submit', (evento) => {
  evento.preventDefault()
  if (!formularioConfiguracaoTelas.reportValidity()) return
  trocarTela(telaConfiguracaoTelas, telaAcessoPaciente, tituloAcessoPaciente)
})

const menuPaciente = document.querySelector('#menu-paciente')
const notificacoesPaciente = document.querySelector('#notificacoes-paciente')
const botaoTema = document.querySelector('#tema-paciente')

document.querySelector('#abrir-menu-paciente').addEventListener('click', () => {
  notificacoesPaciente.open = false
  menuPaciente.showModal()
})

document.querySelector('#fechar-menu-paciente').addEventListener('click', () => {
  menuPaciente.close()
})

menuPaciente.addEventListener('click', (evento) => {
  if (evento.target === menuPaciente) {
    menuPaciente.close()
    return
  }

  const destino = evento.target.closest('[data-destino-paciente]')
  if (!destino) return
  menuPaciente.close()
  const idDestino = destino.dataset.destinoPaciente
  const tituloDestino = document.getElementById(idDestino)
  const telaDestino = telasMenuPaciente[idDestino]
  if (telaDestino) {
    mostrarTelaMenuPaciente(telaDestino, tituloDestino)
    return
  }
  mostrarInicioPaciente(tituloDestino)
})

document.querySelector('#sair-paciente').addEventListener('click', () => {
  menuPaciente.close()
  formularioLogin.reset()
  fecharTelaSessao()
  fecharEdicaoConta()
  ocultarTelasMenuPaciente()
  limparFotoPaciente()
  restaurarContaDemonstracao()
  sessoesFinalizadas.length = 0
  filtroHistorico.reset()
  renderizarHistorico()
  ultimoPerfil = null
  respostasChecklist.length = 0
  checklistPaciente.hidden = true
  checklistConcluido.hidden = true
  inicioPaciente.hidden = false
  trocarTela(telaAcessoPaciente, telaInicio, botaoComecar)
})

botaoTema.addEventListener('click', () => {
  const modoEscuro = telaAcessoPaciente.dataset.bsTheme !== 'dark'
  telaAcessoPaciente.dataset.bsTheme = modoEscuro ? 'dark' : 'light'
  botaoTema.setAttribute('aria-pressed', String(modoEscuro))
})

document.addEventListener('click', (evento) => {
  if (!notificacoesPaciente.contains(evento.target)) notificacoesPaciente.open = false
})

notificacoesPaciente.addEventListener('keydown', (evento) => {
  if (evento.key !== 'Escape' || !notificacoesPaciente.open) return
  notificacoesPaciente.open = false
  notificacoesPaciente.querySelector('summary').focus()
})

const perguntasChecklist = [
  ['Sono', 'Como você avalia seu sono na última noite?', ['Ruim', 'Regular', 'Bom']],
  ['Cansaço', 'Quanto cansaço você está sentindo neste momento?', ['Baixo ou nenhum', 'Moderado', 'Alto']],
  ['Atenção', 'Como você avalia seu nível de atenção neste momento?', ['Baixo', 'Moderado', 'Alto']],
  ['Estado emocional', 'Como você está se sentindo emocionalmente neste momento?', ['Negativo', 'Neutro', 'Positivo']],
  ['Início das atividades', 'Você está tendo dificuldade para iniciar suas atividades de trabalho hoje?', ['Não', 'Moderadamente', 'Sim']],
  ['Refeição', 'Você realizou uma refeição antes de iniciar o trabalho?', ['Não', 'Parcialmente', 'Sim']],
  ['Medicação', 'Você tomou a medicação prescrita para o tratamento hoje?', ['Não', 'Ainda não / parcialmente', 'Sim, conforme prescrito']],
]

const inicioPaciente = document.querySelector('#inicio-paciente')
const checklistPaciente = document.querySelector('#checklist-paciente')
const checklistConcluido = document.querySelector('#checklist-concluido')
const perguntaChecklist = document.querySelector('#checklist-pergunta')
const opcoesChecklist = document.querySelector('#checklist-opcoes')
const botaoVoltarChecklist = document.querySelector('#checklist-voltar')
const botaoComecarChecklist = document.querySelector('#comecar-checklist')
const respostasChecklist = []
let indiceChecklist = 0

function mostrarInicioPaciente(foco = tituloAcessoPaciente) {
  fecharEdicaoConta()
  ocultarTelasMenuPaciente()
  fecharTelaSessao()
  checklistPaciente.hidden = true
  checklistConcluido.hidden = true
  inicioPaciente.hidden = false
  foco.focus()
}

function renderizarChecklist() {
  const [topico, pergunta, opcoes] = perguntasChecklist[indiceChecklist]
  const etapa = indiceChecklist + 1
  const total = perguntasChecklist.length
  document.querySelector('#checklist-etapa').textContent = `Pergunta ${etapa} de ${total}`
  document.querySelector('#checklist-percentual').textContent = `${Math.round(etapa * 100 / total)}%`
  document.querySelector('#checklist-progresso').value = etapa
  document.querySelector('#checklist-topico').textContent = topico
  document.querySelector('#checklist-emocional').hidden = topico !== 'Estado emocional'
  perguntaChecklist.textContent = pergunta
  botaoVoltarChecklist.textContent = indiceChecklist === 0 ? '← Voltar ao início' : '← Pergunta anterior'

  opcoesChecklist.replaceChildren(...opcoes.map((opcao) => {
    const botao = document.createElement('button')
    botao.type = 'button'
    botao.className = 'btn checklist-resposta text-start'
    botao.textContent = opcao
    botao.setAttribute('aria-pressed', String(respostasChecklist[indiceChecklist] === opcao))
    botao.addEventListener('click', () => {
      respostasChecklist[indiceChecklist] = opcao
      if (etapa === total) {
        renderizarResumoChecklist()
        trocarTela(checklistPaciente, checklistConcluido, document.querySelector('#titulo-checklist-concluido'))
        return
      }
      indiceChecklist += 1
      renderizarChecklist()
      perguntaChecklist.focus()
    })
    return botao
  }))
}

botaoComecarChecklist.addEventListener('click', () => {
  indiceChecklist = 0
  respostasChecklist.length = 0
  renderizarChecklist()
  trocarTela(inicioPaciente, checklistPaciente, document.querySelector('#titulo-checklist'))
})

botaoVoltarChecklist.addEventListener('click', () => {
  if (indiceChecklist === 0) {
    mostrarInicioPaciente(botaoComecarChecklist)
    return
  }
  indiceChecklist -= 1
  renderizarChecklist()
  perguntaChecklist.focus()
})

function renderizarResumoChecklist() {
  const resumo = document.querySelector('#resumo-checklist')
  const linhas = perguntasChecklist.map(([topico], indice) => {
    const linha = document.createElement('div')
    linha.className = 'list-group-item bg-transparent px-0 d-flex flex-wrap justify-content-between gap-2'
    const rotulo = document.createElement('dt')
    rotulo.className = 'fw-normal'
    rotulo.textContent = topico + ':'
    const resposta = document.createElement('dd')
    resposta.className = 'fw-bold mb-0'
    resposta.textContent = respostasChecklist[indice]
    linha.append(rotulo, resposta)
    return linha
  })
  resumo.replaceChildren(...linhas)
}

const telaSessao = document.querySelector('#sessao-paciente')
const tituloSessao = document.querySelector('#titulo-sessao')
const tempoSessao = document.querySelector('#tempo-sessao')
const estadoSessao = document.querySelector('#estado-sessao')
const botaoAlternarSessao = document.querySelector('#alternar-sessao')
const botaoFinalizarSessao = document.querySelector('#finalizar-sessao')
const telaSessaoFinalizada = document.querySelector('#sessao-finalizada')
const tituloSessaoFinalizada = document.querySelector('#titulo-sessao-finalizada')
const duracaoSessaoFinalizada = document.querySelector('#duracao-sessao-finalizada')
const botaoVoltarSessao = document.querySelector('#encerrar-visualizacao-sessao')
let numeroSessao = 0
let tempoAcumulado = 0
let inicioCronometro = null
let intervaloSessao = null

function atualizarCronometro() {
  const tempoEmCurso = inicioCronometro === null ? 0 : performance.now() - inicioCronometro
  const segundos = Math.floor((tempoAcumulado + tempoEmCurso) / 1000)
  tempoSessao.textContent = [
    Math.floor(segundos / 3600),
    Math.floor(segundos / 60) % 60,
    segundos % 60,
  ].map((valor) => String(valor).padStart(2, '0')).join(':')
}

function pararCronometro() {
  if (inicioCronometro === null) return
  tempoAcumulado += performance.now() - inicioCronometro
  inicioCronometro = null
  clearInterval(intervaloSessao)
  intervaloSessao = null
  atualizarCronometro()
}

function fecharTelaSessao() {
  pararCronometro()
  telaSessao.hidden = true
  telaSessaoFinalizada.hidden = true
}

document.querySelector('#preparar-sessao').addEventListener('click', () => {
  pararCronometro()
  numeroSessao += 1
  tempoAcumulado = 0
  atualizarCronometro()
  tituloSessao.textContent = 'Sessão ' + String(numeroSessao).padStart(2, '0')
  estadoSessao.textContent = 'Pronta para iniciar. A câmera ainda não está integrada.'
  botaoAlternarSessao.textContent = 'Iniciar monitoramento'
  botaoFinalizarSessao.disabled = true
  trocarTela(checklistConcluido, telaSessao, tituloSessao)
})

botaoAlternarSessao.addEventListener('click', () => {
  if (inicioCronometro !== null) {
    pararCronometro()
    botaoAlternarSessao.textContent = 'Retomar monitoramento'
    estadoSessao.textContent = 'Sessão pausada.'
    return
  }

  inicioCronometro = performance.now()
  intervaloSessao = setInterval(atualizarCronometro, 250)
  botaoAlternarSessao.textContent = 'Pausar monitoramento'
  botaoFinalizarSessao.disabled = false
  estadoSessao.textContent = 'Sessão em andamento no modo de demonstração.'
})

botaoFinalizarSessao.addEventListener('click', () => {
  pararCronometro()
  duracaoSessaoFinalizada.textContent = tempoSessao.textContent
  registrarSessaoFinalizada()
  trocarTela(telaSessao, telaSessaoFinalizada, tituloSessaoFinalizada)
})

botaoVoltarSessao.addEventListener('click', () => mostrarInicioPaciente())

const telasMenuPaciente = {
  'titulo-meu-historico': document.querySelector('#historico-paciente'),
  'titulo-conta-paciente': document.querySelector('#conta-paciente'),
  'titulo-tratamento-paciente': document.querySelector('#tratamento-paciente'),
  'titulo-seguranca-paciente': document.querySelector('#seguranca-paciente'),
}
const fotoContaPaciente = document.querySelector('#foto-conta-paciente')
const arquivoFotoPaciente = document.querySelector('#arquivo-foto-paciente')
const statusFotoPaciente = document.querySelector('#status-foto-paciente')
const fotoPadraoPaciente = fotoContaPaciente.getAttribute('src')
let fotoLocalPaciente = null

function ocultarTelasMenuPaciente() {
  for (const tela of Object.values(telasMenuPaciente)) tela.hidden = true
}

function mostrarTelaMenuPaciente(tela, titulo) {
  fecharEdicaoConta()
  ocultarTelasMenuPaciente()
  fecharTelaSessao()
  checklistPaciente.hidden = true
  checklistConcluido.hidden = true
  trocarTela(inicioPaciente, tela, titulo)
}

function limparFotoPaciente() {
  if (fotoLocalPaciente !== null) URL.revokeObjectURL(fotoLocalPaciente)
  fotoLocalPaciente = null
  fotoContaPaciente.src = fotoPadraoPaciente
  fotoContaPaciente.classList.remove('conta-foto-local')
  arquivoFotoPaciente.value = ''
  statusFotoPaciente.textContent = ''
}

document.querySelector('#alterar-foto-paciente').addEventListener('click', () => {
  arquivoFotoPaciente.click()
})

arquivoFotoPaciente.addEventListener('change', () => {
  const [arquivo] = arquivoFotoPaciente.files
  if (!arquivo) return

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
    statusFotoPaciente.textContent = 'Escolha uma imagem JPEG, PNG ou WebP.'
    arquivoFotoPaciente.value = ''
    return
  }

  limparFotoPaciente()
  fotoLocalPaciente = URL.createObjectURL(arquivo)
  fotoContaPaciente.src = fotoLocalPaciente
  fotoContaPaciente.classList.add('conta-foto-local')
  statusFotoPaciente.textContent = 'Prévia da foto atualizada nesta visita.'
})

const botaoEditarConta = document.querySelector('#editar-conta-paciente')
const dadosConta = document.querySelector('#dados-conta-paciente')
const formularioConta = document.querySelector('#form-editar-conta')
const statusEdicaoConta = document.querySelector('#status-edicao-conta')
const campoNomeConta = formularioConta.elements.nome
const dadosIniciaisConta = Object.fromEntries(new FormData(formularioConta))
let dadosSalvosConta = { ...dadosIniciaisConta }

function renderizarDadosConta() {
  const exibicao = {
    ...dadosSalvosConta,
    telefone: dadosSalvosConta.telefone || 'Não informado',
    nascimento: dadosSalvosConta.nascimento
      ? dadosSalvosConta.nascimento.split('-').reverse().join('/')
      : 'Não informada',
  }

  for (const elemento of dadosConta.querySelectorAll('[data-campo-conta]')) {
    elemento.textContent = exibicao[elemento.dataset.campoConta]
  }

  const nome = dadosSalvosConta.nome
  document.querySelector('#nome-avatar-paciente').textContent = nome
  tituloAcessoPaciente.textContent = 'Olá, ' + nome.split(/\s+/)[0]
}

function fecharEdicaoConta() {
  formularioConta.hidden = true
  dadosConta.hidden = false
  botaoEditarConta.hidden = false
  statusEdicaoConta.textContent = ''
  campoNomeConta.setCustomValidity('')
}

function restaurarContaDemonstracao() {
  dadosSalvosConta = { ...dadosIniciaisConta }
  renderizarDadosConta()
}

botaoEditarConta.addEventListener('click', () => {
  for (const [campo, valor] of Object.entries(dadosSalvosConta)) {
    formularioConta.elements.namedItem(campo).value = valor
  }
  statusEdicaoConta.textContent = ''
  dadosConta.hidden = true
  botaoEditarConta.hidden = true
  formularioConta.hidden = false
  campoNomeConta.focus()
})

campoNomeConta.addEventListener('input', () => campoNomeConta.setCustomValidity(''))

document.querySelector('#cancelar-edicao-conta').addEventListener('click', () => {
  fecharEdicaoConta()
  botaoEditarConta.focus()
})

formularioConta.addEventListener('submit', (evento) => {
  evento.preventDefault()
  const dados = Object.fromEntries(new FormData(formularioConta))
  dados.nome = dados.nome.trim()
  dados.telefone = dados.telefone.trim()
  if (!dados.nome) {
    campoNomeConta.setCustomValidity('Informe seu nome completo.')
    campoNomeConta.reportValidity()
    return
  }
  dadosSalvosConta = dados
  renderizarDadosConta()
  fecharEdicaoConta()
  statusEdicaoConta.textContent = 'Informações atualizadas nesta demonstração.'
  botaoEditarConta.focus()
})

const sessoesFinalizadas = []
const filtroHistorico = document.querySelector('#filtro-historico')
const datasHistorico = document.querySelector('#datas-historico')
const dataDeHistorico = document.querySelector('#historico-de')
const dataAteHistorico = document.querySelector('#historico-ate')
const estadoHistorico = document.querySelector('#estado-historico')
const listaHistorico = document.querySelector('#lista-historico')
const modeloHistorico = document.querySelector('#item-historico')
const formatoDia = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })

function chaveDataLocal(data) {
  return [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0'),
  ].join('-')
}

function registrarSessaoFinalizada() {
  sessoesFinalizadas.unshift({
    numero: tituloSessao.textContent,
    data: new Date(),
    duracao: tempoSessao.textContent,
    completa: tempoAcumulado >= 2 * 60 * 60 * 1000,
    respostas: [...respostasChecklist],
  })
  renderizarHistorico()
}

function criarItemHistorico(sessao) {
  const item = modeloHistorico.content.cloneNode(true)
  const data = formatoDia.format(sessao.data).replace('.', '')
  item.querySelector('[data-sessao-data]').textContent = data.charAt(0).toUpperCase() + data.slice(1)
  item.querySelector('[data-sessao-status]').textContent = sessao.completa ? 'Completo' : 'Parcial'
  item.querySelector('[data-sessao-duracao]').textContent = sessao.duracao
  item.querySelector('[data-sessao-numero]').textContent = sessao.numero

  const checklist = item.querySelector('[data-sessao-checklist]')
  perguntasChecklist.forEach(([topico], indice) => {
    const rotulo = document.createElement('dt')
    rotulo.textContent = topico
    const resposta = document.createElement('dd')
    resposta.textContent = sessao.respostas[indice]
    checklist.append(rotulo, resposta)
  })
  return item
}

function renderizarHistorico() {
  const periodo = new FormData(filtroHistorico).get('periodo')
  const personalizado = periodo === 'personalizado'
  datasHistorico.hidden = !personalizado
  listaHistorico.replaceChildren()

  const hoje = new Date()
  const inicio = new Date(hoje)
  if (periodo === 'semana') inicio.setDate(hoje.getDate() - (hoje.getDay() + 6) % 7)
  if (periodo === 'mes') inicio.setDate(1)

  const de = personalizado ? dataDeHistorico.value : chaveDataLocal(inicio)
  const ate = personalizado ? dataAteHistorico.value : chaveDataLocal(hoje)
  if (!de || !ate || de > ate) {
    estadoHistorico.textContent = 'Selecione um intervalo de datas válido.'
    return
  }

  const sessoesDoPeriodo = sessoesFinalizadas.filter(({ data }) => {
    const dia = chaveDataLocal(data)
    return dia >= de && dia <= ate
  })
  estadoHistorico.textContent = sessoesDoPeriodo.length ? '' : 'Nenhuma sessão finalizada neste período.'
  listaHistorico.replaceChildren(...sessoesDoPeriodo.map(criarItemHistorico))
}

filtroHistorico.addEventListener('change', renderizarHistorico)
filtroHistorico.addEventListener('submit', (evento) => evento.preventDefault())
document.querySelector('#abrir-historico-paciente').addEventListener('click', () => {
  mostrarTelaMenuPaciente(telasMenuPaciente['titulo-meu-historico'], document.querySelector('#titulo-meu-historico'))
})
renderizarHistorico()
