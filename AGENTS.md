# תורה האב (Tora Hub) SWE Testing Guide

This guide provides instructions for engineers working on the Tora Hub project, focusing on testing procedures to follow after making modifications.

## Project Overview

Tora Hub is a Torah-focused social network built with:
- Next.js 15.3.2
- React 19
- TypeScript
- Supabase (Auth, Database)
- Tailwind CSS

The application allows users to:
- Create accounts and manage profiles
- Browse Torah sources
- Share insights and commentaries
- Engage in discussions

## Testing Workflow

Always follow this testing workflow after making changes:

1. **Unit Tests**: Run Jest tests first to verify components and functions
2. **E2E Tests**: Run Cypress tests to check critical user flows 
3. **Manual Testing**: Verify specific functionality through manual testing

## Running Tests

### Jest Unit Tests

Jest tests verify individual components, pages, and utilities:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Cypress E2E Tests

Cypress tests verify end-to-end user flows:

```bash
# Open Cypress UI
npx cypress open

# Run all tests headlessly
npx cypress run --spec "cypress/e2e/*.cy.ts" --headless
```

## Test Structure

### Unit Tests 

Unit tests are organized by component type:
- `__tests__/components/`: Component tests
- `__tests__/pages/`: Page component tests

Example unit test structure:
```typescript
describe('Component Name', () => {
  beforeEach(() => {
    // Setup code, reset mocks
  });

  it('should do something specific', () => {
    // Test code
  });
});
```

### E2E Tests

E2E tests are in `cypress/e2e/` directory:
- `auth.cy.ts`: Authentication flows
- `sources.cy.ts`: Source browsing and interaction

## Mocking

For tests relying on Supabase, use the global mocks defined in `jest.setup.js`:

```typescript
// Example of using global mocks
global.mockSignUp.mockResolvedValue({ data: {}, error: null });
```

When testing components with auth requirements, ensure you're properly mocking:
- Authentication state
- Database queries
- User sessions

## Test Artifacts and Version Control

### Ignoring Generated Files

When running tests, especially Cypress tests, several artifacts are generated that should not be committed to version control:

1. **Screenshot files**: Cypress automatically captures PNG screenshots for failed tests
   - These are stored in `cypress/screenshots/`
   - Add `cypress/screenshots/` to `.gitignore`

2. **Video recordings**: Cypress can record videos of test runs
   - These are stored in `cypress/videos/`
   - Add `cypress/videos/` to `.gitignore`

3. **Coverage reports**: Jest generates coverage reports
   - These are stored in `coverage/`
   - Add `coverage/` to `.gitignore`

### .gitignore Configuration

Ensure your `.gitignore` file includes these entries:

```
# Test artifacts
cypress/screenshots/
cypress/videos/
coverage/
.nyc_output/
```

This prevents large binary files from bloating the repository and keeps the focus on actual code changes.

## Common Issues and Troubleshooting

### TypeScript Errors with Jest

If you see TypeScript errors related to Jest matchers (like `toBeInTheDocument`):
1. Check `types/jest-dom.d.ts` to ensure proper type definitions
2. Make sure `tsconfig.json` includes the type declarations

### Cypress Network Errors

When Cypress tests fail with timeout errors waiting for intercepted requests:
1. Check that your intercept patterns match the actual API calls
2. Ensure the app is properly mocking Supabase responses in test environment
3. For local development, you may need to run the app (`npm run dev`) alongside Cypress

### React Act Warnings

If you see "not wrapped in act(...)" warnings:
1. Make sure async operations in tests are properly handled
2. Use `waitFor` or `act` to wrap state updates
3. Mock promises to resolve immediately in tests

## Best Practices

1. **Test isolation**: Each test should be independent and not affect others
2. **Meaningful assertions**: Test behavior, not implementation details
3. **Mock external dependencies**: Always mock Supabase and other external services
4. **Test RTL support**: Verify Hebrew text renders correctly
5. **Run tests before commits**: Always run tests before submitting changes
6. **Update tests with code**: When modifying components, update related tests

## Project-Specific Testing Notes

### Authentication Testing
When testing authentication:
- Mock Supabase auth methods (`signUp`, `signInWithPassword`)
- Test form validation (password matching, length requirements)
- Verify redirects and error messages

### Content Interactions
When testing source/insight interactions:
- Mock database queries for content retrieval
- Test rendering of Hebrew text properly
- Verify user-specific actions (likes, comments) are properly guarded

## Recommended Testing Extensions

For VS Code users:
- Jest Runner: Run individual tests from the editor
- Cypress Helper: Easily create and debug Cypress tests 