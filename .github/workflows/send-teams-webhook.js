const fs = require("fs");
const path = require("path");

const REPORT_PATH =
  process.env.MOCHA_REPORT ||
  "./mochawesome-report/DANILOQA_report.json";

const PAYLOAD_OUTPUT_PATH = path.resolve(
  process.env.PAYLOAD_OUTPUT_PATH ||
    "./mochawesome-report/payload-enviado-Teams.json"
);

const POWER_AUTOMATE_WEBHOOK =
  process.env.POWER_AUTOMATE_WEBHOOK;

async function main() {
  const report = JSON.parse(
    fs.readFileSync(path.resolve(REPORT_PATH), "utf8")
  );

  const stats = report.stats;

  const suites = [];
  const failedTests = [];

  function extractSuites(suiteList) {
    if (!suiteList) return;

    for (const suite of suiteList) {
      suites.push(suite.title);

      if (suite.tests) {
        for (const test of suite.tests) {
          if (test.fail) {
            failedTests.push({
              suite: suite.title,
              test: test.title,
              duration: test.duration,
              error:
                test.err?.message ||
                JSON.stringify(test.err || {})
            });
          }
        }
      }

      if (suite.suites?.length) {
        extractSuites(suite.suites);
      }
    }
  }

  for (const result of report.results) {
    extractSuites(result.suites);
  }

  const github = {
    branch:
      process.env.GITHUB_REF_NAME ||
      process.env.GITHUB_HEAD_REF ||
      "-",

    workflow:
      process.env.GITHUB_WORKFLOW || "-",

    repository:
      process.env.GITHUB_REPOSITORY || "-",

    actor:
      process.env.GITHUB_ACTOR || "-",

    runNumber:
      process.env.GITHUB_RUN_NUMBER || "-",

    sha:
      process.env.GITHUB_SHA || "-",
  };

  const status =
    stats.failures > 0 ? "❌ FALHOU" : "✅ SUCESSO";

  const payload = {
    type: "message",
    attachments: [
      {
        contentType:
          "application/vnd.microsoft.card.adaptive",
        content: {
          $schema:
            "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.5",
          body: [
            {
              type: "TextBlock",
              text: "Cypress E2E Report",
              weight: "Bolder",
              size: "Large"
            },

            {
              type: "FactSet",
              facts: [
                {
                  title: "Status",
                  value: status
                },
                {
                  title: "Branch",
                  value: github.branch
                },
                {
                  title: "Workflow",
                  value: github.workflow
                },
                {
                  title: "Run",
                  value: github.runNumber
                },
                {
                  title: "Repositório",
                  value: github.repository
                },
                {
                  title: "Autor",
                  value: github.actor
                },
                {
                  title: "Commit",
                  value: github.sha.substring(0, 8)
                },
                {
                  title: "Suites",
                  value: `${stats.suites}`
                },
                {
                  title: "Testes",
                  value: `${stats.tests}`
                },
                {
                  title: "Passaram",
                  value: `${stats.passes}`
                },
                {
                  title: "Falharam",
                  value: `${stats.failures}`
                },
                {
                  title: "Duração",
                  value: `${(stats.duration / 1000).toFixed(
                    1
                  )} segundos`
                }
              ]
            },

            {
              type: "TextBlock",
              text: "Suites Executadas",
              weight: "Bolder",
              separator: true
            },

            ...suites.map((s) => ({
              type: "TextBlock",
              text: `• ${s}`,
              wrap: true
            })),

            {
              type: "TextBlock",
              text: "Testes com Falha",
              weight: "Bolder",
              separator: true,
              isVisible: failedTests.length > 0
            },

            ...failedTests.flatMap((f) => [
              {
                type: "TextBlock",
                text: `❌ ${f.suite}`,
                weight: "Bolder",
                wrap: true
              },
              {
                type: "TextBlock",
                text: `Teste: ${f.test}`,
                wrap: true
              },
              {
                type: "TextBlock",
                text: `Erro: ${f.error}`,
                wrap: true
              }
            ])
          ]
        }
      }
    ]
  };

  const payloadJson = JSON.stringify(payload, null, 2);

  fs.mkdirSync(path.dirname(PAYLOAD_OUTPUT_PATH), {
    recursive: true
  });
  fs.writeFileSync(PAYLOAD_OUTPUT_PATH, payloadJson, "utf8");

  console.log(`Payload salvo em: ${PAYLOAD_OUTPUT_PATH}`);

  const response = await fetch(
    POWER_AUTOMATE_WEBHOOK,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payloadJson
    }
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao enviar para o Power Automate (${response.status}), configure seu webhook`
    );
  }

  console.log("Adaptive Card enviado com sucesso!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});