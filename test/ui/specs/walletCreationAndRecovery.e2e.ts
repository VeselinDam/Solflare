import { expect } from '@wdio/globals';
import homePage from '../pageobjects/home.page';
import successPage from '../pageobjects/success.page';
import logger from '../../utils/logger';

describe('Solflare Wallet Creation', () => {
    it('should create new wallet and verify recovery phrase management', async () => {
        await homePage.open();
        logger.info('Verify that we are on the Home page');
        await expect(homePage.pageTitle).toBeDisplayed();
        await expect(homePage.pageTitle).toHaveText('YOUR WALLET. YOUR KINGDOM.', { message: 'Home page title does not match expected text' });
        const createWallet = await homePage.clickOnNeedNewWalletButton();

        logger.info('Create a new wallet and set up recovery phrase');
        await expect(createWallet.mainPageTitle).toHaveText('Keys to Your Kingdom', { message: 'Create Wallet page title does not match expected text' });
        const recoveryPhrases = await createWallet.getAllRecoveryPhrases();
        await createWallet.clickOnSaveMyRecoveryPhraseButton();

        logger.info('Confirm recovery phrase and fill input fields');
        await expect(createWallet.recoveryPhraseTitle).toBeDisplayed();
        await expect(createWallet.recoveryPhraseTitle).toHaveText('Confirm Your Recovery Phrase', { message: 'Recovery Phrase title does not match expected text' });
        await createWallet.fillRecoveryPhraseInputFields(recoveryPhrases);
        await createWallet.clickOnContinueButton();

        logger.info('Verify password page and Set wallet password');
        await expect(createWallet.passwordPageTitle).toBeDisplayed();
        await expect(createWallet.passwordPageTitle).toHaveText('Set a Password for Your Wallet', { message: 'Password page title does not match expected text' });
        await createWallet.fillPasswordField('Test1234');
        await createWallet.fillRepeatPasswordInputFieldField('Test1234');
        await createWallet.clickOnContinueButton();

        logger.info('Complete wallet creation and navigate to Portfolio page');
        await expect(successPage.pageTitle).toBeDisplayed();
        await expect(successPage.pageTitle).toHaveText('You’re All Set!', { message: 'Success page title does not match expected text' });
        const portfolioPage = await successPage.clickOnAgreeLetsGoButton();

        logger.info('Verify that we are on the Portfolio page');
        await expect(portfolioPage.pageTitle).toBeDisplayed();
        await expect(portfolioPage.pageTitle).toHaveText('Portfolio', { message: 'Portfolio page title does not match expected text' });
        const walletManagementPage = await portfolioPage.clickOnwalletManagementAvatar();

        logger.info('Verify that we are on the Wallet Management page');
        await expect(walletManagementPage.pageTitle).toBeDisplayed();
        await expect(walletManagementPage.pageTitle).toHaveText('My Wallets', { message: 'Wallet Management page title does not match expected text' });
        await expect(walletManagementPage.mainWallet).toBeDisplayed();
        await expect(walletManagementPage.mainWallet).toHaveText('Main Wallet', { message: 'Main Wallet title does not match expected text' });

        logger.info('Manage recovery phrase and verify wallet selection');
        await walletManagementPage.clickOnAddIconButton();
        await walletManagementPage.clickOnManageRecoveryPhraseButton();

        logger.info('Verify that we are on the Manage Recovery Phrase page');
        const isFirstSwitchDisabled = await walletManagementPage.isSwitchButtonDisabled(0);
        await expect(isFirstSwitchDisabled).toBe(true);

        const isFirstSwitchActive = await walletManagementPage.getSwitchButtonValue(0);
        await expect(isFirstSwitchActive).toBe("on");

        logger.info('Store titles of selected wallets for later verification');
        const selectedWalletsTitles: string[] = [];
        selectedWalletsTitles.push(await walletManagementPage.getManageRecoveryPhraseWalletTitleText(0));

        logger.info('Select additional wallets');
        await walletManagementPage.clickOnSwitchButton(2);
        selectedWalletsTitles.push(await walletManagementPage.getManageRecoveryPhraseWalletTitleText(2));
        await walletManagementPage.clickOnSwitchButton(3);
        selectedWalletsTitles.push(await walletManagementPage.getManageRecoveryPhraseWalletTitleText(3));
        await walletManagementPage.clickOnSaveButton();

        logger.info('Verify that we are back on the Wallet Management page');
        await expect(walletManagementPage.pageTitle).toBeDisplayed();
        await expect(walletManagementPage.pageTitle).toHaveText('My Wallets', { message: 'Wallet Management page title does not match expected text' });

        logger.info('Verify that the selected wallets are displayed correctly');
        const myWalletsSubtitles = await walletManagementPage.getMyWalletsSubtitles();
        await expect(myWalletsSubtitles).toEqual(selectedWalletsTitles);
    });
});