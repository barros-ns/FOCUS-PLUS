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

  if (ultimoPerfil?.dataset.perfil === 'medico') {
    formularioLogin.reset()
    voltarDashboardProfissional(false)
    renderizarDashboardProfissional()
    trocarTela(telaLogin, telaProfissional, tituloDashboardProfissional)
  }
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

botaoTema.addEventListener('click', () => alternarTemaConfiguracoes('paciente'))

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
let quantidadePausas = 0
let inicioSessao = null
let fimSessao = null
// Teste: 10 segundos. Para uma hora, use 60 * 60 * 1000.
const INTERVALO_CHECKIN_MS = 10 * 1000
let proximoCheckin = INTERVALO_CHECKIN_MS
const checkinsSessao = []

function atualizarCronometro() {
  const tempoEmCurso = inicioCronometro === null ? 0 : performance.now() - inicioCronometro
  const tempoAtivo = tempoAcumulado + tempoEmCurso
  verificarCheckin(tempoAtivo)
  const segundos = Math.floor(tempoAtivo / 1000)
  tempoSessao.textContent = [
    Math.floor(segundos / 3600),
    Math.floor(segundos / 60) % 60,
    segundos % 60,
  ].map((valor) => String(valor).padStart(2, '0')).join(':')
}

function pararCronometro() {
  if (dialogCheckin.open) dialogCheckin.close()
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
  quantidadePausas = 0
  checkinsSessao.length = 0
  proximoCheckin = INTERVALO_CHECKIN_MS
  inicioSessao = null
  fimSessao = null
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
    quantidadePausas += 1
    botaoAlternarSessao.textContent = 'Retomar monitoramento'
    estadoSessao.textContent = 'Sessão pausada.'
    return
  }

  if (inicioSessao === null) inicioSessao = new Date()
  inicioCronometro = performance.now()
  intervaloSessao = setInterval(atualizarCronometro, 250)
  botaoAlternarSessao.textContent = 'Pausar monitoramento'
  botaoFinalizarSessao.disabled = false
  estadoSessao.textContent = 'Sessão em andamento no modo de demonstração.'
})

botaoFinalizarSessao.addEventListener('click', () => {
  if (inicioSessao === null || fimSessao !== null) return
  fimSessao = new Date()
  pararCronometro()
  duracaoSessaoFinalizada.textContent = tempoSessao.textContent
  document.querySelector('#pausas-sessao-finalizada').textContent = quantidadePausas
  document.querySelector('#horario-sessao-finalizada').textContent = formatarPeriodoSessao(inicioSessao, fimSessao)
  document.querySelector('#checkins-sessao-finalizada').textContent = checkinsSessao.length + ' registrados'
  registrarSessaoFinalizada()
  trocarTela(telaSessao, telaSessaoFinalizada, tituloSessaoFinalizada)
})

botaoVoltarSessao.addEventListener('click', () => mostrarInicioPaciente())

