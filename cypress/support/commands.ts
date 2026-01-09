/// <reference types="cypress" />

Cypress.Commands.add('addIngredientByName', (ingredientName: string) => {
  cy.get('[data-testid="ingredient-card"]')
    .contains(ingredientName)
    .parents('[data-testid="ingredient-card"]')
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
});

Cypress.Commands.add('closeModal', () => {
  cy.get('[data-testid="modal-close-button"]').click();
  cy.get('[data-testid="modal-open"]').should('not.exist');
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-testid="modal-overlay"]').click({ force: true });
  cy.get('[data-testid="modal-open"]').should('not.exist');
});
