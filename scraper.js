const puppeteer = require('puppeteer');
const CronJob = require('node-cron');
const XLSX = require('xlsx');
const fs = require('fs');


const url = 'https://bisonapp.com/kurswerte/ethereum/';

const datas = [];

/**
 * This function start all the functions
 */
 startTracking();

 /**
* This function is used to go to the Website "bisonapp" and configuration the browser.
 */
async function configureBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

/**
 * This function is used to set a schedule. The function scrapeCourses is executed every minute
 */
 async function startTracking() {
    const page = await configureBrowser();

    let job = CronJob.schedule('*/1 * * * *', function () {
        scrapeCourses(page);
    }, null, true, null, null, true);

    job.start();
}


/**
 * This function is used to get the relevant information from the Bisonapp and push this information in the array "datas"
 * @param {string} page - This is the page Information from bisonapp
 */
async function scrapeCourses(page) {

    const [el2] = await page.$x('//*[@id="intro"]/div[1]/ul/li[2]/div');
    const txt = await el2.getProperty('textContent');
    const rawTxt = await txt.jsonValue();

    let currentPrice = rawTxt.substring(0, rawTxt.length - 2);


    a = new Date();
    b = a.getHours();
    c = a.getMinutes();
    d = a.getSeconds();
    zeit = b + ':' + c + ':' + d;
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    datum = date + "." + month + "." + year;


    a = new Date();
    b = a.getHours(); c = a.getMinutes(); d = a.getSeconds();
    if (b < 10) { b = '0' + b; }
    if (c < 10) { c = '0' + c; }
    if (d < 10) { d = '0' + d; }
    zeit = b + ':' + c + ':' + d;

    let actualDatas = {
        "Datum": datum,
        "Uhrzeit": zeit,
        "Kurs": currentPrice
    };

    datas.push(actualDatas);


    convertJsonToExcel();

    convertJsonToAFile();
}

/**
 * This function convert the information in the JSON to a excel file
 */

async function convertJsonToExcel() {
    const workSheet = XLSX.utils.json_to_sheet(datas);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, "datas")

    XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, "Ethereum.xlsx")
}

/**
 * This function write a json file. With this file we fill in the datas to the index.html
 */
async function convertJsonToAFile() {

    const data = JSON.stringify(datas);

    fs.writeFile('ethereum.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}

