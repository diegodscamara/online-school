import { test, expect, type Page } from '@playwright/test';
import { signUserUp, logUserIn, createRandomUser, makeStripePayment, type User} from './utils';

let page: Page;
let testUser: User;

/**
 * Each user is given 3 credits for free on signup. This will allow them to call the OpenAI API 3 times.
 * After that, if they haven't paid, they will not be able to generate a schedule.
 * In this test file, we run all tests sequentially so that we use up the user's first 3 credits
 * and the 4th generation should fail. We can then test stripe payments and the ability to generate a schedule after payment.
 */
test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
  await signUserUp({ page: page, user: testUser });
  await logUserIn({ page: page, user: testUser });
});

test.afterAll(async () => {
  await page.close();
});

const task1 = 'create presentation on SaaS';
const task2 = 'build SaaS app draft';

test('User can make 3 AI schedule generations', async () => {
  test.slow(); // Use a longer timeout time in case OpenAI is slow to respond

  expect(page.url()).toContain('/demo-app');
  await page.fill('input[id="description"]', task1);
  await page.click('button:has-text("Add task")');
  await expect(page.getByText(task1)).toBeVisible();
  await page.fill('input[id="description"]', task2);
  await page.click('button:has-text("Add task")');
  await expect(page.getByText(task2)).toBeVisible();

  for (let i = 0; i < 3; i++) {
    const generateScheduleButton = page.getByRole('button', { name: 'Generate Schedule' });
    await expect(generateScheduleButton).toBeVisible();

    await Promise.all([
      page.waitForRequest((req) => req.url().includes('operations/generate-gpt-response') && req.method() === 'POST'),
      page.waitForResponse((response) => {
        return response.url().includes('/operations/generate-gpt-response') && response.status() === 200;
      }),
      // We already started waiting before we perform the click that triggers the API calls. So now we just perform the click
      generateScheduleButton.click(),
    ]);

    // We already show a table with some dummy data even before the API call
    // Now we want to check that the tasks we added are in the generated table
    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    const tableTextContent = (await table.innerText()).toLowerCase();
    expect(tableTextContent.includes(task1.toLowerCase())).toBeTruthy();
    expect(tableTextContent.includes(task2.toLowerCase())).toBeTruthy();
  }
});

test('AI schedule generation fails on 4th attempt', async () => {
  test.slow(); // Use a longer timeout time in case OpenAI is slow to respond

  await page.reload();

  const generateScheduleButton = page.getByRole('button', { name: 'Generate Schedule' });
  await expect(generateScheduleButton).toBeVisible();

  await Promise.all([
    page.waitForRequest((req) => req.url().includes('operations/generate-gpt-response') && req.method() === 'POST'),

    page.waitForResponse((response) => {
      // expect the response to be 402 "PAYMENT_REQUIRED"
      return response.url().includes('/operations/generate-gpt-response') && response.status() === 402;
    }),
    // We already started waiting before we perform the click that triggers the API calls. So now we just perform the click
    generateScheduleButton.click(),
  ]);

  // We already show a table with some dummy data even before the API call
  // Now we want to check that the tasks were NOT added because the API call should have failed
  const table = page.getByRole('table');
  await expect(table).toBeVisible();
  const tableTextContent = (await table.innerText()).toLowerCase();

  expect(tableTextContent.includes(task1.toLowerCase())).toBeFalsy();
  expect(tableTextContent.includes(task2.toLowerCase())).toBeFalsy();
});

test('Make test payment with Stripe', async () => {
  const PLAN_NAME = 'Basic';
  await makeStripePayment({ test, page, planName: PLAN_NAME });
});

test('User should be able to generate another schedule after payment', async () => {
  await page.goto('/demo-app');

  const generateScheduleButton = page.getByRole('button', { name: 'Generate Schedule' });
  await expect(generateScheduleButton).toBeVisible();

  await Promise.all([
    page
      .waitForRequest((req) => req.url().includes('operations/generate-gpt-response') && req.method() === 'POST')
      .catch((err) => console.error(err.message)),
    page
      .waitForResponse((response) => {
        if (response.url().includes('/operations/generate-gpt-response') && response.status() === 200) {
          return true;
        }
        return false;
      })
      .catch((err) => console.error(err.message)),
    // We already started waiting before we perform the click that triggers the API calls. So now we just perform the click
    generateScheduleButton.click(),
  ]);

  await page.waitForSelector('table');
  const table = page.getByRole('table');
  await expect(table).toBeVisible();
  const tableTextContent = (await table.innerText()).toLowerCase();
  expect(tableTextContent.includes(task1.toLowerCase())).toBeTruthy();
  expect(tableTextContent.includes(task2.toLowerCase())).toBeTruthy();
});
