const puppeteer = require('puppeteer');
const db = require('./firebaseConfig')
const { collection, doc, setDoc } = require('firebase/firestore');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.laughingplace.com/w/p/disneyland-current-wait-times/', { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => document.querySelector('h1')?.innerText);
    console.log('Scraped Data:', data);

    // const tableCount = await page.$$eval('table', tables => tables.length);
    const tableData1 = await page.$$eval('table tbody tr td:nth-child(1)', tdArray => tdArray.map(td => td.innerText))
    const tableData2 = await page.$$eval('table tbody tr td:nth-child(2)', tdArray => tdArray.map(td => td.innerText))
    // console.log('test:', tableData2);

    const scrapedObject = Object.fromEntries(tableData1.map((tableData, index) => [tableData, tableData2[index]]));
    console.log(scrapedObject)

    await browser.close();

    async function saveData() {
        const docRef = doc(db, "waitTimes", "user123");
        
        await setDoc(docRef, {
            name: "John Doe",
            age: 30,
            city: "Los Angeles",
            header: data
        });

        console.log("Document saved successfully!");
    }

    // saveData();
})();
