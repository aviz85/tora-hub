describe('Sources and Insights', () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept('GET', '*/auth/v1/user', {
      statusCode: 200,
      body: {
        id: 'mock-user-id',
        email: 'test@example.com',
      },
    });
    
    cy.intercept('GET', '*/rest/v1/sources*', {
      statusCode: 200,
      body: [
        {
          id: 'source-1',
          title: 'בראשית א',
          content: 'בראשית ברא אלהים את השמים ואת הארץ.',
          category: 'תנ"ך',
          created_at: '2023-01-01T00:00:00.000Z',
        },
        {
          id: 'source-2',
          title: 'משנה אבות',
          content: 'משה קיבל תורה מסיני ומסרה ליהושע, ויהושע לזקנים, וזקנים לנביאים, ונביאים מסרוה לאנשי כנסת הגדולה.',
          category: 'משנה',
          created_at: '2023-01-02T00:00:00.000Z',
        },
      ],
    }).as('getSources');
    
    cy.intercept('GET', '*/rest/v1/sources?id=eq.source-1*', {
      statusCode: 200,
      body: {
        id: 'source-1',
        title: 'בראשית א',
        content: 'בראשית ברא אלהים את השמים ואת הארץ.',
        category: 'תנ"ך',
        created_at: '2023-01-01T00:00:00.000Z',
      },
    }).as('getSource');
    
    cy.intercept('GET', '*/rest/v1/insights*', {
      statusCode: 200,
      body: [
        {
          id: 'insight-1',
          content: 'פירוש רש"י: בראשית - בשביל התורה שנקראת ראשית דרכו.',
          user_id: 'user-1',
          source_id: 'source-1',
          created_at: '2023-01-03T00:00:00.000Z',
          profiles: {
            id: 'user-1',
            username: 'rashi',
            display_name: 'רש"י',
          },
        },
      ],
    }).as('getInsights');
    
    cy.intercept('POST', '*/rest/v1/insights*', {
      statusCode: 201,
      body: {
        id: 'new-insight',
        content: 'זהו פירוש חדש שלי.',
        user_id: 'mock-user-id',
        source_id: 'source-1',
        created_at: new Date().toISOString(),
      },
    }).as('postInsight');
    
    // Mock profile
    cy.intercept('GET', '*/rest/v1/profiles*', {
      statusCode: 200,
      body: {
        id: 'mock-user-id',
        username: 'testuser',
        display_name: 'משתמש בדיקה',
        bio: 'זהו חשבון בדיקה',
      },
    }).as('getProfile');
  });
  
  it('should display sources on sources page', () => {
    cy.visit('/sources');
    cy.wait('@getSources');
    
    cy.contains('מקורות תורניים').should('be.visible');
    cy.contains('בראשית א').should('be.visible');
    cy.contains('משנה אבות').should('be.visible');
  });
  
  it('should filter sources by category', () => {
    cy.intercept('GET', '*/rest/v1/sources?category=eq.תנ"ך*', {
      statusCode: 200,
      body: [
        {
          id: 'source-1',
          title: 'בראשית א',
          content: 'בראשית ברא אלהים את השמים ואת הארץ.',
          category: 'תנ"ך',
          created_at: '2023-01-01T00:00:00.000Z',
        },
      ],
    }).as('getFilteredSources');
    
    cy.visit('/sources');
    cy.wait('@getSources');
    
    // Click on category filter
    cy.contains('תנ"ך').click();
    cy.wait('@getFilteredSources');
    
    // Should show only Torah sources
    cy.contains('בראשית א').should('be.visible');
    cy.contains('משנה אבות').should('not.exist');
  });
  
  it('should display source details and insights', () => {
    cy.visit('/sources/source-1');
    cy.wait(['@getSource', '@getInsights']);
    
    cy.contains('בראשית א').should('be.visible');
    cy.contains('בראשית ברא אלהים').should('be.visible');
    cy.contains('חידושים ופירושים').should('be.visible');
    cy.contains('פירוש רש"י').should('be.visible');
  });
  
  it('should allow adding an insight when logged in', () => {
    // Mock authentication session
    cy.intercept('GET', '*/auth/v1/session', {
      statusCode: 200,
      body: {
        access_token: 'mock-token',
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
        },
      },
    }).as('getSession');
    
    cy.visit('/sources/source-1');
    cy.wait(['@getSource', '@getInsights', '@getSession']);
    
    // Add new insight
    cy.get('textarea#newInsight').type('זהו פירוש חדש שלי.');
    cy.contains('פרסם חידוש').click();
    cy.wait('@postInsight');
    
    // New insight should be added to the page
    cy.contains('זהו פירוש חדש שלי.').should('be.visible');
  });
  
  it('should show login message for non-authenticated users', () => {
    // Mock empty session
    cy.intercept('GET', '*/auth/v1/session', {
      statusCode: 200,
      body: {
        user: null,
      },
    }).as('getSession');
    
    cy.visit('/sources/source-1');
    cy.wait(['@getSource', '@getInsights', '@getSession']);
    
    // Should show login message
    cy.contains('עליך להתחבר כדי לפרסם חידושים').should('be.visible');
    cy.contains('התחבר').should('be.visible');
  });
}); 