declare namespace Cypress {
  interface Chainable {
    addIngredientByName(ingredientName: string): Chainable<void>;
    closeModal(): Chainable<void>;
    closeModalByOverlay(): Chainable<void>;
  }
}
