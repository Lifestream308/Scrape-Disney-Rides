const puppeteer = require('puppeteer');
const db = require('./firebaseConfig')
const { collection, doc, setDoc } = require('firebase/firestore');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.laughingplace.com/w/p/disneyland-current-wait-times/', { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => document.querySelector('h1')?.innerText);
    console.log('Scraped Data:', data);

    await browser.close();

    // Function to save data
    async function saveData() {
        const docRef = doc(db, "users", "user123"); // Reference to 'users/user123'
        
        await setDoc(docRef, {
            name: "John Doe",
            age: 30,
            city: "Los Angeles",
            header: data
        });

        console.log("Document saved successfully!");
    }

    // Run function
    saveData();
})();