const telasMenuPaciente = {
  'titulo-configuracoes-paciente': document.querySelector('#configuracoes-paciente'),
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
    data: new Date(inicioSessao),
    inicio: inicioSessao.toISOString(),
    fim: fimSessao.toISOString(),
    pausas: quantidadePausas,
    checkins: checkinsSessao.map((checkin) => ({ ...checkin })),
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
  item.querySelector('[data-sessao-pausas]').textContent = sessao.pausas
  item.querySelector('[data-sessao-checkins]').textContent = (sessao.checkins?.length ?? 0) + ' registrados'
  item.querySelector('[data-sessao-horario]').textContent = formatarPeriodoSessao(new Date(sessao.inicio), new Date(sessao.fim))

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

function formatarPeriodoSessao(inicio, fim) {
  const horario = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  if (chaveDataLocal(inicio) === chaveDataLocal(fim)) {
    return horario.format(inicio) + ' até ' + horario.format(fim)
  }
  const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
  return dataHora.format(inicio) + ' até ' + dataHora.format(fim)
}

// Dados fictícios para visualizar o dashboard enquanto o backend é desenvolvido.
const pacientesProfissional = [
  {
    nome: 'Maria',
    email: 'maria@example.com',
    ativo: true,
    ultimaSessao: 'Última sessão: segunda-feira, 09:30',
    tempoTotal: '2h30min',
    sessoesSemana: 1,
  },
]
const telaProfissional = document.querySelector('#tela-profissional')
const tituloDashboardProfissional = document.querySelector('#titulo-dashboard-profissional')
const menuProfissional = document.querySelector('#menu-profissional')
const notificacoesProfissional = document.querySelector('#notificacoes-profissional')
const temaProfissional = document.querySelector('#tema-profissional')

function renderizarDashboardProfissional() {
  document.querySelector('#profissional-pacientes-ativos').textContent =
    pacientesProfissional.filter((paciente) => paciente.ativo).length
  document.querySelector('#profissional-sessoes-semana').textContent =
    pacientesProfissional.reduce((total, paciente) => total + paciente.sessoesSemana, 0)
  document.querySelector('#profissional-solicitacoes').textContent =
    pacientesProfissional.filter((paciente) => !paciente.ativo).length

  const modelo = document.querySelector('#profissional-item-paciente')
  const pacientesOrdenados = pacientesProfissional.filter((paciente) => paciente.ativo)
  if (preferenciasProfissional.ordem === 'nome') pacientesOrdenados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  const itens = pacientesOrdenados.map((paciente) => {
    const item = modelo.content.cloneNode(true)
    item.querySelector('[data-abrir-paciente]').addEventListener('click', () => abrirPerfilPaciente(paciente))
    item.querySelector('[data-paciente-nome]').textContent = paciente.nome
    item.querySelector('[data-paciente-ultima-sessao]').textContent = paciente.ultimaSessao
    item.querySelector('[data-paciente-tempo]').textContent = paciente.tempoTotal
    return item
  })
  document.querySelector('#profissional-lista-pacientes').replaceChildren(...itens)
  renderizarSolicitacoesPacientes()
}

document.querySelector('#abrir-menu-profissional').addEventListener('click', () => {
  notificacoesProfissional.open = false
  menuProfissional.showModal()
})
document.querySelector('#fechar-menu-profissional').addEventListener('click', () => menuProfissional.close())
menuProfissional.addEventListener('click', (evento) => {
  if (evento.target === menuProfissional) menuProfissional.close()
})
document.querySelector('#inicio-profissional').addEventListener('click', () => {
  menuProfissional.close()
  voltarDashboardProfissional()
})
document.querySelector('#sair-profissional').addEventListener('click', () => {
  reiniciarContaProfissional()
  menuProfissional.close()
  notificacoesProfissional.open = false
  formularioLogin.reset()
  ultimoPerfil = null
  trocarTela(telaProfissional, telaInicio, botaoComecar)
})
temaProfissional.addEventListener('click', () => alternarTemaConfiguracoes('profissional'))
document.addEventListener('click', (evento) => {
  if (!notificacoesProfissional.contains(evento.target)) notificacoesProfissional.open = false
})
notificacoesProfissional.addEventListener('keydown', (evento) => {
  if (evento.key !== 'Escape' || !notificacoesProfissional.open) return
  notificacoesProfissional.open = false
  notificacoesProfissional.querySelector('summary').focus()
})

const dashboardProfissional = document.querySelector('#dashboard-profissional')
const perfilProfissionalPaciente = document.querySelector('#perfil-profissional-paciente')
const tituloPerfilProfissionalPaciente = document.querySelector('#titulo-perfil-profissional-paciente')
const perguntasPerfilPaciente = document.querySelector('#perfil-checklist')
const botaoTodasPerguntas = document.querySelector('#perfil-todas-perguntas')

function voltarDashboardProfissional(focar = true) {
  fecharEdicaoProfissional()
  document.querySelector('#configuracoes-profissional').hidden = true
  telaContaProfissional.hidden = true
  telaAnotacoesProfissional.hidden = true
  telaEvolucaoPaciente.hidden = true
  telaSessoesDia.hidden = true
  telaDetalheSessao.hidden = true
  telaRelatorioSemanal.hidden = true
  configuracaoProtocolo.hidden = true
  perfilProfissionalPaciente.hidden = true
  dashboardProfissional.hidden = false
  if (focar) tituloDashboardProfissional.focus()
}

function abrirPerfilPaciente(paciente) {
  pacienteSelecionado = paciente
  fecharEdicaoProfissional()
  document.querySelector('#configuracoes-profissional').hidden = true
  telaContaProfissional.hidden = true
  telaAnotacoesProfissional.hidden = true
  telaEvolucaoPaciente.hidden = true
  telaSessoesDia.hidden = true
  telaDetalheSessao.hidden = true
  telaRelatorioSemanal.hidden = true
  configuracaoProtocolo.hidden = true
  if (!paciente.protocolo) {
    paciente.protocolo = perguntasChecklist.map(([categoria, pergunta, respostas]) => ({
      categoria, pergunta, respostas: [...respostas], ativa: true, personalizada: false,
    }))
  }
  tituloPerfilProfissionalPaciente.textContent = paciente.nome
  document.querySelector('#perfil-sessoes-semana').textContent = paciente.sessoesSemana
  document.querySelector('#perfil-tempo-total').textContent = paciente.tempoTotal
  document.querySelector('#perfil-ultima-sessao').textContent = paciente.ultimaSessao.replace('Última sessão: ', '')
  const itens = paciente.protocolo.map(({ pergunta }, indice) => {
    const item = document.createElement('li')
    item.className = 'protocolo-bloco p-3 rounded-3'
    item.textContent = pergunta
    item.hidden = indice >= 3
    return item
  })
  perguntasPerfilPaciente.replaceChildren(...itens)
  botaoTodasPerguntas.setAttribute('aria-expanded', 'false')
  botaoTodasPerguntas.textContent = 'Ver todas as 7 perguntas'
  trocarTela(dashboardProfissional, perfilProfissionalPaciente, tituloPerfilProfissionalPaciente)
}

botaoTodasPerguntas.addEventListener('click', () => {
  const expandido = botaoTodasPerguntas.getAttribute('aria-expanded') !== 'true'
  Array.from(perguntasPerfilPaciente.children).forEach((item, indice) => {
    item.hidden = !expandido && indice >= 3
  })
  botaoTodasPerguntas.setAttribute('aria-expanded', String(expandido))
  botaoTodasPerguntas.textContent = expandido ? 'Mostrar apenas 3 perguntas' : 'Ver todas as 7 perguntas'
})

document.querySelector('#voltar-dashboard-profissional').addEventListener('click', () => voltarDashboardProfissional())

const configuracaoProtocolo = document.querySelector('#configuracao-protocolo')
const tituloConfiguracaoProtocolo = document.querySelector('#titulo-configuracao-protocolo')
const listaProtocolo = document.querySelector('#lista-protocolo')
const modeloPerguntaProtocolo = document.querySelector('#modelo-pergunta-protocolo')
const statusProtocolo = document.querySelector('#status-protocolo')
let pacienteSelecionado = null

function criarCartaoProtocolo(questao) {
  const fragmento = modeloPerguntaProtocolo.content.cloneNode(true)
  const cartao = fragmento.querySelector('article')
  const leitura = cartao.querySelector('[data-leitura]')
  const formulario = cartao.querySelector('form')
  const editar = cartao.querySelector('[data-editar]')
  const ativa = cartao.querySelector('[data-ativa]')
  const origem = cartao.querySelector('[data-origem]')
  cartao.querySelector('[data-categoria]').textContent = questao.categoria
  ativa.checked = questao.ativa

  function atualizarCartao() {
    origem.textContent = questao.personalizada ? 'Personalizada' : 'Base'
    cartao.querySelector('[data-status-ativa]').textContent = questao.ativa ? 'Ativa' : 'Inativa'
    cartao.querySelector('[data-pergunta]').textContent = questao.pergunta
    const respostas = questao.respostas.map((texto) => {
      const bloco = document.createElement('span')
      bloco.className = 'protocolo-bloco protocolo-resposta'
      bloco.textContent = texto
      return bloco
    })
    cartao.querySelector('[data-respostas]').replaceChildren(...respostas)
  }

  ativa.addEventListener('change', () => {
    questao.ativa = ativa.checked
    atualizarCartao()
    statusProtocolo.textContent = 'Ativação atualizada nesta demonstração.'
  })

  editar.addEventListener('click', () => {
    formulario.elements.pergunta.value = questao.pergunta
    questao.respostas.forEach((resposta, indice) => {
      const campo = formulario.elements.namedItem('resposta' + (indice + 1))
      campo.value = resposta
      campo.setCustomValidity('')
    })
    formulario.elements.pergunta.setCustomValidity('')
    trocarTela(leitura, formulario, formulario.elements.pergunta)
  })

  cartao.querySelector('[data-cancelar]').addEventListener('click', () => trocarTela(formulario, leitura, editar))

  formulario.addEventListener('input', (evento) => evento.target.setCustomValidity(''))
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault()
    const campos = Array.from(formulario.elements).filter((campo) => campo.required)
    for (const campo of campos) {
      campo.setCustomValidity(campo.value.trim() ? '' : 'Preencha este campo.')
    }
    if (!formulario.reportValidity()) return
    questao.pergunta = formulario.elements.pergunta.value.trim()
    questao.respostas = [1, 2, 3].map((indice) => formulario.elements.namedItem('resposta' + indice).value.trim())
    const base = perguntasChecklist.find(([categoria]) => categoria === questao.categoria)
    questao.personalizada = questao.pergunta !== base[1] ||
      questao.respostas.some((resposta, indice) => resposta !== base[2][indice])
    atualizarCartao()
    trocarTela(formulario, leitura, editar)
    statusProtocolo.textContent = 'Pergunta atualizada nesta demonstração.'
  })
  atualizarCartao()
  return fragmento
}

document.querySelector('#editar-protocolo').addEventListener('click', () => {
  document.querySelector('#subtitulo-configuracao-protocolo').textContent =
    'Personalize as perguntas do checklist para ' + pacienteSelecionado.nome
  statusProtocolo.textContent = ''
  listaProtocolo.replaceChildren(...pacienteSelecionado.protocolo.map(criarCartaoProtocolo))
  trocarTela(perfilProfissionalPaciente, configuracaoProtocolo, tituloConfiguracaoProtocolo)
})

