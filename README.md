# QA Engineer Portfolio: Automação E2E com Cypress

Bem-vindo ao meu repositório de portfólio focado em Engenharia de Qualidade de Software! Este projeto foi desenvolvido para demonstrar práticas modernas de testes automatizados de ponta a ponta (E2E), garantindo a estabilidade, confiabilidade e performance de aplicações web.

---

## Tecnologias Utilizadas

*   **Cypress:** Framework de testes automatizados rápido, fácil e executado diretamente no navegador.
*   **JavaScript / TypeScript:** Linguagem base para a construção dos scripts.
*   **Design Pattern (Page Objects):** Padrão de projeto utilizado para desacoplar a lógica dos testes da estrutura das páginas.

---

## Arquitetura e Padrão de Projeto (Page Objects)

Para garantir que a suíte de testes seja sustentável a longo prazo, adotei o padrão **Page Object Model (POM)**. 

### Por que usar Page Objects?
*   **Reutilização de Código:** Elementos e interações visuais são definidos apenas uma vez. Se o botão de login mudar de ID, eu só preciso alterar em um único arquivo, e não em dezenas de testes.
*   **Legibilidade:** Os arquivos de especificação (`.spec.js` ou `.cy.js`) ficam limpos e focados no comportamento do usuário, parecendo uma documentação viva.

### Estrutura do Projeto
```text
├── cypress/
│   ├── e2e/               # Os cenários de teste reais (o "o que" testar)
│   │   ├── login.cy.js
│   │   └── checkout.cy.js
│   ├── pages/             # As classes do Page Objects (o "como" interagir)
│   │   ├── LoginPage.js
│   │   └── CheckoutPage.js
│   ├── support/           # Configurações globais e comandos customizados
└── cypress.config.js      # Arquivo de configuração do Cypress
 Exemplo Prático de Código
Veja como a estrutura fica limpa ao separar a página do teste em si:

1. A Classe da Página (pages/LoginPage.js)
JavaScript
class LoginPage {
  // Mapeamento dos elementos (Locators)
  get inputEmail() { return cy.get('#email-input'); }
  get inputPassword() { return cy.get('#password-input'); }
  get btnSubmit() { return cy.get('#login-button'); }

  // Ações na página
  preencherLogin(email, password) {
    this.inputEmail.type(email);
    this.inputPassword.type(password);
  }

  enviarFormulario() {
    this.btnSubmit.click();
  }
}

export default new LoginPage();
2. O Cenário de Teste (e2e/login.cy.js)
JavaScript
import LoginPage from '../pages/LoginPage';

describe('Funcionalidade: Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Deve realizar login com sucesso usando credenciais válidas', () => {
    LoginPage.preencherLogin('qa.tester@email.com', 'SenhaSegura123');
    LoginPage.enviarFormulario();
    
    // Validação (Assertion)
    cy.url().should('include', '/dashboard');
  });
});

Como Executar o Projeto
Se você quiser rodar este projeto localmente na sua máquina, siga os passos abaixo:

Pré-requisitos
Node.js (versão 18 ou superior)

NPM ou Yarn

Cypress 

Passo a Passo
Clone o repositório:

Bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
cd SEU_REPOSITORIO
Instale as dependências:

Bash
npm install
Abra o Cypress (Interface Gráfica):

Bash
npm run cy:open
(Ou utilize npx cypress open caso prefira)

Execute em modo Headless (No terminal):

Bash
npm run cy:run

-Boas Práticas Aplicadas neste Projeto
Evitar seletores frágeis: Foco em utilizar atributos de dados como data-cy ou data-testid sempre que possível.

-Independência de testes: Cada teste limpa o estado ou roda de forma isolada, sem depender do sucesso do teste anterior.

-Ganchos de ciclo de vida (Hooks): Uso correto de beforeEach para otimizar o fluxo de navegação.

Vamos conversar?
Estou sempre aberto a feedbacks, networking e novas oportunidades na área de QA e Automação de Testes!

LinkedIn: Seu Nome ou Link do Perfil

E-mail: [seu.email@exemplo.com]