import { describe, it, expect, vi, beforeEach } from "vitest";
import { Browser, Page } from "playwright";
import {
  AutomationContext,
  BrowserLaunchHandler,
  NavigationHandler,
  DataExtractionHandler,
  DataProcessingHandler,
  BrowserCloseHandler,
  runAutomation,
} from "./index";

// Mock Playwright
vi.mock("playwright", () => ({
  chromium: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        goto: vi.fn().mockResolvedValue(null),
        url: vi.fn().mockReturnValue("https://example.com"),
        title: vi.fn().mockResolvedValue("Example Domain"),
        $eval: vi.fn().mockResolvedValue("Welcome to example.com"),
      }),
    }),
  },
}));

describe("Automation Handlers", () => {
  let context: AutomationContext;

  beforeEach(() => {
    context = new AutomationContext();
  });

  it("BrowserLaunchHandler launches browser and creates page", async () => {
    const handler = new BrowserLaunchHandler();
    await handler.handle(context);
    expect(context.browser).toBeDefined();
    expect(context.page).toBeDefined();
  });

  it("NavigationHandler navigates to specified URL", async () => {
    const handler = new NavigationHandler("https://example.com");
    context.page = {
      goto: vi.fn(),
      url: vi.fn().mockReturnValue("https://example.com"),
    } as unknown as Page;
    await handler.handle(context);
    expect(context.page.goto).toHaveBeenCalledWith("https://example.com");
    expect(context.data.url).toBe("https://example.com");
  });

  it("DataExtractionHandler extracts title and heading", async () => {
    const handler = new DataExtractionHandler();
    context.page = {
      title: vi.fn().mockResolvedValue("Example Domain"),
      $eval: vi.fn().mockResolvedValue("Welcome to example.com"),
    } as unknown as Page;
    await handler.handle(context);
    expect(context.data.title).toBe("Example Domain");
    expect(context.data.headingText).toBe("Welcome to example.com");
  });

  it("DataProcessingHandler processes extracted data", async () => {
    const handler = new DataProcessingHandler();
    context.data = {
      title: "Example Domain",
      headingText: "Welcome to example.com",
    };
    await handler.handle(context);
    expect(context.data.processedTitle).toBe("EXAMPLE DOMAIN");
    expect(context.data.wordCount).toBe(3);
  });

  it("BrowserCloseHandler closes the browser", async () => {
    const handler = new BrowserCloseHandler();
    context.browser = { close: vi.fn() } as unknown as Browser;
    await handler.handle(context);
    expect(context.browser.close).toHaveBeenCalled();
  });
});

describe("runAutomation", () => {
  it("runs all handlers in order", async () => {
    const mockHandlers = [
      { handle: vi.fn().mockResolvedValue({}) },
      { handle: vi.fn().mockResolvedValue({}) },
      { handle: vi.fn().mockResolvedValue({}) },
    ];

    await runAutomation(mockHandlers);

    mockHandlers.forEach((handler) => {
      expect(handler.handle).toHaveBeenCalled();
    });
  });
});