document.querySelector('#voltar-perfil-protocolo').addEventListener('click', () => abrirPerfilPaciente(pacienteSelecionado))

// Recupera o protocolo original apenas para o paciente selecionado.
document.querySelector('#restaurar-protocolo').addEventListener('click', () => {
  pacienteSelecionado.protocolo = perguntasChecklist.map(([categoria, pergunta, respostas]) => ({
    categoria,
    pergunta,
    respostas: [...respostas],
    ativa: true,
    personalizada: false,
  }))
  listaProtocolo.replaceChildren(...pacienteSelecionado.protocolo.map(criarCartaoProtocolo))
  statusProtocolo.textContent = 'As sete perguntas foram restauradas ao padrão e reativadas.'
})

// Relatórios e anotações da demonstração ficam vinculados ao paciente em memória.
const telaRelatorioSemanal = document.querySelector('#relatorio-semanal')
const seletorSemanaRelatorio = document.querySelector('#relatorio-semana')
const campoAnotacaoSemanal = document.querySelector('#anotacao-semanal')
const statusAnotacaoSemanal = document.querySelector('#status-anotacao-semanal')
const listaAnotacoesSemanais = document.querySelector('#lista-anotacoes-semanais')
const botaoVerAnotacoes = document.querySelector('#ver-anotacoes-semanais')
const dataCurtaRelatorio = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

function montarSemanasRelatorio() {
  if (!pacienteSelecionado.semanasRelatorio) {
    const segunda = new Date()
    segunda.setHours(0, 0, 0, 0)
    segunda.setDate(segunda.getDate() - (segunda.getDay() + 6) % 7)
    pacienteSelecionado.semanasRelatorio = [{
      inicio: segunda,
      sessoes: [{
        numero: 1,
        dia: 0,
        inicio: '09:30',
        fim: '12:00',
        minutos: 150,
        pausas: 0,
        checkins: 0,
        qualidade: 'Indisponível',
        respostas: ['Regular', 'Moderado', 'Moderado', 'Neutro', 'Não', 'Sim', 'Sim, conforme prescrito'],
      }],

      checkins: 0,
      anotacoes: [],
      rascunho: '',
    }]
  }
  const opcoes = pacienteSelecionado.semanasRelatorio.map((semana, indice) => {
    const opcao = document.createElement('option')
    opcao.value = indice
    opcao.textContent = periodoRelatorio(semana)
    return opcao
  })
  seletorSemanaRelatorio.replaceChildren(...opcoes)
}

function semanaRelatorioAtual() {
  return pacienteSelecionado.semanasRelatorio[Number(seletorSemanaRelatorio.value)]
}

function periodoRelatorio(semana) {
  const fim = new Date(semana.inicio)
  fim.setDate(fim.getDate() + 6)
  return 'Semana de ' + dataCurtaRelatorio.format(semana.inicio) + ' a ' + dataCurtaRelatorio.format(fim)
}

function desenharGraficoSemanal(minutos) {
  const svg = document.querySelector('#relatorio-grafico')
  svg.replaceChildren()
  const ns = 'http://www.w3.org/2000/svg'
  function adicionar(tag, atributos, texto) {
    const elemento = document.createElementNS(ns, tag)
    for (const [nome, valor] of Object.entries(atributos)) elemento.setAttribute(nome, valor)
    if (texto !== undefined) elemento.textContent = texto
    svg.append(elemento)
    return elemento
  }
  const teto = Math.max(60, Math.ceil(Math.max(...minutos) / 60) * 60)
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  for (let indice = 0; indice <= 4; indice += 1) {
    const y = 225 - indice * 45
    adicionar('line', { x1: 55, y1: y, x2: 615, y2: y, stroke: 'currentColor', opacity: '.18' })
    adicionar('text', { x: 44, y: y + 4, 'text-anchor': 'end', fill: 'currentColor', 'font-size': 12 }, Math.round(teto * indice / 4))
  }
  const pontos = minutos.map((valor, indice) => [55 + indice * 560 / 6, 225 - valor / teto * 180])
  adicionar('polyline', { points: pontos.map((ponto) => ponto.join(',')).join(' '), fill: 'none', stroke: 'currentColor', 'stroke-width': 3 })
  pontos.forEach(([x, y], indice) => {
    const ponto = adicionar('circle', { cx: x, cy: y, r: 4, fill: 'currentColor' })
    const titulo = document.createElementNS(ns, 'title')
    titulo.textContent = dias[indice] + ': ' + minutos[indice] + ' minutos'
    ponto.append(titulo)
    ponto.setAttribute('r', '7')
    ponto.setAttribute('tabindex', '0')
    ponto.setAttribute('role', 'button')
    ponto.setAttribute('aria-label', 'Abrir sessões de ' + dias[indice])
    ponto.style.cursor = 'pointer'
    ponto.addEventListener('click', () => abrirSessoesDia(indice))
    ponto.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Enter' && evento.key !== ' ') return
      evento.preventDefault()
      abrirSessoesDia(indice)
    })
    adicionar('text', { x, y: 252, 'text-anchor': 'middle', fill: 'currentColor', 'font-size': 12 }, dias[indice])
  })
  renderizarBotoesDias(dias)
  adicionar('text', { x: 55, y: 25, fill: 'currentColor', 'font-size': 12 }, 'Minutos')
  document.querySelector('#relatorio-dados-grafico').textContent =
    dias.map((dia, indice) => dia + ': ' + minutos[indice] + ' min').join(' · ')
}

function renderizarAnotacoesSemanais() {
  const anotacoes = semanaRelatorioAtual().anotacoes
  const itens = anotacoes.map((anotacao) => {
    const bloco = document.createElement('p')
    bloco.className = 'protocolo-bloco rounded-3 p-3 mb-0 relatorio-anotacao'
    bloco.textContent = anotacao
    return bloco
  })
  if (!itens.length) {
    const vazio = document.createElement('p')
    vazio.textContent = 'Nenhuma anotação nesta semana.'
    itens.push(vazio)
  }
  listaAnotacoesSemanais.replaceChildren(...itens)
}

function renderizarRelatorioSemanal() {
  const semana = semanaRelatorioAtual()
  const minutos = Array(7).fill(0)
  for (const sessao of semana.sessoes) minutos[sessao.dia] += sessao.minutos
  const totalMinutos = minutos.reduce((total, valor) => total + valor, 0)
  document.querySelector('#relatorio-periodo').textContent = periodoRelatorio(semana)
  document.querySelector('#relatorio-total').textContent = semana.sessoes.length
  document.querySelector('#relatorio-tempo').textContent = Math.floor(totalMinutos / 60) + 'h' + String(totalMinutos % 60).padStart(2, '0') + 'min'
  document.querySelector('#relatorio-checkins').textContent = semana.sessoes.reduce((total, sessao) => total + sessao.checkins, 0)
  campoAnotacaoSemanal.value = semana.rascunho
  campoAnotacaoSemanal.setCustomValidity('')
  statusAnotacaoSemanal.textContent = ''
  listaAnotacoesSemanais.hidden = true
  botaoVerAnotacoes.setAttribute('aria-expanded', 'false')
  desenharGraficoSemanal(minutos)
  renderizarAnotacoesSemanais()
}

