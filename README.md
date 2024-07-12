# Playwright Automation with Chain of Responsibility

This project demonstrates a flexible web automation framework using Playwright and the Chain of Responsibility design pattern. It's built with TypeScript and uses Vitest for testing.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (version 14 or later)
- pnpm (version 6 or later)

If you don't have pnpm installed, you can install it globally using npm:

```
npm install -g pnpm
```

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/knguyen30111/playwright-cor.git
   cd playwright-cor
   ```

2. Install the dependencies:

   ```
   pnpm install
   ```

3. Install browser

   ```
   pnpm exec playwright install
   ```

## Project Structure

```
playwright-cor/
├── src/
│   ├── index.ts
│   └── index.test.ts
├── vitest.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

## Running the Automation

To run the automation script:

```
pnpm start
```

This will execute the `automation.ts` file using ts-node.

## Running Tests

To run the tests:

```
pnpm test
```

To run tests with the Vitest UI:

```
pnpm run test:ui
```

To generate a coverage report:

```
pnpm run coverage
```

## Modifying the Automation

The automation is built using a Chain of Responsibility pattern. To modify the automation:

1. Create new handler classes in `automation.ts` by extending the `BaseHandler` class.
2. Implement the `handle` method in your new handler classes.
3. In the `main` function, add your new handlers to the `handlers` array.

Example:

```typescript
class MyNewHandler extends BaseHandler {
  public async handle(context: AutomationContext): Promise<AutomationContext> {
    // Your handling logic here
    return context;
  }
}

// In the main function
const handlers: Handler[] = [
  // ... other handlers
  new MyNewHandler(),
  // ... other handlers
];
```

## Adding Tests

When adding new functionality, make sure to add corresponding tests in `automation.test.ts`. Use the existing tests as a guide for structure and mocking.
