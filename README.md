# Cypress Report Webhook Teams

Este projeto usa Cypress para executar testes E2E e envia um resumo dos resultados para o Power Automate do Teams via webhook.

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd CypressReportWebhookTeams
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

## Dependências principais

O projeto utiliza:

- Cypress
- Mochawesome
- cypress-mochawesome-reporter
- cypress-multi-reporters
- mocha
- mochawesome-merge
- mochawesome-report-generator

Essas dependências estão definidas no arquivo package.json.

## Como executar os testes

Para abrir o Cypress localmente:

```bash
npm run cy:open
```

Para executar os testes no modo headless:

```bash
npm run test
```

## Funcionamento do send-teams-webhook.js

O arquivo [.github/workflows/send-teams-webhook.js](.github/workflows/send-teams-webhook.js) é responsável por ler o arquivo JSON gerado pelo relatório do Cypress, montar um payload no formato Adaptive Card e enviá-lo para o webhook do Power Automate.

### Fluxo do script

1. Lê o relatório JSON gerado pelo Cypress.
2. Extrai métricas como:
   - quantidade de suites
   - quantidade de testes
   - testes aprovados
   - testes falhados
   - duração da execução
3. Monta um payload com essas informações.
4. Salva o payload em um arquivo JSON local, por exemplo:
   - [mochawesome-report/payload-enviado-Teams.json](mochawesome-report/payload-enviado-Teams.json)
5. Envia o payload para o webhook configurado.

### Variáveis de ambiente

O script usa as seguintes variáveis:

- POWER_AUTOMATE_WEBHOOK: URL do webhook do Power Automate
- MOCHA_REPORT: caminho do arquivo JSON do relatório, se quiser substituir o padrão
- PAYLOAD_OUTPUT_PATH: caminho onde o payload será salvo localmente

Exemplo de execução:

```bash
POWER_AUTOMATE_WEBHOOK="sua-url" node .github/workflows/send-teams-webhook.js
```

## Observação

O script espera que o relatório do Cypress já tenha sido gerado antes da execução.