document.querySelector('#abrir-relatorio-semanal').addEventListener('click', () => {
  montarSemanasRelatorio()
  renderizarRelatorioSemanal()
  trocarTela(perfilProfissionalPaciente, telaRelatorioSemanal, document.querySelector('#titulo-relatorio-semanal'))
})
document.querySelector('#relatorio-voltar').addEventListener('click', () => abrirPerfilPaciente(pacienteSelecionado))
seletorSemanaRelatorio.addEventListener('change', renderizarRelatorioSemanal)
campoAnotacaoSemanal.addEventListener('input', () => {
  campoAnotacaoSemanal.setCustomValidity('')
  semanaRelatorioAtual().rascunho = campoAnotacaoSemanal.value
})
document.querySelector('#form-anotacao-semanal').addEventListener('submit', (evento) => {
  evento.preventDefault()
  const texto = campoAnotacaoSemanal.value.trim()
  campoAnotacaoSemanal.setCustomValidity(texto ? '' : 'Escreva sua observação.')
  if (!campoAnotacaoSemanal.reportValidity()) return
  const semana = semanaRelatorioAtual()
  semana.anotacoes.unshift(texto)
  semana.rascunho = ''
  campoAnotacaoSemanal.value = ''
  statusAnotacaoSemanal.textContent = 'Anotação salva nesta demonstração.'
  renderizarAnotacoesSemanais()
})
botaoVerAnotacoes.addEventListener('click', () => {
  const abrir = listaAnotacoesSemanais.hidden
  listaAnotacoesSemanais.hidden = !abrir
  botaoVerAnotacoes.setAttribute('aria-expanded', String(abrir))
})

const telaSessoesDia = document.querySelector('#profissional-sessoes-dia')
const telaDetalheSessao = document.querySelector('#profissional-detalhe-sessao')
const tituloSessoesDia = document.querySelector('#titulo-profissional-sessoes-dia')
const tituloDetalheSessao = document.querySelector('#titulo-profissional-detalhe-sessao')
const formatoDataSessaoProfissional = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric',
})

function dataDiaRelatorio(indice) {
  const data = new Date(semanaRelatorioAtual().inicio)
  data.setDate(data.getDate() + indice)
  return formatoDataSessaoProfissional.format(data)
}

function renderizarBotoesDias(dias) {
  const botoes = dias.map((dia, indice) => {
    const botao = document.createElement('button')
    botao.type = 'button'
    botao.className = 'btn paciente-controle rounded-pill'
    botao.textContent = dia
    botao.setAttribute('aria-label', 'Abrir sessões de ' + dataDiaRelatorio(indice))
    botao.addEventListener('click', () => abrirSessoesDia(indice))
    return botao
  })
  document.querySelector('#relatorio-dias').replaceChildren(...botoes)
}

function abrirSessoesDia(indice) {
  const sessoes = semanaRelatorioAtual().sessoes.filter((sessao) => sessao.dia === indice)
  document.querySelector('#data-profissional-sessoes-dia').textContent = dataDiaRelatorio(indice)
  document.querySelector('#vazio-profissional-sessoes-dia').hidden = sessoes.length > 0
  const itens = sessoes.map((sessao) => {
    const botao = document.createElement('button')
    botao.type = 'button'
    botao.className = 'paciente-card profissional-paciente-botao w-100 text-start'
    const data = document.createElement('span')
    data.className = 'h5 d-inline-block me-2'
    data.textContent = dataDiaRelatorio(indice)
    const status = document.createElement('span')
    status.className = 'paciente-status rounded-pill px-3 py-1'
    status.textContent = sessao.minutos >= 120 ? 'Completa' : 'Parcial'
    const duracao = document.createElement('span')
    duracao.className = 'd-block mt-2'
    duracao.textContent = 'Duração: ' + Math.floor(sessao.minutos / 60) + 'h' + String(sessao.minutos % 60).padStart(2, '0') + 'min'
    botao.append(data, status, duracao)
    botao.addEventListener('click', () => abrirDetalheSessaoProfissional(sessao, botao))
    return botao
  })
  document.querySelector('#lista-profissional-sessoes-dia').replaceChildren(...itens)
  trocarTela(telaRelatorioSemanal, telaSessoesDia, tituloSessoesDia)
}

let botaoSessaoSelecionada = null

function abrirDetalheSessaoProfissional(sessao, botao) {
  botaoSessaoSelecionada = botao
  sessaoComentada = sessao
  campoComentarioSessao.value = sessao.rascunhoComentario ?? ''
  campoComentarioSessao.setCustomValidity('')
  statusComentarioSessao.textContent = ''
  renderizarComentariosSessao()
  tituloDetalheSessao.textContent = 'Sessão ' + sessao.numero
  document.querySelector('#profissional-sessao-horario').textContent = sessao.inicio + ' até ' + sessao.fim
  document.querySelector('#profissional-sessao-pausas').textContent = sessao.pausas
  document.querySelector('#profissional-sessao-checkins').textContent = sessao.checkins
  document.querySelector('#profissional-sessao-qualidade').textContent = sessao.qualidade

  const respostas = document.querySelector('#profissional-sessao-respostas')
  respostas.replaceChildren()
  perguntasChecklist.forEach(([categoria], indice) => {
    const rotulo = document.createElement('dt')
    rotulo.textContent = categoria
    const valor = document.createElement('dd')
    valor.textContent = sessao.respostas[indice] ?? 'Não respondida'
    respostas.append(rotulo, valor)
  })
  trocarTela(telaSessoesDia, telaDetalheSessao, tituloDetalheSessao)
}

document.querySelector('#voltar-relatorio-dia').addEventListener('click', () => {
  trocarTela(telaSessoesDia, telaRelatorioSemanal, document.querySelector('#relatorio-semana'))
})
document.querySelector('#voltar-sessoes-dia').addEventListener('click', () => {
  trocarTela(telaDetalheSessao, telaSessoesDia, botaoSessaoSelecionada ?? tituloSessoesDia)
})


// Comentários e rascunho pertencem à sessão, separados das anotações semanais.
let sessaoComentada = null
const campoComentarioSessao = document.querySelector('#comentario-sessao')
const statusComentarioSessao = document.querySelector('#status-comentario-sessao')
const listaComentariosSessao = document.querySelector('#lista-comentarios-sessao')
const formatoComentarioSessao = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

