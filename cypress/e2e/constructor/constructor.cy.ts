describe('Testing the adding of ingredients, the operation of modals, creating an order', () => {
    beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
    });

    it('Test: adding ingredients into constructor', () => {
        const ingredientName = 'Биокотлета из марсианской Магнолии';

        cy.addIngredientByName(ingredientName);

        cy.get('[data-testid="constructor-ingredients-list"] .constructor-element__text').contains(ingredientName)
    });

    it('Test: modal', () => {
        const ingredientName = 'Краторная булка N-200i';

        cy.get('[data-testid="ingredient-card"]')
            .contains('[data-testid="ingredient-name"]', ingredientName)
            .click();

        cy.get('[data-testid="modal-open"]').should('be.visible');

        cy.closeModal();

        cy.get('[data-testid="ingredient-card"]')
            .contains('[data-testid="ingredient-name"]', ingredientName)
            .click();

        cy.closeModalByOverlay();
    });

    it('Test: make order', () => {
        cy.fixture('login.json').then((loginData) => {
            cy.setCookie('accessToken', loginData.accessToken);
            window.localStorage.setItem('refreshToken', loginData.refreshToken);
        });

        cy.fixture('user.json').then((userData) => {
            cy.intercept('GET', '/api/auth/user', { statusCode: 200, body: userData });
        });
        cy.fixture('order.json').then((orderResp) => {
            cy.intercept('POST', '/api/orders', { statusCode: 200, body: orderResp });
        });

        cy.visit('/');
        cy.addIngredientByName('Флюоресцентная булка R2-D3');
        cy.addIngredientByName('Биокотлета из марсианской Магнолии');
        cy.addIngredientByName('Филе Люминесцентного тетраодонтимформа');
        cy.addIngredientByName('Говяжий метеорит (отбивная)');
        cy.get('[data-testid="make-order"]')
            .click();

        cy.get('[data-testid="modal-open"]')
            .should('be.visible')
            .within(() => {
            cy.contains(`идентификатор заказа`);
            cy.get('[data-testid="order-number"]').should('have.text', '99999');
            });
        cy.get('[data-testid="modal-close-button"]').click();

        cy.get('[data-testid="modal-open"]').should('not.exist');

        cy.get('[data-testid="constructor-ingredients-list"]').should('not.have.descendants');
    });
});
