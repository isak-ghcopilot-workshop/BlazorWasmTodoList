import {
  chromium,
  expect,
  test as base,
  type Browser,
  type Page,
} from '@playwright/test';

type TestFixtures = {
  cdpPage: Page;
};

type WorkerFixtures = {
  cdpBrowser: Browser;
};

const test = base.extend<TestFixtures, WorkerFixtures>({
  cdpBrowser: [
    async ({}, use) => {
      const browser = await chromium.connectOverCDP('http://localhost:9222');
      await use(browser);
      await browser.close();
    },
    { scope: 'worker' },
  ],
  cdpPage: async ({ cdpBrowser }, use) => {
    const context = cdpBrowser.contexts()[0];
    if (!context) {
      throw new Error('The attached browser has no available context.');
    }

    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

const todoUrl = 'https://localhost:7241/todo';

test('shows an empty todo list initially', async ({ cdpPage }) => {
  await cdpPage.goto(todoUrl);

  await expect(cdpPage.getByRole('heading', { name: 'Todo (0)' })).toBeVisible();
  await expect(cdpPage.getByRole('listitem')).toHaveCount(0);
});

test('adds a todo and clears the entry field', async ({ cdpPage }) => {
  await cdpPage.goto(todoUrl);

  const entry = cdpPage.getByRole('textbox');
  await entry.fill('Buy groceries');
  await cdpPage.getByRole('button', { name: 'Add todo' }).click();

  await expect(cdpPage.getByRole('heading', { name: 'Todo (1)' })).toBeVisible();
  await expect(cdpPage.getByRole('listitem').getByRole('textbox')).toHaveValue(
    'Buy groceries',
  );
  await expect(cdpPage.getByRole('textbox').last()).toHaveValue('');
});

test('does not add an empty or whitespace-only todo', async ({ cdpPage }) => {
  await cdpPage.goto(todoUrl);

  const entry = cdpPage.getByRole('textbox');
  const addButton = cdpPage.getByRole('button', { name: 'Add todo' });

  await addButton.click();
  await entry.fill('   ');
  await addButton.click();

  await expect(cdpPage.getByRole('heading', { name: 'Todo (0)' })).toBeVisible();
  await expect(cdpPage.getByRole('listitem')).toHaveCount(0);
});

test('allows editing and completing a todo', async ({ cdpPage }) => {
  await cdpPage.goto(todoUrl);

  await cdpPage.getByRole('textbox').fill('Draft task');
  await cdpPage.getByRole('button', { name: 'Add todo' }).click();

  const todo = cdpPage.getByRole('listitem').first();
  await todo.getByRole('textbox').fill('Updated task');
  await expect(todo.getByRole('textbox')).toHaveValue('Updated task');

  await todo.getByRole('checkbox').check();
  await expect(cdpPage.getByRole('heading', { name: 'Todo (0)' })).toBeVisible();
  await todo.getByRole('checkbox').uncheck();
  await expect(cdpPage.getByRole('heading', { name: 'Todo (1)' })).toBeVisible();
});