function renderizarComentariosSessao() {
  const comentarios = sessaoComentada.comentarios ?? []
  const itens = comentarios.map((comentario) => {
    const bloco = document.createElement('div')
    bloco.className = 'protocolo-bloco rounded-3 p-3'
    const data = document.createElement('time')
    data.className = 'small d-block mb-2'
    data.dateTime = comentario.data
    data.textContent = formatoComentarioSessao.format(new Date(comentario.data))
    const texto = document.createElement('p')
    texto.className = 'relatorio-anotacao mb-0'
    texto.textContent = comentario.texto
    bloco.append(data, texto)
    return bloco
  })
  if (!itens.length) {
    const vazio = document.createElement('p')
    vazio.className = 'small mb-0'
    vazio.textContent = 'Nenhum comentário nesta sessão.'
    itens.push(vazio)
  }
  listaComentariosSessao.replaceChildren(...itens)
}

campoComentarioSessao.addEventListener('input', () => {
  campoComentarioSessao.setCustomValidity('')
  sessaoComentada.rascunhoComentario = campoComentarioSessao.value
})

document.querySelector('#form-comentario-sessao').addEventListener('submit', (evento) => {
  evento.preventDefault()
  const texto = campoComentarioSessao.value.trim()
  campoComentarioSessao.setCustomValidity(texto ? '' : 'Escreva seu comentário.')
  if (!campoComentarioSessao.reportValidity()) return
  sessaoComentada.comentarios ??= []
  sessaoComentada.comentarios.unshift({ texto, data: new Date().toISOString() })
  sessaoComentada.rascunhoComentario = ''
  campoComentarioSessao.value = ''
  renderizarComentariosSessao()
  statusComentarioSessao.textContent = 'Comentário salvo nesta demonstração.'
})


// Evolução usa os registros disponíveis do paciente e preserva meses sem notas.
const telaEvolucaoPaciente = document.querySelector('#evolucao-paciente')
const tituloEvolucaoPaciente = document.querySelector('#titulo-evolucao-paciente')
const formatoMesEvolucao = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' })

function dadosEvolucaoPaciente(quantidadeMeses) {
  const hoje = new Date()
  const meses = Array.from({ length: quantidadeMeses }, (_, indice) => ({
    data: new Date(hoje.getFullYear(), hoje.getMonth() - quantidadeMeses + 1 + indice, 1),
    sessoes: 0,
    notas: [],
  }))

  for (const semana of pacienteSelecionado.semanasRelatorio) {
    for (const sessao of semana.sessoes) {
      const data = new Date(semana.inicio)
      data.setDate(data.getDate() + sessao.dia)
      const mes = meses.find((item) =>
        item.data.getFullYear() === data.getFullYear() && item.data.getMonth() === data.getMonth())
      if (!mes) continue
      mes.sessoes += 1
      if (Number.isFinite(sessao.atencaoMedia) && sessao.atencaoMedia >= 0 && sessao.atencaoMedia <= 10) {
        mes.notas.push(sessao.atencaoMedia)
      }
    }
  }

  return meses.map((mes) => ({
    rotulo: formatoMesEvolucao.format(mes.data).replace('.', ''),
    sessoes: mes.sessoes,
    atencao: mes.notas.length
      ? mes.notas.reduce((total, nota) => total + nota, 0) / mes.notas.length
      : null,
  }))
}

function desenharGraficoEvolucao(id, titulo, descricao, meses, valores, teto, unidade) {
  const svg = document.getElementById(id)
  svg.replaceChildren()
  function adicionar(tag, atributos, texto) {
    const elemento = document.createElementNS('http://www.w3.org/2000/svg', tag)
    for (const [nome, valor] of Object.entries(atributos)) elemento.setAttribute(nome, valor)
    if (texto !== undefined) elemento.textContent = texto
    svg.append(elemento)
    return elemento
  }

  adicionar('title', { id: 'titulo-' + id }, titulo)
  adicionar('desc', { id: 'descricao-' + id }, descricao)
  adicionar('text', { x: 55, y: 22, fill: 'currentColor', 'font-size': 12 }, unidade)
  const passo = unidade === 'Sessões' ? Math.max(1, Math.ceil(teto / 4)) : 2
  for (let valor = 0; valor <= teto; valor += passo) {
    const y = 225 - valor / teto * 180
    adicionar('line', { x1: 55, x2: 615, y1: y, y2: y, stroke: 'currentColor', opacity: '.18' })
    adicionar('text', { x: 44, y: y + 4, fill: 'currentColor', 'text-anchor': 'end', 'font-size': 12 }, valor)
  }

  let anterior = null
  meses.forEach((mes, indice) => {
    const x = meses.length === 1 ? 335 : 55 + indice * 560 / (meses.length - 1)
    adicionar('text', { x, y: 253, fill: 'currentColor', 'text-anchor': 'middle', 'font-size': 12 }, mes.rotulo)
    const valor = valores[indice]
    if (valor === null) {
      anterior = null
      return
    }
    const y = 225 - valor / teto * 180
    if (anterior) adicionar('line', {
      x1: anterior.x, y1: anterior.y, x2: x, y2: y, stroke: 'currentColor', 'stroke-width': 3,
    })
    const ponto = adicionar('circle', { cx: x, cy: y, r: 5, fill: 'currentColor' })
    const dica = document.createElementNS('http://www.w3.org/2000/svg', 'title')
    dica.textContent = mes.rotulo + ': ' + valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
    ponto.append(dica)
    anterior = { x, y }
  })
}

function renderizarEvolucaoPaciente() {
  const mesesSessoes = dadosEvolucaoPaciente(Number(document.querySelector('#periodo-evolucao-sessoes').value))
  const mesesAtencao = dadosEvolucaoPaciente(Number(document.querySelector('#periodo-evolucao-atencao').value))
  const sessoes = mesesSessoes.map((mes) => mes.sessoes)
  const descricaoSessoes = mesesSessoes.map((mes) => mes.rotulo + ': ' + mes.sessoes + ' sessões').join(' · ')
  const descricaoAtencao = mesesAtencao.map((mes) => mes.rotulo + ': ' +
    (mes.atencao === null ? 'sem avaliações' : mes.atencao.toFixed(1) + '/10')).join(' · ')
  desenharGraficoEvolucao(
    'grafico-evolucao-sessoes', 'Número de Sessões por Mês', descricaoSessoes,
    mesesSessoes, sessoes, Math.max(4, Math.ceil(Math.max(...sessoes) / 4) * 4), 'Sessões',
  )
  desenharGraficoEvolucao(
    'grafico-evolucao-atencao', 'Evolução da atenção média', descricaoAtencao,
    mesesAtencao, mesesAtencao.map((mes) => mes.atencao), 10, 'Pontuação /10',
  )
  document.querySelector('#resumo-evolucao-sessoes').textContent = descricaoSessoes
  document.querySelector('#resumo-evolucao-atencao').textContent =
    mesesAtencao.every((mes) => mes.atencao === null)
      ? 'Sem avaliações na escala de 0 a 10 neste período.'
      : descricaoAtencao
}
document.querySelector('#abrir-evolucao-paciente').addEventListener('click', () => {
  montarSemanasRelatorio()
  aplicarPeriodoPreferido()
  renderizarEvolucaoPaciente()
  trocarTela(perfilProfissionalPaciente, telaEvolucaoPaciente, tituloEvolucaoPaciente)
})
document.querySelector('#voltar-evolucao-paciente').addEventListener('click', () => abrirPerfilPaciente(pacienteSelecionado))


