const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const CSV_NAME = 'concessionnaire_auto_lyon.csv';
const PAGE = 'https://www.google.com/search?q=concessionnaire+auto+lyon+inurl%3Acontact';
const BLACKLIST = [
    'https://www.pappers.fr/societe/',
    'tripadvisor.fr',
    'thefork.fr',
    'petitfute.com',
    'hyeres-tourisme.com',
    'le-bouche-a-oreille.com',
    'gillespudlowski.com',
    'michelin.com',
    'restaurantguru.com',
    'facebook.com',
    'linternaute.com',
    'viamichelin.fr',
];


(async () => {
    // Lancez le navigateur Puppeteer
    const browser = await puppeteer.launch({
        headless: 'new',
        ignoreHTTPSErrors: true
    });

    // Ouvrez une nouvelle page
    const page = await browser.newPage();
    await page.goto(PAGE, {waitUntil: 'networkidle2'});

    let data = await scrapAllPages();

    const csvWriter = createCsvWriter({
        path: 'csv/' + CSV_NAME,
        header: [
            {id: 'name', title: 'name'},
            {id: 'url', title: 'url'},
            {id: 'mail', title: 'mail'},
            {id: 'tel', title: 'tel'}
        ],
    });

    csvWriter
        .writeRecords(data)
        .then(() => {
            console.log('Le fichier CSV a été créé avec succès.');
        })
        .catch((error) => {
            console.error('Erreur lors de la création du fichier CSV :', error);
        });


    async function scrapAllPages() {
        const base_page_url = await page.waitForSelector('a[aria-label="Plus de résultats"]')
            .then(async () => {
                return await page.$eval('a[aria-label="Plus de résultats"]', next_page => {
                    return next_page.href;
                });
            })

        let page_0_10 = base_page_url.replace('start=10', 'start=0')
        let page_10_20 = base_page_url.replace('start=10', 'start=10')
        let page_20_30 = base_page_url.replace('start=10', 'start=20')
        let page_30_40 = base_page_url.replace('start=10', 'start=30')


        let links = [];
        await page.goto(page_0_10, {waitUntil: 'networkidle2'});
        links.push(await page.waitForSelector('[data-hveid]')
            .then(async () => {
                return await page.$$eval('a[jsname="UWckNb"]', links => {
                    return links.map(a => a.href);
                });
            }))
        await page.goto(page_10_20, {waitUntil: 'networkidle2'});
        links.push(await page.waitForSelector('[data-hveid]')
            .then(async () => {
                return await page.$$eval('a[jsname="UWckNb"]', links => {
                    return links.map(a => a.href);
                });
            }));

        await page.goto(page_20_30, {waitUntil: 'networkidle2'});
        links.push(await page.waitForSelector('[data-hveid]')
            .then(async () => {
                return await page.$$eval('a[jsname="UWckNb"]', links => {
                    return links.map(a => a.href);
                });
            }))

        await page.goto(page_30_40, {waitUntil: 'networkidle2'});
        links.push(await page.waitForSelector('[data-hveid]')
            .then(async () => {
                return await page.$$eval('a[jsname="UWckNb"]', links => {
                    return links.map(a => a.href);
                });
            }))


        let clean_data = [];

        links.forEach((arr) => {
            arr.forEach((obj) => {
                if (!BLACKLIST.some(el => obj.includes(el))) {
                    clean_data.push(obj);
                }
            })
        })

        return await scrapSinglePage(clean_data);

    }

    async function scrapSinglePage(links) {

        let data = [];
        for (let i = 0; i < links.length; i++) {
            let link = links[i];
            console.log("Scrap de la page n°: " + (i + 1) + " sur " + links.length + " : " + link)
            let pageContent = null;
            try {
                await page.goto(link, {waitUntil: 'networkidle2'});
                pageContent = await page.evaluate(() => document.body.innerText);

            } catch (error) {
                console.log("Erreur lors du chargement de la page :" + link)
                continue;
            }

            let h1 = null;
            let mailto = null;
            let tel = null;

            try {
                h1 = await page.$eval('h1', el => el.innerText);
            } catch (error) {
                h1 = null;
            }


            try {
                mailto = await page.$eval('a[href^="mailto:"]', el => el.href);
            } catch (error) {
                const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
                const emails = pageContent.match(emailRegex) || []
                if (emails.length > 0) {
                    mailto = "mailto:" + emails[0];
                }

            }

            try {
                tel = await page.$eval('a[href^="tel:"]', el => el.href);
            } catch (error) {
                const phoneRegex = /\b\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{4}\b/g;
                const phones = pageContent.match(phoneRegex) || [];
                if (phones.length > 0) {
                    tel = "tel:" + phones[0];
                }
            }


            let dataCompany = {
                url: page.url(),
                name: h1 == null ? 'N/A' : h1,
                mail: mailto == null ? 'N/A' : mailto.replace('mailto:', ''),
                tel: tel == null ? 'N/A' : tel.replace('tel:', '')
            };


            data.push(dataCompany);
        }
        links.length
        let number_mail_found = 0;
        let number_tel_found = 0;
        data.forEach((obj) => {
            if (obj.mail !== 'N/A') {
                number_mail_found++;
            }
            if (obj.tel !== 'N/A') {
                number_tel_found++;
            }
        })

        console.log("Nombre de mail trouvé : " + ((number_mail_found * 100) / links.length) + ' %');
        console.log("Nombre de tel trouvé : " + ((number_tel_found * 100) / links.length) + ' %');

        return data;
    }

    function delay(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);

        let time = Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive


        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }

})();



