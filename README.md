# Solflare Test Automation Framework

## Getting Started

Clone this project into your local directory using the command below:

```powershell
git clone https://github.com/VeselinDam/Solflare.git
```

**Main branch:** `main`

---

### Prerequisites
Before running tests, make sure you have the following installed:

- **Visual Studio Code** (latest version recommended)  
- **Node.js** (v20.x.x or later) — includes NPM  
   [Download Node.js](https://nodejs.org)

---

### Installation

Run the following commands to install dependencies:

```powershell
npm install
```

### How to Run Tests (UI Mode)

You can run the tests in interactive **UI Mode** using WebdriverIO’s test runner.

```powershell
$env:BROWSER = "chrome"; npm run test:chrome
$env:BROWSER = "firefox"; npm run test:firefox
```

This will execute your test suite and it will automatically launch the browser.

---

### How to Run Tests (Headless Mode)

Run all tests in **headless mode**

```powershell
$env:HEADLESS= "true"; npm run test:chrome
$env:HEADLESS= "true"; npm run test:firefox
```

### How to API Tests

Run API tests:

```powershell
npm run test:api 
```

To run a specific test file:

```powershell
npx wdio run ./wdio.conf.ts --spec ./<file-path>/<file-name>.ts
```

Example:
```powershell
npx wdio run ./wdio.conf.ts --spec ./test/ui/specs/walletCreationAndRecovery.e2e.ts
```

To use **Allure Reports** with WebdriverIO, you need to have **Java** installed, because Allure CLI depends on it.

#### Step 1 — Install Java

1. Download and install **Java (JDK 17 or later)**:  
   👉 [https://www.oracle.com/java/technologies/javase-downloads.html](https://www.oracle.com/java/technologies/javase-downloads.html)

2. After installation, verify that Java is available:
   ```powershell
   java -version
   ```
   You should see output like:
   ```
   java version "17.x.x"
   ```

---

#### Step 2 — Set JAVA_HOME (Windows)

1. Open **System Properties → Advanced → Environment Variables**.  
2. Under **System variables**, click **New** and add:
   - **Variable name:** `JAVA_HOME`  
   - **Variable value:** path to your JDK (e.g. `C:\Program Files\Java\jdk-17`)
3. Edit the **Path** variable → click **New** → add:
   ```
   %JAVA_HOME%\bin
   ```
4. Restart your terminal or VS Code to apply the changes.

Check the variable:
```powershell
echo $env:JAVA_HOME
```

#### Step 3 — Generate and Open Allure Report

After running your tests, WebdriverIO will generate raw Allure results inside the folder `./allure-results`.

To **generate** the API report:
```powershell
allure generate allure-results-api --clean
```

To **generate** the UI report:
```powershell
allure generate allure-results --clean
```

To **open** the report in your browser:
```powershell
allure open
```
#### Running Tests on GitHub Actions

The framework includes a GitHub Actions CI workflow for running UI and API tests. UI tests are executed in a headless environment by default.

How to run UI / API tests
1. Go to Action section.
2. Select UI or API tests workflow. 
3. Click on the dropdown button 'Run workflow'. 
4. Branch select as 'Main'
5. For UI tests select Browser to run chrome or firefox and uncheck checkbox IF NOT running in headless mode. 
6. Click "Run workflow" to start the tests.

### Author

**Veselin Damnjanovic**  