// Os filtros são independentes para permitir comparar períodos diferentes.
document.querySelector('#periodo-evolucao-sessoes').addEventListener('change', renderizarEvolucaoPaciente)
document.querySelector('#periodo-evolucao-atencao').addEventListener('change', renderizarEvolucaoPaciente)

const telaAnotacoesProfissional = document.querySelector('#anotacoes-profissional')
const tituloAnotacoesProfissional = document.querySelector('#titulo-anotacoes-profissional')

function criarAnotacaoComOrigem(texto, origem, href, abrirOrigem) {
  const bloco = document.createElement('div')
  bloco.className = 'protocolo-bloco rounded-3 p-3'
  const paragrafo = document.createElement('p')
  paragrafo.className = 'relatorio-anotacao mb-2'
  paragrafo.textContent = texto
  const link = document.createElement('a')
  link.href = href
  link.className = 'btn paciente-controle text-start'
  link.textContent = origem
  link.addEventListener('click', (evento) => {
    evento.preventDefault()
    fecharEdicaoProfissional()
  document.querySelector('#configuracoes-profissional').hidden = true
  telaContaProfissional.hidden = true
  telaAnotacoesProfissional.hidden = true
    abrirOrigem()
  })
  bloco.append(paragrafo, link)
  return bloco
}

function renderizarPaginaAnotacoes() {
  const notas = []
  const comentarios = []
  pacienteSelecionado.semanasRelatorio.forEach((semana, indiceSemana) => {
    function selecionarRelatorioOrigem() {
      seletorSemanaRelatorio.value = indiceSemana
      renderizarRelatorioSemanal()
    }
    for (const anotacao of semana.anotacoes) {
      const texto = typeof anotacao === 'string' ? anotacao : anotacao.texto
      notas.push(criarAnotacaoComOrigem(
        texto, 'Abrir relatório · ' + periodoRelatorio(semana), '#relatorio-semanal', () => {
          selecionarRelatorioOrigem()
          telaRelatorioSemanal.hidden = false
          document.querySelector('#titulo-relatorio-semanal').focus()
        },
      ))
    }
    for (const sessao of semana.sessoes) {
      for (const comentario of sessao.comentarios ?? []) {
        const data = new Date(semana.inicio)
        data.setDate(data.getDate() + sessao.dia)
        comentarios.push(criarAnotacaoComOrigem(
          comentario.texto,
          'Abrir sessão ' + sessao.numero + ' · ' + dataCurtaRelatorio.format(data),
          '#profissional-detalhe-sessao',
          () => {
            selecionarRelatorioOrigem()
            abrirSessoesDia(sessao.dia)
            abrirDetalheSessaoProfissional(sessao, tituloSessoesDia)
          },
        ))
      }
    }
  })
  for (const [id, itens, vazio] of [
    ['anotacoes-relatorios-lista', notas, 'Nenhuma anotação em relatórios semanais.'],
    ['anotacoes-sessoes-lista', comentarios, 'Nenhum comentário em sessões.'],
  ]) {
    if (!itens.length) {
      const mensagem = document.createElement('p')
      mensagem.className = 'mb-0'
      mensagem.textContent = vazio
      itens.push(mensagem)
    }
    document.getElementById(id).replaceChildren(...itens)
  }
}

document.querySelector('#abrir-anotacoes-profissional').addEventListener('click', () => {
  montarSemanasRelatorio()
  renderizarPaginaAnotacoes()
  trocarTela(perfilProfissionalPaciente, telaAnotacoesProfissional, tituloAnotacoesProfissional)
})
document.querySelector('#voltar-anotacoes-profissional').addEventListener('click', () => abrirPerfilPaciente(pacienteSelecionado))

document.querySelector('#pacientes-menu-profissional').addEventListener('click', () => {
  menuProfissional.close()
  voltarDashboardProfissional(false)
  document.querySelector('#titulo-lista-pacientes-profissional').focus()
})

const telaContaProfissional = document.querySelector('#conta-profissional')
const formularioContaProfissional = document.querySelector('#form-conta-profissional')
const dadosContaProfissional = document.querySelector('#dados-conta-profissional')
const editarContaProfissional = document.querySelector('#editar-conta-profissional')
const statusContaProfissional = document.querySelector('#status-conta-profissional')
const fotoContaProfissional = document.querySelector('#foto-conta-profissional')
const arquivoFotoProfissional = document.querySelector('#arquivo-foto-profissional')
const statusFotoProfissional = document.querySelector('#status-foto-profissional')
const dadosIniciaisProfissional = Object.fromEntries(new FormData(formularioContaProfissional))
let dadosSalvosProfissional = { ...dadosIniciaisProfissional }
let fotoLocalProfissional = null

function fecharEdicaoProfissional() {
  formularioContaProfissional.hidden = true
  dadosContaProfissional.hidden = false
  editarContaProfissional.hidden = false
  statusContaProfissional.textContent = ''
}

function renderizarContaProfissional() {
  const dados = {
    ...dadosSalvosProfissional,
    telefone: dadosSalvosProfissional.telefone || 'Não informado',
    profissao: dadosSalvosProfissional.profissao || 'Não informada',
    registro: dadosSalvosProfissional.tipoRegistro
      ? dadosSalvosProfissional.tipoRegistro + ': ' + dadosSalvosProfissional.numeroRegistro
      : 'Não informado',
  }
  for (const campo of dadosContaProfissional.querySelectorAll('[data-campo-profissional]')) {
    campo.textContent = dados[campo.dataset.campoProfissional]
  }
  document.querySelector('#nome-avatar-profissional').textContent = dados.nome
}

function reiniciarContaProfissional() {
  fecharEdicaoProfissional()
  document.querySelector('#configuracoes-profissional').hidden = true
  telaContaProfissional.hidden = true
  dadosSalvosProfissional = { ...dadosIniciaisProfissional }
  renderizarContaProfissional()
  if (fotoLocalProfissional) URL.revokeObjectURL(fotoLocalProfissional)
  fotoLocalProfissional = null
  fotoContaProfissional.src = '/src/img/person.svg'
  fotoContaProfissional.classList.remove('conta-foto-local')
  arquivoFotoProfissional.value = ''
  statusFotoProfissional.textContent = ''
}

document.querySelector('#abrir-conta-profissional').addEventListener('click', () => {
  menuProfissional.close()
  voltarDashboardProfissional(false)
  renderizarContaProfissional()
  trocarTela(dashboardProfissional, telaContaProfissional, document.querySelector('#titulo-conta-profissional'))
})

