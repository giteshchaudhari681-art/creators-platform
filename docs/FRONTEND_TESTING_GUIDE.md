# Frontend Testing with React Testing Library

## Why Test Your Frontend at All?

The instinct when learning testing is to focus on the backend. That is where the database calls happen, where business rules live, and where failures often feel more serious. But the frontend has its own class of regressions that backend tests will never catch.

Consider a registration form. The API can still return `201 Created` every time while the user experience is already broken:

- The submit button is no longer disabled during loading, so users can double-submit.
- The validation error for an invalid email disappears after a refactor.
- The loading state never renders, so the interface feels frozen or unsafe to use.

None of those break the server. All of them break the product.

Automated frontend tests catch these regressions before they reach production. They verify that components render correctly, respond to user input, and show the right feedback at the right time. That replaces manual spot checks with something repeatable and fast.

## Manual vs Automated Testing

### Manual Testing in the Browser

- Open the browser each time
- Click through the flow by hand
- Forget edge cases easily
- Slow down as features grow
- Leave no reliable record of expected behavior

### Automated Testing with RTL and Jest

- Run in milliseconds
- Simulate real user input
- Catch regressions on every run
- Scale with the codebase
- Document intended behavior in code

## The Philosophy: Test Like a User

React Testing Library was designed around one core idea: test what the user can perceive and do, not the internals of the component.

That matters because implementation details change constantly. Hooks replace class state. Logic moves into child components. Internal variable names change. If your tests are tightly coupled to those details, refactors become expensive even when the UI still behaves correctly.

RTL pushes tests toward the rendered DOM:

- Query buttons and headings by role
- Query form fields by label
- Query messages by visible text

That keeps the test focused on behavior instead of structure.

> "The more your tests resemble the way your software is used, the more confidence they can give you."

Kent C. Dodds

## Setting Up React Testing Library in This Vite Project

This client uses Vite, so frontend tests need explicit setup. The project now includes:

- `client/jest.config.cjs`
- `client/babel.config.cjs`
- `client/src/setupTests.js`

Install the test dependencies from `client/`:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/preset-react jest-environment-jsdom
```

The `package.json` test script should run Jest directly.

## Your First Tests in This Repo

Two example test files are included:

- `client/src/components/common/LoadingSpinner.test.jsx`
- `client/src/pages/Login.test.jsx`

These cover two useful categories:

- A simple rendering test for a presentational component
- A behavior-focused form test covering validation and successful submission

The login tests use:

- `getByLabelText` for form fields
- `getByRole` for buttons and headings
- `userEvent` for realistic typing and clicking
- mocks for the API client and auth hook

## Query Priority

Prefer queries in this order whenever possible:

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId`

`getByTestId` works, but it should stay a last resort because users do not interact with a `data-testid`.

## Timing Variants

- `getBy*`: use when the element should already exist
- `queryBy*`: use when the element should not exist
- `findBy*`: use when the element appears after async work

## Why the Shared Input Component Was Updated

While wiring these tests, the shared `Input` and `Textarea` components needed a small accessibility fix. Their labels were visible, but they were not programmatically associated with the underlying form controls.

That caused two real problems:

- screen readers would have weaker labeling
- RTL label-based queries would be less reliable

The fix was to connect each label with `htmlFor` and each field with a matching `id`. That is exactly the sort of issue frontend tests are good at surfacing.

## Running the Frontend Tests

From `client/`:

```bash
npm test
```

Run a single file:

```bash
npm test -- Login.test.jsx
```

Run coverage:

```bash
npm test -- --coverage
```

## Common Mistakes to Avoid

- Using `getByTestId` as the first option instead of role or label queries
- Testing implementation details instead of visible behavior
- Using synchronous queries for async UI
- Rendering context-dependent components without the required providers

## Practical Takeaway

Frontend tests are not there to prove React works. They are there to prove that your interface still behaves the way users expect after the next refactor.

That includes:

- visible errors
- loading states
- disabled buttons
- successful form submission
- conditional UI based on auth or data

If the backend is healthy but the user flow is broken, the app is still broken. That is why frontend testing matters.
