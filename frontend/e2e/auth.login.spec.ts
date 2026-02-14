import {test, expect} from '@playwright/test';

test('login sends request and succeeds', async ({page}) => {
    await page.goto('/login', {waitUntil: 'domcontentloaded'});

    await page.getByLabel(/email/i).fill('another@gmail.com');
    await page.getByLabel(/password/i).fill('miramiraM1!');

    const respPromise = page.waitForResponse(
        r => r.request().method() === 'POST' && r.url().includes('/auth/login'),
    );

    await page.getByRole('button', {name: /submit/i}).click();

    const resp = await respPromise;
    expect(resp.status()).toBe(200);
});


test('register sends request and succeeds', async ({page}) => {
    await page.goto('/register', {waitUntil: 'domcontentloaded'});

    await page.getByLabel(/email/i).fill('test@gmail.com');
    await page.getByLabel(/password/i).fill('miramiraM1!');

    const respPromise = page.waitForResponse(
        r => r.request().method() === 'POST' && r.url().includes('/auth/register'),
    );

    await page.getByRole('button', {name: /submit/i}).click();

    const resp = await respPromise;
    expect(resp.status()).toBe(200);
});
