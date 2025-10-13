import { browser } from '@wdio/globals'

/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open(path: string): Promise<void | WebdriverIO.Request> {
        return browser.url(`https://solflare.com/onboard/${path}`)
    }

    public async waitExist(element: ChainablePromiseElement, timeout = 10000): Promise<void> {
        await element.waitForExist({ timeout });
    }

    public async waitDisplayed(element: ChainablePromiseElement, timeout = 10000): Promise<void> {
        await element.waitForDisplayed({ timeout });
    }

    public async waitClickable(element: ChainablePromiseElement, timeout = 10000): Promise<void> {
        await element.waitForClickable({ timeout });
    }

    public async click(element: ChainablePromiseElement): Promise<void> {
        await this.waitClickable(element);
        await element.click();
    }

    public async text(element: ChainablePromiseElement): Promise<string> {
        await this.waitDisplayed(element);
        return (await element.getText()).trim();
    }

    public async getElementAttribute(element: ChainablePromiseElement, attributeName: string): Promise<string | null> {
        await this.waitExist(element);
        return element.getAttribute(attributeName);
    }

    public async fillInputField(inputField: ReturnType<typeof $>, inputText: string): Promise<void> {
        await this.waitClickable(inputField);
        await inputField.click();
        await inputField.clearValue();
        await inputField.setValue(inputText);
    }
}
