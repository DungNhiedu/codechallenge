# CodeChallenge Framework

## Framework Structure and Rationale

This framework is designed to automate testing using modern tools and best practices. It is structured to ensure scalability, maintainability, and ease of use.

### Key Components:

1. **Page Object Model (POM):**
   - The framework follows the Page Object Model design pattern, where each page or component of the application is represented by a class.
   - This approach ensures modularity and reusability of code.

2. **Test Files:**
   - Test cases are written in a structured manner, focusing on specific functionalities.
   - Each test file corresponds to a feature or module of the application.

3. **Configuration:**
   - The framework includes a configuration file to manage settings such as browser options, timeouts, and test environments.

4. **Utilities:**
   - Common utility functions are provided to handle repetitive tasks like assertions, data generation, and API interactions.

5. **Reporting:**
   - Test execution results are captured and presented in a detailed report for easy debugging and analysis.

---

## Steps to Execute the Demo Scripts

### Prerequisites:
1. Install [Node.js](https://nodejs.org/) (v16 or higher).
2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
3. Install dependencies:
    npm install

## Running Tests:
### Running Tests:
1. Execute all tests:
    npx playwright test
2. Execute all tests UI:
    npx playwright test --ui
2. Run a specific test file:
    npx playwright test <test-file-path>
3. View the test report:
    npx playwright show-report

## Debugging:
1. Run tests in headed mode for debugging:
    npx playwright test --headed
2. Use trace viewer for failed tests:
    npx playwright show-trace <trace-file>

### CI/CD Execution:
The framework is configured to run tests automatically in CI/CD pipelines. Push your changes to the repository, and the tests will execute as per the CI configuration.


