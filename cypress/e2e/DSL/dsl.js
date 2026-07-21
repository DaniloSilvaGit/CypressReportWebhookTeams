
class dsl{

    
//Clicar em Botões
    clicar(objtype){
        cy.get(objtype).click({force: true},{timeout: 30000});
    }

    clicarOculto(objtype){
        cy.get(objtype,{ timeout: 20000 }).invoke('show').scrollIntoView().click({force: true});
    }

    clicarContendoText(locator, text) {
        return cy.contains(locator, text,{timeout:10000}).click({force: true});
    
    }
    

//metodo para verificar texto
    text(locator, text) {
        return cy.contains(locator, text,{timeout:10000});
    
    }
//Valida texto presente dentro de um input
    validaTextoInput(locator,text){
        return cy.get(locator).should('have.value',text,{ timeout: 20000 });
    }
    
    naocontem(locator, text) {
        return cy.to.not.equal(locator, text);
    
    }
//
    clicarLink(locator, text) {
        return cy.contains(locator, text).click();
    
    }
//metodo para verificar se um determinado botão está presente na tela
    presencaComponentes(locator) {
        return cy.get(locator).should('be.visible'),{ timeout: 20000 };
       
    }
    presencaComponentesOcultos(locator) {
        return cy.get(locator).invoke('show').should('be.visible'),{ timeout: 20000 };
       
    }
    
//metodo verificar presença de elementos na tela e escreve
    input(objtype, nameobj){
        return cy.get(objtype)
        .should('be.visible')
        .type(nameobj,{delay:0});
    }

    inputOculto(objtype, nameobj){
        return cy.get(objtype)
        .invoke('show')
        .should('be.visible')
        .type(nameobj,{delay:0});
    }

    inputsenha(objtype, nameobj){
        return cy.get(objtype)
        .should('be.visible')
        .type(nameobj,{log:false},{delay:0});
    }

    limpaCampo(objtype){
        return cy.get(objtype).clear()
    }

    //metodo para interagir com combos
    combo(obj, opcao){
        return cy.get(obj)
        .select(opcao,{force: true})
        
    }

    acessarLink(url){
        return cy.visit(url);
        
    }

    adicionaArquivo(objtype,arquivo){
        return cy.get(objtype).scrollIntoView().selectFile(arquivo);

    }

    
    scrollPage(locator){
        cy.scrollTo(locator)

    }

    
    //As funções abaixo utilizam Xpath para os Locators

    clicarXpath(objtype){
        cy.xpath(objtype).click({force: true},{ timeout: 20000});
    }

    clicarXpathOculto(objtype){
        cy.xpath(objtype,{ timeout: 20000 }).invoke('show').scrollIntoView().click({force: true});
    }

    checkboxXpath(objtype){
        cy.xpath(objtype).check();
    }

    //Verifica presença de elemento na tela que contenha determinado texto
    validaTextoXpath(locator,texto){
        return cy.xpath(locator,{timeout: 25000})
        .should('be.visible')
        .contains(texto)

    }

    validaTextoOcultoXpath(locator,texto){
        return cy.xpath(locator,{timeout: 25000})
        //.invoke('show')
        .should('be.visible')
        .contains(texto)
        

    }
    
    clicarOcultoXpath(objtype){
        
        cy.xpath(objtype).invoke('show').scrollIntoView().click({force: true},{ timeout: 20000});
    }

    

    presencaComponentesXpath(locator) {
        return cy.xpath(locator).should('be.visible'),{ timeout: 30000 };
    }

    //verifica se um elemento não esta presente em que contenha determinado texto ( utiliza Xpath )
    ValidaQueElementoNaoExisteXpath(elemento){
        return cy.xpath(elemento).should('not.exist');
        
    }

    //ReadFiles
    ValidaQueArquivoFoiBaixado(caminhoArquivo){
        cy.readFile(caminhoArquivo)
            .should('exist')
    }

    //Marcar e desamrcar Checkbox
    marcarCheckbox(locator){
        cy.get(locator)
          .check(); //{force: true}
    }

    ExecutaQuery(query){
        return cy.task(tarefa,query).then((response) => {
            return response[0];
        }
        
    )}

}


export default dsl;
