import { type Locator, type Page } from '@playwright/test';
import { Header } from '@components/Header';

export abstract class BasePage {
  readonly header: Header;
  readonly title: Locator;

  protected constructor(
    readonly page: Page,
    readonly path: string,
  ) {
    this.header = new Header(page);
    this.title = page.getByTestId('title');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
