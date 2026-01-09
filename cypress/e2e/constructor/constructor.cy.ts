describe('Testing the adding of ingredients, the operation of modals, creating an order', () => {
    beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
    });

    afterEach(() => {
        cy.clearAuthTokens();
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    it('Test: adding ingredients into constructor', () => {
        const ingredientName = 'Биокотлета из марсианской Магнолии';

        cy.get('[data-testid="constructor-ingredients-list"]')
        .should('exist')
        .within(() => {
            cy.get('.constructor-element').should('not.exist');
            cy.contains('Выберите начинку').should('exist');
        });

        cy.addIngredientByName(ingredientName);

        cy.get('[data-testid="constructor-ingredients-list"]')
        .within(() => {
            cy.get('.constructor-element__text')
                .should('contain', ingredientName);
            cy.contains('Выберите начинку').should('not.exist');
        });
    });

    it('Test: modal', () => {
        const ingredientName = 'Краторная булка N-200i';

        cy.get('[data-testid="ingredient-card"]')
            .contains('[data-testid="ingredient-name"]', ingredientName)
            .click();

        cy.get('[data-testid="modal-open"]')
            .should('be.visible')
            .within(() => {
                cy.contains(ingredientName).should('be.visible');
            });

        cy.closeModal();
        cy.get('[data-testid="modal-open"]').should('not.exist');

        cy.get('[data-testid="ingredient-card"]')
            .contains('[data-testid="ingredient-name"]', ingredientName)
            .click();

        cy.get('[data-testid="modal-open"]')
            .should('be.visible')
            .within(() => {
                cy.contains(ingredientName).should('be.visible');
        });

        cy.closeModalByOverlay();
        cy.get('[data-testid="modal-open"]').should('not.exist');

        cy.get('[data-testid="ingredient-card"]')
            .contains('[data-testid="ingredient-name"]', ingredientName)
            .click();

        cy.get('[data-testid="modal-open"]')
            .should('be.visible')
            .within(() => {
                cy.contains(ingredientName).should('be.visible');
            });


        cy.get('body').type('{esc}');
        cy.get('[data-testid="modal-open"]').should('not.exist');
    });

    it('Test: make order', () => {
        cy.setAuthTokens();

        cy.fixture('user.json').then((userData) => {
            cy.intercept('GET', '/api/auth/user', { statusCode: 200, body: userData });
        });
        cy.fixture('order.json').then((orderResp) => {
            cy.intercept('POST', '/api/orders', { statusCode: 200, body: orderResp });
        });

        cy.visit('/');

        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');

        cy.addIngredientByName('Флюоресцентная булка R2-D3');
        cy.addIngredientByName('Биокотлета из марсианской Магнолии');
        cy.addIngredientByName('Филе Люминесцентного тетраодонтимформа');
        cy.addIngredientByName('Говяжий метеорит (отбивная)');

        cy.contains('Выберите начинку').should('not.exist');

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


        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
    });

    describe('Edge cases', () => {
    it('should handle empty constructor when trying to delete', () => {
        cy.get('[data-testid="constructor-ingredients-list"]')
            .find('[data-testid="delete-ingredient"]')
            .should('not.exist');
    });

    it('should not crash when drag-n-drop with invalid indices', () => {
        cy.addIngredientByName('Биокотлета из марсианской Магнолии');
        
        cy.get('[data-testid="constructor-ingredients-list"]')
            .should('exist');
    });
});
});


