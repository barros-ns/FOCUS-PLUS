# FOCUS+

Protótipo web de apoio ao acompanhamento da rotina de pessoas com TDAH. A versão atual usa JavaScript, Bootstrap e Vite.

## Como rodar localmente

Instale o [Git](https://git-scm.com/downloads) e o [Node.js 24 LTS](https://nodejs.org/en/download), que inclui o npm.

```bash
git clone https://github.com/barros-ns/FOCUS-PLUS.git
cd FOCUS-PLUS
npm ci
npm run dev
```

Abra no navegador o endereço exibido em **Local** no terminal, normalmente `http://localhost:5173`.

Se o PowerShell bloquear o arquivo `npm.ps1`, use `npm.cmd ci` e `npm.cmd run dev`.

## Como testar o fluxo do paciente

1. Na página inicial, selecione **Começar → Paciente**.
2. Preencha o login com um e-mail válido no formato e uma senha fictícia, como `maria@example.com` e `demonstracao123`.
3. Passe pelo consentimento, pela explicação do monitoramento, pela prévia da câmera e pela configuração de telas.
4. Na área do paciente, selecione **Começar checklist**, responda às sete perguntas e confira o resumo.

O fluxo usa dados de demonstração. Você pode rodá-lo sem conta Supabase ou arquivo `.env`. A autenticação, a câmera e a persistência dos registros ainda aguardam integração.

## Testar o build

```bash
npm run build
npm run preview
```

O build gera os arquivos em `dist/`. O comando `preview` serve essa versão localmente para conferência.
