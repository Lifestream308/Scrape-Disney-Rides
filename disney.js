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
    // console.log(scrapedObject)

    await browser.close();

    async function saveData() {

        const date = new Date();
        const todaysDate = String(date.toISOString().split("T")[0])
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const currentTime = `${hours}${minutes}`;
        const docRef = doc(db, "waitTimes", todaysDate);
        
        await setDoc(docRef, {
            [currentTime]: scrapedObject
        }, {merge: true});

        console.log("Document saved successfully!");
    }

    saveData();
})();
