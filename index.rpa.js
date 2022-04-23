const puppeteer = require("puppeteer");
const fs = require("fs");
const dataArray = [
  {
    "Phone Number": "40716543298",
    "First Name": "John",
    "Last Name": "Smith",
    "company": "IT Solutions",
    "role": "Analyst",
    Address: "98 North Road",
    Email: "jsmith@itsolutions.co.uk",
  },
  {
    "Phone Number": "40791345621",
    "First Name": "Jane",
    "Last Name": "Dorsey",
    "company": "MediCare",
    "role": "Medical Engineer",
    Address: "11 Crown Street",
    Email: "jdorsey@mc.com",
  },
  {
    "Phone Number": "40735416854",
    "First Name": "Albert",
    "Last Name": "Kipling",
    "company": "Waterfront",
    "role": "Accountant",
    Address: "22 Guild Street",
    Email: "kipling@waterfront.com",
  },
  {
    "Phone Number": "40733652145",
    "First Name": "Michael",
    "Last Name": "Robertson",
    "company": "MediCare",
    "role": "IT Specialist",
    Address: "17 Farburn Terrace",
    Email: "mrobertson@mc.com",
  },
  {
    "Phone Number": "40799885412",
    "First Name": "Doug",
    "Last Name": "Derrick",
    "company": "Timepath Inc.",
    "role": "Analyst",
    Address: "99 Shire Oak Road",
    Email: "dderrick@timepath.co.uk",
  },
  {
    "Phone Number": "40733154268",
    "First Name": "Jessie",
    "Last Name": "Marlowe",
    "company": "Aperture Inc.",
    "role": "Scientist",
    Address: "27 Cheshire Street",
    Email: "jmarlowe@aperture.us",
  },
  {
    "Phone Number": "40712462257",
    "First Name": "Stan",
    "Last Name": "Hamm",
    "company": "Sugarwell",
    "role": "Advisor",
    Address: "10 Dam Road",
    Email: "shamm@sugarwell.org",
  },
  {
    "Phone Number": "40731254562",
    "First Name": "Michelle",
    "Last Name": "Norton",
    "company": "Aperture Inc.",
    "role": "Scientist",
    Address: "13 White Rabbit Street",
    Email: "mnorton@aperture.us",
  },
  {
    "Phone Number": "40741785214",
    "First Name": "Stacy",
    "Last Name": "Shelby",
    "company": "TechDev",
    "role": "HR Manager",
    Address: "19 Pineapple Boulevard",
    Email: "sshelby@techdev.com",
  },
  {
    "Phone Number": "40731653845",
    "First Name": "Lara",
    "Last Name": "Palmer",
    "company": "Timepath Inc.",
    "role": "Programmer",
    Address: "87 Orange Street",
    Email: "lpalmer@timepath.co.uk",
  },
];


/**
 * @description main arrow function that prepares the ambient
 */
(async () => {
  console.time("inicio");

  // launches the browser and configure it to not download any media, making the navigation faster
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
  ]
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(180000);
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (["image", "media", "font"].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });
  await page.goto('https://www.rpachallenge.com/')

  for (const data of dataArray){
    await fillData(page, data)
  }
  process.exit(0)
})();


/**
 * @description Fill data in a form
 * @param {puppeteer.Page} page 
 * @param {Object} data
 */
const fillData = async (page, data) => {
  const defaultInput = (sel) => `input[ng-reflect-name="${sel}"]`
  await page.waitForSelector('input[value="Submit"]')
  await page.type(defaultInput("labelPhone"), data['Phone Number'])
  await page.type(defaultInput("labelLastName"), data['Last Name'])
  await page.type(defaultInput("labelEmail"), data['Email'])
  await page.type(defaultInput("labelCompanyName"), data['company'])
  await page.type(defaultInput("labelRole"), data['role'])
  await page.type(defaultInput("labelAddress"), data['Address'])
  await page.type(defaultInput("labelFirstName"), data['First Name'])
  await page.click('input[value="Submit"]')
}