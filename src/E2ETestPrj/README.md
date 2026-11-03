# Todo E2E tests

These Playwright tests exercise the Todo page at `https://localhost:7241/todo`.
They connect to an existing Chromium browser over CDP; they do not launch a new
browser. The browser must be running with its debugging endpoint available at
`http://localhost:9222`.

## Prerequisites

- Node.js (20 or later) and npm
- .NET 10 SDK
- The Todo app running at `https://localhost:7241`
- An existing Chromium browser exposing the CDP endpoint at port `9222`

Start the app using the `https` launch profile in Visual Studio, or from the
repository root:

```powershell
dotnet run --project src\BlazorWasmTodoList --launch-profile https
```

If needed, attach the Playwright CLI to the existing browser:

```powershell
playwright-cli attach --cdp=http://localhost:9222
```

## Run the tests

From this directory (`src\E2ETestPrj`):

```powershell
npm install
npm test
```

Run one scenario by matching its test title:

```powershell
npm test -- --grep "adds a todo"
```

The suite covers the initial empty list, adding a todo, rejecting empty or
whitespace-only entries, editing a todo, and updating the active count when a
todo is completed or reopened.
