const https = require("https");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const webhookUrl = process.env.TEAMS_WEBHOOK_URL;

const reportPath = "mochawesome-report/DANILOQA_report.json";
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const PAYLOAD_OUTPUT_PATH = path.resolve(
    process.env.PAYLOAD_OUTPUT_PATH ||
    "./mochawesome-report/payload-enviado-Teams.json"
);


function formatDuration(ms) {
    if (!ms) return "0:00";

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getAllTests(suite) {
    let tests = suite.tests || [];

    if (suite.suites) {
        suite.suites.forEach(child => {
            tests = tests.concat(getAllTests(child));
        });
    }

    return tests;
}

const branch = process.env.GITHUB_REF_NAME || "main";

const requestedFor = process.env.GITHUB_ACTOR || "GitHub Actions";

const runReason = process.env.GITHUB_EVENT_NAME || "workflow_dispatch";

const repository = process.env.GITHUB_REPOSITORY;

const runId = process.env.GITHUB_RUN_ID;

const server = process.env.GITHUB_SERVER_URL || "https://github.com";

const logsUrl = `${server}/${repository}/actions/runs/${runId}`;

const artifactsUrl = logsUrl;

const execucao = new Date(report.stats.start).toLocaleString("pt-BR");

const duracao = formatDuration(report.stats.duration);

const total = report.stats.tests;

const passaram = report.stats.passes;

const falharam = report.stats.failures;

const pendentes = report.stats.pending;

const specList = (report.results || []).map(result => {

    const spec = result.file
        ? result.file.split(/[\\/]/).pop().replace(".cy.js", "")
        : "Spec";

    const allTests = (result.suites || []).flatMap(getAllTests);

    const failures = allTests.filter(t => t.fail).length;

    return {
        type: "TextBlock",
        text: failures ? `❌ ${spec}` : `✅ ${spec}`,
        color: failures ? "attention" : "good",
        wrap: true,
        weight: "Bolder"
    };

});

const payload = {
    type: "message",
    attachments: [
        {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                type: "AdaptiveCard",
                version: "1.5",
                body: [

                    {
                        type: "TextBlock",
                        text: "Report Execução Cypress",
                        size: "Large",
                        weight: "Bolder"
                    },

                    {
                        type: "FactSet",
                        facts: [
                            {
                                title: "Repositório",
                                value: repository
                            },
                            {
                                title: "Branch",
                                value: branch
                            },
                            {
                                title: "Executado por",
                                value: requestedFor
                            },
                            {
                                title: "Evento",
                                value: runReason
                            },
                            {
                                title: "Execução",
                                value: execucao
                            },
                            {
                                title: "Duração",
                                value: duracao
                            }
                        ]
                    },

                    {
                        type: "TextBlock",
                        text: "Resumo",
                        weight: "Bolder",
                        spacing: "Medium"
                    },

                    {
                        type: "FactSet",
                        facts: [
                            {
                                title: "Total",
                                value: total.toString()
                            },
                            {
                                title: "✅ Passaram",
                                value: passaram.toString()
                            },
                            {
                                title: "❌ Falharam",
                                value: falharam.toString()
                            },
                            {
                                title: "⚠️ Skipped",
                                value: pendentes.toString()
                            }
                        ]
                    },

                    {
                        type: "TextBlock",
                        text: "Specs executadas",
                        weight: "Bolder",
                        separator: true,
                        spacing: "Medium"
                    },

                    ...specList

                ],

                actions: [

                    {
                        type: "Action.OpenUrl",
                        title: "📄 Ver Logs",
                        url: logsUrl
                    },

                    {
                        type: "Action.OpenUrl",
                        title: "📦 Ver Artefatos",
                        url: artifactsUrl
                    }

                ]
            }
        }
    ]
};

const data = JSON.stringify(payload);

const payloadJson = JSON.stringify(payload, null, 2);

fs.mkdirSync(path.dirname(PAYLOAD_OUTPUT_PATH), {
    recursive: true
});
fs.writeFileSync(PAYLOAD_OUTPUT_PATH, payloadJson, "utf8");

console.log(`Payload salvo em: ${PAYLOAD_OUTPUT_PATH}`);

//Pulando envio do payload caso webhook não esteja configurado
//Mas ainda sim salvando o Payload
if (!webhookUrl) {
    console.log(
        "TEAMS_WEBHOOK_URL não configurado. Pulando envio do payload."
    );
    process.exit(0);
}
//



const url = new URL(webhookUrl);

const req = https.request({

    hostname: url.hostname,

    path: url.pathname + url.search,

    method: "POST",

    headers: {

        "Content-Type": "application/json",

        "Content-Length": Buffer.byteLength(data)

    }

}, res => {

    console.log(`Status: ${res.statusCode}`);

    res.on("data", d => process.stdout.write(d));

});

req.on("error", console.error);

req.write(data);

req.end();