export const getGreeting = () => cy.get('h1');
export const findByText = (text: string) => cy.contains(text);
