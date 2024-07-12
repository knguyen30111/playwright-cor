import { chromium, Browser, Page } from "playwright";

interface AutomationData {
  url?: string;
  title?: string;
  headingText?: string;
  processedTitle?: string;
  wordCount?: number;
}

export class AutomationContext {
  browser: Browser | null = null;
  page: Page | null = null;
  data: AutomationData = {};
}

interface Handler {
  handle(context: AutomationContext): Promise<AutomationContext>;
}

abstract class BaseHandler implements Handler {
  public async handle(context: AutomationContext): Promise<AutomationContext> {
    // Implement base handling logic if needed
    return context;
  }
}

export class BrowserLaunchHandler extends BaseHandler {
  public async handle(context: AutomationContext): Promise<AutomationContext> {
    // context.browser = await chromium.launch({ headless: false });
    context.browser = await chromium.launch();
    context.page = await context.browser.newPage();
    return context;
  }
}

export class NavigationHandler extends BaseHandler {
  private url: string;

  constructor(url: string) {
    super();
    this.url = url;
  }

  public async handle(context: AutomationContext): Promise<AutomationContext> {
    if (context.page) {
      await context.page.goto(this.url);
      context.data.url = context.page.url();
    }
    return context;
  }
}

export class DataExtractionHandler extends BaseHandler {
  public async handle(context: AutomationContext): Promise<AutomationContext> {
    if (context.page) {
      context.data.title = await context.page.title();
      console.log(`Extracting data from: ${context.data.url}`);
      context.data.headingText = await context.page.$eval(
        "h1",
        (el: HTMLHeadingElement) => el.textContent || ""
      );
    }
    return context;
  }
}

export class DataProcessingHandler extends BaseHandler {
  public async handle(context: AutomationContext): Promise<AutomationContext> {
    if (context.data.title) {
      context.data.processedTitle = context.data.title.toUpperCase();
    }
    if (context.data.headingText) {
      context.data.wordCount = context.data.headingText.split(" ").length;
    }
    return context;
  }
}

export class BrowserCloseHandler extends BaseHandler {
  public async handle(context: AutomationContext): Promise<AutomationContext> {
    if (context.browser) {
      await context.browser.close();
    }
    return context;
  }
}

export async function runAutomation(
  handlers: Handler[]
): Promise<AutomationData> {
  const context = new AutomationContext();

  for (const handler of handlers) {
    await handler.handle(context);
  }

  return context.data;
}

// Example usage
async function main() {
  const handlers: Handler[] = [
    new BrowserLaunchHandler(),
    new NavigationHandler("https://example.com"),
    new DataExtractionHandler(),
    new DataProcessingHandler(),
    new BrowserCloseHandler(),
  ];

  try {
    const result = await runAutomation(handlers);
    console.log("Automation results:", result);
  } catch (error) {
    console.error("Automation failed:", error);
  }
}

main();
