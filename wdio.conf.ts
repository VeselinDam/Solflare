import * as fs from 'fs';
import * as path from 'path';

/**
 * Determines browser capabilities and launch options dynamically
 * based on environment variables.
 *
 * Environment variables:
 * - `BROWSER`: defines which browser to use (`chrome`, `firefox`, or `all`).
 *   Defaults to `chrome` if not provided.
 * - `HEADLESS`: when set to `'true'`, runs the browser in headless mode.
 *
 * For Chrome:
 * - In headless mode, it uses `--window-size=1920,1080` for consistent viewport size.
 * - In GUI mode, it launches maximized.
 *
 * For Firefox:
 * - In headless mode, uses the `-headless` flag (viewport size is later set in `before` hook).
 * - In GUI mode, no special arguments are needed.
 *
 * When `BROWSER=all` is set, both Chrome and Firefox run sequentially (each with a single instance).
 *
 * This approach makes the configuration flexible for local runs (GUI)
 * and CI/CD pipelines (headless), keeping capability definitions DRY and centralized.
 *
 * @constant
 * @type {string}
 */
const browserParam = process.env.BROWSER || 'chrome';
const isHeadless = process.env.HEADLESS === 'true';

const chromeArgsHeadless = ['--headless=new', '--disable-gpu', '--window-size=1920,1080'];
const chromeArgsGui = ['--start-maximized'];

const firefoxArgsHeadless = ['-headless'];
const firefoxArgsGui: string[] = [];

/**
 * Dynamic WebdriverIO capabilities array.
 *
 * Depending on the selected browser(s), populates the array with proper
 * `goog:chromeOptions` or `moz:firefoxOptions`.
 *
 * @constant
 * @type {WebdriverIO.Capabilities[]}
 */
let capabilities: any[] = [];

if (browserParam === 'all') {
    capabilities = [
        {
            browserName: 'chrome',
            maxInstances: 1,
            'goog:chromeOptions': { args: isHeadless ? chromeArgsHeadless : chromeArgsGui },
        },
        {
            browserName: 'firefox',
            maxInstances: 1,
            'moz:firefoxOptions': { args: isHeadless ? firefoxArgsHeadless : firefoxArgsGui },
        },
    ];
} else {
    capabilities = [
        {
            browserName: browserParam,
            maxInstances: 1,
            'goog:chromeOptions':
                browserParam === 'chrome' ? { args: isHeadless ? chromeArgsHeadless : chromeArgsGui } : undefined,
            'moz:firefoxOptions':
                browserParam === 'firefox' ? { args: isHeadless ? firefoxArgsHeadless : firefoxArgsGui } : undefined,
        },
    ];
}

export const config: WebdriverIO.Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    // WebdriverIO supports running e2e tests as well as unit and component tests.
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // of the configuration file being run.
    //
    // The specs are defined as an array of spec files (optionally using wildcards
    // that will be expanded). The test for each spec file will be run in a separate
    // worker process. In order to have a group of spec files run in the same worker
    // process simply enclose them in an array within the specs array.
    //
    // The path of the spec files will be resolved relative from the directory of
    // of the config file unless it's absolute.
    //
    specs: [
        './test/ui/specs/**/*.ts'
    ],
    // Patterns to exclude.
    exclude: ["./test/api/**"],
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 1,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
    capabilities,

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: 'http://localhost:8080',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 15000,
    waitforInterval: 200,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    // services: [],
    //
    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',

    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    //reporters: ['spec', ['allure', { outputDir: 'allure-results' }]],
    reporters: [['allure', {
        outputDir: 'allure-results'
    }]],

    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed before a worker process is spawned and can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    // beforeTest: function (test, context) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context, hookName) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }, hookName) {
    // },

    /**
 * WebdriverIO lifecycle hook that runs before any test execution begins.
 *
 * This hook ensures consistent browser viewport sizing across different environments
 * and handles differences between headless and GUI modes for Chrome and Firefox.
 *
 * Behavior:
 * - **Firefox (headless mode):**
 *   Firefox ignores window size arguments passed via capabilities (e.g. `--width` / `--height`),
 *   so the viewport must be explicitly set using `browser.setWindowSize(1920, 1080)`.
 * - **All browsers (GUI mode):**
 *   Maximizes the browser window to ensure all page elements are visible
 *   during local or interactive test runs.
 * - **Chrome (headless mode):**
 *   No manual sizing is needed because `--window-size=1920,1080` is already passed
 *   through `goog:chromeOptions` in the capabilities.
 *
 * This setup helps prevent layout-related test flakiness and ensures screenshots,
 * element positions, and viewport-dependent behaviors remain consistent.
 *
 * @async
 * @function before
 */
    before: async function () {
        const browserName = (await browser.capabilities.browserName || '').toLowerCase();

        if (browserName === 'firefox' && isHeadless) {
            await browser.setWindowSize(1920, 1080);
        } else if (!isHeadless) {
            await browser.maximizeWindow();
        }
    },

    /**
 * WebdriverIO lifecycle hook that runs after each test (`it` block).
 *
 * Captures additional debugging artifacts when a test fails:
 * - Saves a screenshot and page source in the local `./artifacts` directory.
 * - Attaches both the screenshot and the HTML source to the Allure report
 *   to help with debugging and post-run analysis.
 *
 * Automatically creates the artifacts directory if it doesn’t exist.
 * If the Allure reporter is not available, the process silently continues
 * without interrupting the test flow.
 *
 * @async
 * @function afterTest
 * @param {object} test - The test object containing details such as test title.
 * @param {object} context - Contains test execution info.
 * @param {boolean} context.passed - Indicates whether the test passed or failed.
 */

    afterTest: async function (test, _context, { passed }) {
        if (!passed) {
            const dir = path.resolve('./artifacts/screenshots');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const png = await browser.takeScreenshot();
            await browser.saveScreenshot(`./artifacts/screenshots/${Date.now()}_${test.title}.png`);
            try {
                const { default: allure } = await import('@wdio/allure-reporter');
                allure.addAttachment('Screenshot on Fail', Buffer.from(png, 'base64'), 'image/png');
                const html = await browser.getPageSource();
                allure.addAttachment('Page Source', html, 'text/html');
            } catch { }
        }
    },


    /**
     * Hook that gets executed after the suite has ended
     * @param {object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    /**
    * Hook that gets executed before a WebdriverIO assertion happens.
    * @param {object} params information about the assertion to be executed
    */
    // beforeAssertion: function(params) {
    // }
    /**
    * Hook that gets executed after a WebdriverIO assertion happened.
    * @param {object} params information about the assertion that was executed, including its results
    */
    // afterAssertion: function(params) {
    // }
}
