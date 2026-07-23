# Cypress Report Webhook Teams

Este projeto utiliza **Cypress** para executar testes automatizados (E2E, funcionais, API,etc) e **Node.js** para processar o relatório de execução e enviar um resumo dos resultados para o **Microsoft Teams** por meio de um webhook do **Power Automate**.

O objetivo é fornecer **visibilidade**, **rastreabilidade** e **feedback rápido** sobre as execuções dos testes automatizados para todos os stakeholders envolvidos no projeto.

<img width="522" height="491" alt="image" src="https://github.com/user-attachments/assets/1df1f28e-e3cc-4ff2-8fc5-f8e4255a80bc" />


---

# Tecnologias

| Tecnologia | Finalidade |
|------------|------------|
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/cypress.svg" width="20"/> Cypress | Automação E2E |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nodedotjs.svg" width="20"/> Node.js | Processamento do relatório |
| 📊 Mochawesome | Geração do relatório |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/microsoftpowerautomate.svg" width="20"/> Power Automate | Recebimento do Webhook |
| <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/microsoftteams.svg" width="20"/> Microsoft Teams | Exibição das notificações |

---

# Fluxo da solução

```text
Cypress
    │
    ▼
Mochawesome Report (JSON)
    │
    ▼
send-teams-webhook.js
    │
    ├── Gera payload-enviado-Teams.json
    │
    ▼
Power Automate (Webhook)
    │
    ▼
Microsoft Teams
```

---

# Requisitos

- Node.js 18 ou superior
- npm 9 ou superior

---

# Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd CypressReportWebhookTeams
```

2. Instale as dependências:

```bash
npm install
```

---

# Estrutura do projeto

```text
.
├── cypress/
├── mochawesome-report/
├── .github/
│   └── workflows/
│       └── send-teams-webhook.js
├── package.json
└── README.md
```

---

# Dependências principais

O projeto utiliza as seguintes bibliotecas:

- Cypress
- Mochawesome
- cypress-mochawesome-reporter
- cypress-multi-reporters
- mocha
- mochawesome-merge
- mochawesome-report-generator

Todas as dependências estão definidas no arquivo **package.json**.

---

# Como executar os testes

### Abrir o Cypress em modo interativo (não gera o relatório)

```bash
npm run cy:open
```

### Executar os testes em modo headless (gera o relatório Mochawesome)

```bash
npx cypress run
```

### Gerar e/ou enviar manualmente o payload para o Teams

```bash
node .github/workflows/send-teams-webhook.js
```

Caso deseje informar o webhook manualmente:

```bash
POWER_AUTOMATE_WEBHOOK="sua-url" node .github/workflows/send-teams-webhook.js
```

---

# Funcionamento do send-teams-webhook.js

O arquivo `.github/workflows/send-teams-webhook.js` é responsável por ler o relatório JSON gerado pelo Mochawesome, montar um payload no formato **Adaptive Card** e enviá-lo ao Power Automate.
O fluxo atual pega variaveis do GitHub, mas pode ser adaptado para outras pipelines de CI/CD.

## Fluxo do script

1. Lê o relatório JSON gerado pelo Cypress.
2. Extrai as principais métricas da execução, como:
   - Quantidade de suítes
   - Quantidade de testes
   - Testes aprovados
   - Testes com falha
   - Duração da execução
3. Monta um payload no formato Adaptive Card.
4. Salva o payload localmente para facilitar validações.
5. Envia o payload para o webhook do Power Automate, quando configurado.

---

# Variáveis de ambiente

O script utiliza as seguintes variáveis:

| Variável | Descrição |
|----------|-----------|
| `TEAMS_WEBHOOK_URL` | URL do webhook do Power Automate. |
| `MOCHA_REPORT` | Caminho do arquivo JSON do Mochawesome (opcional). |
| `PAYLOAD_OUTPUT_PATH` | Caminho onde o payload será salvo localmente (opcional). |

---

# Arquivos gerados

Após a execução do script, será gerado um arquivo semelhante a:

```
mochawesome-report/payload-enviado-Teams.json
```

Esse arquivo contém o payload enviado (ou que seria enviado) ao Power Automate e pode ser utilizado para validações e testes locais.

---

# Comportamento sem webhook configurado

Caso a variável `POWER_AUTOMATE_WEBHOOK` não esteja configurada, o script **não tentará enviar a notificação ao Teams**.

Nesse cenário, ele apenas:

- Processa o relatório Mochawesome;
- Gera o payload Adaptive Card;
- Salva o arquivo `payload-enviado-Teams.json`;
- Finaliza a execução normalmente.

Esse comportamento permite validar o payload localmente sem depender de uma integração configurada.

---

# Testando o Adaptive Card

O arquivo `payload-enviado-Teams.json` contém apenas o conteúdo da propriedade **body** do Adaptive Card.

Para visualizar o cartão antes do envio, utilize o **Adaptive Cards Designer**. https://adaptivecards.microsoft.com/designer

Modelo de exemplo:

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    // Conteúdo gerado em payload-enviado-Teams.json
  ]
}
```

---

# Documentação de apoio

- Microsoft Power Automate

  https://learn.microsoft.com/pt-br/power-automate/

- Adaptive Cards

  https://learn.microsoft.com/pt-br/power-automate/create-adaptive-cards

- Adaptive Cards Designer

  https://adaptivecards.microsoft.com/designer
