import { browser } from '@wdio/globals'
import logger from '../../utils/logger';
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
        const selector = String(((await element) as any).selector ?? '<unknown>');
        try {
            logger.debug(`Clicking on element: ${selector}`);
            await this.waitClickable(element);
            await element.click();
            logger.debug(`Clicked on element: ${selector}`);
        } catch (err: any) {
            logger.error(`Failed to click element: ${selector} → ${err.message}`);
            throw err;
        }
    }


    public async text(element: ChainablePromiseElement): Promise<string> {
        const selector = String(((await element) as any).selector ?? '<unknown>');
        try {
            logger.debug(`Getting text from element: ${selector}`);
            await this.waitDisplayed(element);
            const text = (await element.getText()).trim();
            logger.debug(`Text from ${selector}: "${text}"`);
            return text;
        } catch (err: any) {
            logger.error(`Failed to get text from ${selector} → ${err.message}`);
            throw err;
        }
    }

    public async getElementAttribute(element: ChainablePromiseElement, attributeName: string): Promise<string | null> {
        const selector = String(((await element) as any).selector ?? '<unknown>');
        try {
            logger.debug(`Getting attribute "${attributeName}" from element: ${selector}`);
            await this.waitExist(element);
            const value = await element.getAttribute(attributeName);
            logger.debug(`Attribute "${attributeName}" on ${selector} = ${value}`);
            return value;
        } catch (err: any) {
            logger.error(`Failed to get attribute "${attributeName}" from ${selector} → ${err.message}`);
            throw err;
        }
    }

    public async fillInputField(inputField: ReturnType<typeof $>, inputText: string
    ): Promise<void> {
        const selector = String(((await inputField) as any).selector ?? '<unknown>');
        try {
            logger.debug(`Filling input field ${selector}`);
            await this.waitClickable(inputField);
            await inputField.click();
            await inputField.clearValue();
            await inputField.setValue(inputText);
            logger.debug(`Filled input field ${selector}`);
        } catch (err: any) {
            logger.error(`Failed to fill input field ${selector} → ${err.message}`);
            throw err;
        }
    }
}
