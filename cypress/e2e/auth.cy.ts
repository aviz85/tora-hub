describe('Authentication Flow', () => {
  beforeEach(() => {
    // Intercept and mock auth endpoints
    cy.intercept('POST', '*/auth/v1/token*', {
      statusCode: 200,
      body: {
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
        },
      },
    }).as('loginRequest');
    
    cy.intercept('POST', '*/auth/v1/signup*', {
      statusCode: 200,
      body: {
        id: 'mock-user-id',
        email: 'test@example.com',
      },
    }).as('signupRequest');
  });
  
  it('should navigate to login page', () => {
    cy.visit('/');
    cy.contains('התחבר').click();
    cy.url().should('include', '/login');
    cy.get('h1').should('contain', 'התחברות');
  });
  
  it('should navigate to signup page', () => {
    cy.visit('/');
    cy.contains('הצטרפו עכשיו').click();
    cy.url().should('include', '/signup');
    cy.get('h1').should('contain', 'הרשמה');
  });
  
  it('should show validation errors on login form', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    
    // Should prevent form submission (HTML5 validation)
    cy.url().should('include', '/login');
  });
  
  it('should submit login form with valid credentials', () => {
    cy.visit('/login');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@loginRequest');
    // After successful login, user should be redirected to home
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
  
  it('should validate password match on signup form', () => {
    cy.visit('/signup');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('differentpassword');
    cy.get('button[type="submit"]').click();
    
    // Should show password mismatch error
    cy.contains('הסיסמאות אינן תואמות').should('be.visible');
  });
  
  it('should submit signup form with valid data', () => {
    cy.visit('/signup');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.wait('@signupRequest');
    // Should show success message
    cy.contains('נשלח אליך מייל לאימות החשבון').should('be.visible');
  });
}); 