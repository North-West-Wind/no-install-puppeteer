const nip = require("..");

nip(async function(page) {
    await page.goto('https://www.google.com/');
    const title = await page.title();
    return title;
}).then(console.log);