editarContaProfissional.addEventListener('click', () => {
  for (const [nome, valor] of Object.entries(dadosSalvosProfissional)) {
    const campo = formularioContaProfissional.elements.namedItem(nome)
    campo.value = valor
    campo.setCustomValidity('')
  }
  statusContaProfissional.textContent = ''
  dadosContaProfissional.hidden = true
  editarContaProfissional.hidden = true
  formularioContaProfissional.hidden = false
  formularioContaProfissional.elements.nome.focus()
})
document.querySelector('#cancelar-conta-profissional').addEventListener('click', () => {
  fecharEdicaoProfissional()
  editarContaProfissional.focus()
})
formularioContaProfissional.addEventListener('input', () => {
  for (const campo of formularioContaProfissional.querySelectorAll('input')) campo.setCustomValidity('')
})
formularioContaProfissional.addEventListener('submit', (evento) => {
  evento.preventDefault()
  const dados = Object.fromEntries(Array.from(new FormData(formularioContaProfissional), ([nome, valor]) => [nome, valor.trim()]))
  formularioContaProfissional.elements.nome.setCustomValidity(dados.nome ? '' : 'Informe o nome completo.')
  formularioContaProfissional.elements.numeroRegistro.setCustomValidity(
    Boolean(dados.tipoRegistro) === Boolean(dados.numeroRegistro) ? '' : 'Preencha o tipo e o número do registro.',
  )
  if (!formularioContaProfissional.reportValidity()) return
  dadosSalvosProfissional = dados
  renderizarContaProfissional()
  fecharEdicaoProfissional()
  statusContaProfissional.textContent = 'Informações atualizadas nesta demonstração.'
  editarContaProfissional.focus()
})
document.querySelector('#alterar-foto-profissional').addEventListener('click', () => arquivoFotoProfissional.click())
arquivoFotoProfissional.addEventListener('change', () => {
  const [arquivo] = arquivoFotoProfissional.files
  if (!arquivo) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
    statusFotoProfissional.textContent = 'Escolha uma imagem JPEG, PNG ou WebP.'
    arquivoFotoProfissional.value = ''
    return
  }
  if (fotoLocalProfissional) URL.revokeObjectURL(fotoLocalProfissional)
  fotoLocalProfissional = URL.createObjectURL(arquivo)
  fotoContaProfissional.src = fotoLocalProfissional
  fotoContaProfissional.classList.add('conta-foto-local')
  statusFotoProfissional.textContent = 'Prévia da foto atualizada nesta visita.'
})


// Preferências por perfil, mantidas em memória nesta demonstração.
const preferenciasProfissional = { ordem: 'padrao', periodo: '5' }
const preferenciaTema = { paciente: 'light', profissional: 'light' }
const temaSistema = window.matchMedia('(prefers-color-scheme: dark)')

function aplicarTemaConfiguracoes(perfil, tema) {
  preferenciaTema[perfil] = tema
  const escuro = tema === 'dark' || (tema === 'auto' && temaSistema.matches)
  const tela = perfil === 'paciente' ? telaAcessoPaciente : telaProfissional
  const botao = perfil === 'paciente' ? botaoTema : temaProfissional
  tela.dataset.bsTheme = escuro ? 'dark' : 'light'
  botao.setAttribute('aria-pressed', String(escuro))
  document.querySelector('#tema-configuracoes-' + perfil).value = tema
}

function alternarTemaConfiguracoes(perfil) {
  const tela = perfil === 'paciente' ? telaAcessoPaciente : telaProfissional
  aplicarTemaConfiguracoes(perfil, tela.dataset.bsTheme === 'dark' ? 'light' : 'dark')
}

function aplicarPeriodoPreferido() {
  document.querySelector('#periodo-evolucao-sessoes').value = preferenciasProfissional.periodo
  document.querySelector('#periodo-evolucao-atencao').value = preferenciasProfissional.periodo
}

function aplicarConfiguracoes(perfil) {
  const formulario = document.querySelector('#form-configuracoes-' + perfil)
  aplicarTemaConfiguracoes(perfil, formulario.elements.tema.value)
  if (perfil === 'profissional') {
    preferenciasProfissional.periodo = formulario.elements.periodo.value
    preferenciasProfissional.ordem = formulario.elements.ordem.value
    renderizarDashboardProfissional()
  } else {
    const valor = formulario.elements.monitores.value
    formularioConfiguracaoTelas.querySelector('input[value="' + valor + '"]').checked = true
  }
}

for (const perfil of ['paciente', 'profissional']) {
  const formulario = document.querySelector('#form-configuracoes-' + perfil)
  const status = document.querySelector('#status-configuracoes-' + perfil)
  formulario.elements.tema.addEventListener('change', () => {
    aplicarTemaConfiguracoes(perfil, formulario.elements.tema.value)
  })
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault()
    aplicarConfiguracoes(perfil)
    status.textContent = 'Preferências salvas nesta demonstração.'
  })
  formulario.addEventListener('reset', () => {
    queueMicrotask(() => {
      aplicarConfiguracoes(perfil)
      status.textContent = 'Preferências restauradas ao padrão.'
    })
  })
}
temaSistema.addEventListener('change', () => {
  for (const perfil of ['paciente', 'profissional']) {
    if (preferenciaTema[perfil] === 'auto') aplicarTemaConfiguracoes(perfil, 'auto')
  }
})

formularioConfiguracaoTelas.addEventListener('submit', () => {
  document.querySelector('#form-configuracoes-paciente').elements.monitores.value =
    new FormData(formularioConfiguracaoTelas).get('quantidadeTelas')
})

document.querySelector('#abrir-configuracoes-profissional').addEventListener('click', () => {
  menuProfissional.close()
  voltarDashboardProfissional(false)
  trocarTela(
    dashboardProfissional,
    document.querySelector('#configuracoes-profissional'),
    document.querySelector('#titulo-configuracoes-profissional'),
  )
})


// A confirmação real da troca depende do serviço de autenticação.
const dialogNovaSenha = document.querySelector('#dialog-nova-senha')
const formularioNovaSenha = document.querySelector('#form-nova-senha')
const novaSenha = document.querySelector('#nova-senha')
const confirmarNovaSenha = document.querySelector('#confirmar-nova-senha')
const mostrarNovaSenha = document.querySelector('#mostrar-nova-senha')
const statusNovaSenha = document.querySelector('#status-nova-senha')
const conteudoNovaSenha = document.querySelector('#conteudo-nova-senha')
const confirmacaoNovaSenha = document.querySelector('#confirmacao-nova-senha')
const tituloConfirmacaoNovaSenha = document.querySelector('#titulo-confirmacao-nova-senha')

function limparFormularioNovaSenha() {
  conteudoNovaSenha.hidden = false
  confirmacaoNovaSenha.hidden = true
  dialogNovaSenha.setAttribute('aria-labelledby', 'titulo-nova-senha')
  formularioNovaSenha.reset()
  novaSenha.type = 'password'
  confirmarNovaSenha.type = 'password'
  confirmarNovaSenha.setCustomValidity('')
  statusNovaSenha.textContent = ''
}

for (const botao of document.querySelectorAll('[data-abrir-nova-senha]')) {
  botao.addEventListener('click', () => {
    limparFormularioNovaSenha()
    dialogNovaSenha.showModal()
    novaSenha.focus()
  })
}
for (const id of ['fechar-nova-senha', 'cancelar-nova-senha']) {
  document.getElementById(id).addEventListener('click', () => dialogNovaSenha.close())
}
dialogNovaSenha.addEventListener('close', limparFormularioNovaSenha)
mostrarNovaSenha.addEventListener('change', () => {
  const tipo = mostrarNovaSenha.checked ? 'text' : 'password'
  novaSenha.type = tipo
  confirmarNovaSenha.type = tipo
})
for (const campo of [novaSenha, confirmarNovaSenha]) {
  campo.addEventListener('input', () => {
    confirmarNovaSenha.setCustomValidity('')
    statusNovaSenha.textContent = ''
  })
}
formularioNovaSenha.addEventListener('submit', (evento) => {
  evento.preventDefault()
  confirmarNovaSenha.setCustomValidity(
    novaSenha.value === confirmarNovaSenha.value ? '' : 'As senhas precisam ser iguais.',
  )
  if (!formularioNovaSenha.reportValidity()) return
  limparFormularioNovaSenha()
  dialogNovaSenha.setAttribute('aria-labelledby', 'titulo-confirmacao-nova-senha')
  trocarTela(conteudoNovaSenha, confirmacaoNovaSenha, tituloConfirmacaoNovaSenha)
})

document.querySelector('#concluir-nova-senha').addEventListener('click', () => dialogNovaSenha.close())


// O relógio da sessão determina os lembretes. Pausas não contam para o intervalo.
const dialogCheckin = document.querySelector('#checkin-atencao')
const lembretesCheckin = document.querySelector('#form-configuracoes-paciente').elements.lembretes

function verificarCheckin(tempoAtivo) {
  if (inicioCronometro === null || fimSessao !== null || telaSessao.hidden || tempoAtivo < proximoCheckin) return

  // Avança para o próximo intervalo e evita acumular modais em abas suspensas.
  proximoCheckin = (Math.floor(tempoAtivo / INTERVALO_CHECKIN_MS) + 1) * INTERVALO_CHECKIN_MS
  if (!lembretesCheckin.checked || dialogCheckin.open || document.hidden) return
  if (document.querySelector('dialog[open]')) return

  const tema = telaAcessoPaciente.dataset.bsTheme ?? 'light'
  dialogCheckin.dataset.bsTheme = tema
  dialogCheckin.showModal()
}

for (const botao of dialogCheckin.querySelectorAll('[data-atencao]')) {
  botao.addEventListener('click', () => {
    if (inicioCronometro === null || fimSessao !== null) {
      dialogCheckin.close()
      return
    }
    checkinsSessao.push({
      atencao: botao.dataset.atencao,
      horario: new Date().toISOString(),
      tempoAtivoMs: Math.round(tempoAcumulado + performance.now() - inicioCronometro),
    })
    dialogCheckin.close()
  })
}

document.querySelector('#fechar-checkin').addEventListener('click', () => dialogCheckin.close())


// Credenciais temporárias são exibidas apenas no modal; o backend criará a conta.
const dialogAdicionarPaciente = document.querySelector('#dialog-adicionar-paciente')
const formularioAdicionarPaciente = document.querySelector('#form-adicionar-paciente')
const nomeAdicionarPaciente = document.querySelector('#nome-adicionar-paciente')
const emailAdicionarPaciente = document.querySelector('#email-adicionar-paciente')
const resultadoAdicionarPaciente = document.querySelector('#resultado-adicionar-paciente')
const senhaEntradaPaciente = document.querySelector('#senha-entrada-paciente')
const statusAdicionarPaciente = document.querySelector('#status-adicionar-paciente')

function gerarSenhaEntrada() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  const bytes = crypto.getRandomValues(new Uint8Array(18))
  return Array.from(bytes, (valor) => caracteres[valor & 63]).join('')
}

function renderizarSolicitacoesPacientes() {
  const pendentes = pacientesProfissional.filter((paciente) => !paciente.ativo)
  document.querySelector('#solicitacoes-pacientes').hidden = pendentes.length === 0
  const itens = pendentes.map((paciente) => {
    const bloco = document.createElement('div')
    bloco.className = 'paciente-card'
    const nome = document.createElement('p')
    nome.className = 'fw-bold mb-1'
    nome.textContent = paciente.nome
    const email = document.createElement('p')
    email.className = 'mb-1 text-break'
    email.textContent = paciente.email
    const status = document.createElement('span')
    status.className = 'small'
    status.textContent = 'Aguardando ativação pelo paciente'
    bloco.append(nome, email, status)
    return bloco
  })
  document.querySelector('#lista-solicitacoes-pacientes').replaceChildren(...itens)
}

function limparConvitePaciente() {
  formularioAdicionarPaciente.reset()
  nomeAdicionarPaciente.setCustomValidity('')
  emailAdicionarPaciente.setCustomValidity('')
  senhaEntradaPaciente.value = ''
  document.querySelector('#resumo-adicionar-paciente').textContent = ''
  formularioAdicionarPaciente.hidden = false
  resultadoAdicionarPaciente.hidden = true
  statusAdicionarPaciente.textContent = ''
}

document.querySelector('#adicionar-paciente').addEventListener('click', () => {
  limparConvitePaciente()
  dialogAdicionarPaciente.showModal()
  nomeAdicionarPaciente.focus()
})
for (const id of ['fechar-adicionar-paciente', 'concluir-adicionar-paciente']) {
  document.getElementById(id).addEventListener('click', () => dialogAdicionarPaciente.close())
}
dialogAdicionarPaciente.addEventListener('close', limparConvitePaciente)
formularioAdicionarPaciente.addEventListener('input', () => {
  nomeAdicionarPaciente.setCustomValidity('')
  emailAdicionarPaciente.setCustomValidity('')
})
formularioAdicionarPaciente.addEventListener('submit', (evento) => {
  evento.preventDefault()
  const nome = nomeAdicionarPaciente.value.trim()
  const email = emailAdicionarPaciente.value.trim().toLowerCase()
  nomeAdicionarPaciente.setCustomValidity(nome ? '' : 'Informe o nome do paciente.')
  const existente = pacientesProfissional.some((paciente) => paciente.email?.toLowerCase() === email)
  emailAdicionarPaciente.setCustomValidity(existente ? 'Este e-mail já está cadastrado ou possui uma solicitação pendente.' : '')
  if (!formularioAdicionarPaciente.reportValidity()) return

  let senha
  try {
    senha = gerarSenhaEntrada()
  } catch {
    statusAdicionarPaciente.textContent = 'Não foi possível gerar a senha. Tente novamente.'
    return
  }
  pacientesProfissional.push({
    nome, email, ativo: false,
    ultimaSessao: 'Nenhuma sessão registrada',
    tempoTotal: '0h00min',
    sessoesSemana: 0,
  })
  senhaEntradaPaciente.value = senha
  document.querySelector('#resumo-adicionar-paciente').textContent = nome + ' — ' + email
  renderizarDashboardProfissional()
  trocarTela(formularioAdicionarPaciente, resultadoAdicionarPaciente, document.querySelector('#titulo-resultado-paciente'))
})

document.querySelector('#copiar-senha-paciente').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(senhaEntradaPaciente.value)
    statusAdicionarPaciente.textContent = 'Senha copiada.'
  } catch {
    senhaEntradaPaciente.select()
    statusAdicionarPaciente.textContent = 'Selecione a senha e use Ctrl+C para copiar.'
  }
})
