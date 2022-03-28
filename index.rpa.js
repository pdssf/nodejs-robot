const puppeteer = require("puppeteer");
const fs = require("fs");
const dataArray = [
  {
    "Phone Number": "40716543298",
    "First Name": "John",
    "Last Name": "Smith",
    "Company Name": "IT Solutions",
    "Role in Company": "Analyst",
    Address: "98 North Road",
    Email: "jsmith@itsolutions.co.uk",
  },
  {
    "Phone Number": "40791345621",
    "First Name": "Jane",
    "Last Name": "Dorsey",
    "Company Name": "MediCare",
    "Role in Company": "Medical Engineer",
    Address: "11 Crown Street",
    Email: "jdorsey@mc.com",
  },
  {
    "Phone Number": "40735416854",
    "First Name": "Albert",
    "Last Name": "Kipling",
    "Company Name": "Waterfront",
    "Role in Company": "Accountant",
    Address: "22 Guild Street",
    Email: "kipling@waterfront.com",
  },
  {
    "Phone Number": "40733652145",
    "First Name": "Michael",
    "Last Name": "Robertson",
    "Company Name": "MediCare",
    "Role in Company": "IT Specialist",
    Address: "17 Farburn Terrace",
    Email: "mrobertson@mc.com",
  },
  {
    "Phone Number": "40799885412",
    "First Name": "Doug",
    "Last Name": "Derrick",
    "Company Name": "Timepath Inc.",
    "Role in Company": "Analyst",
    Address: "99 Shire Oak Road",
    Email: "dderrick@timepath.co.uk",
  },
  {
    "Phone Number": "40733154268",
    "First Name": "Jessie",
    "Last Name": "Marlowe",
    "Company Name": "Aperture Inc.",
    "Role in Company": "Scientist",
    Address: "27 Cheshire Street",
    Email: "jmarlowe@aperture.us",
  },
  {
    "Phone Number": "40712462257",
    "First Name": "Stan",
    "Last Name": "Hamm",
    "Company Name": "Sugarwell",
    "Role in Company": "Advisor",
    Address: "10 Dam Road",
    Email: "shamm@sugarwell.org",
  },
  {
    "Phone Number": "40731254562",
    "First Name": "Michelle",
    "Last Name": "Norton",
    "Company Name": "Aperture Inc.",
    "Role in Company": "Scientist",
    Address: "13 White Rabbit Street",
    Email: "mnorton@aperture.us",
  },
  {
    "Phone Number": "40741785214",
    "First Name": "Stacy",
    "Last Name": "Shelby",
    "Company Name": "TechDev",
    "Role in Company": "HR Manager",
    Address: "19 Pineapple Boulevard",
    Email: "sshelby@techdev.com",
  },
  {
    "Phone Number": "40731653845",
    "First Name": "Lara",
    "Last Name": "Palmer",
    "Company Name": "Timepath Inc.",
    "Role in Company": "Programmer",
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
    headless: true
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
 * @description goes to the webpage and extract the data to store on a csv file
 * @param {puppeteer.Page} page 
 * @param {number} day 
 * @param {string} strDate 
 */
const fillData = async (page, data) => {
  await page.waitForSelector('input[value="Submit"]')
  await page.type('input[ng-reflect-name="labelPhone"]', data["Phone Number"])
  await page.type('input[ng-reflect-name="labelLastName"]', data["Last Name"])
  await page.type('input[ng-reflect-name="labelEmail"]', data["Email"])
  await page.type('input[ng-reflect-name="labelCompanyName"]', data["Company Name"])
  await page.type('input[ng-reflect-name="labelRole"]', data["Role in Company"])
  await page.type('input[ng-reflect-name="labelAddress"]', data["Address"])
  await page.type('input[ng-reflect-name="labelFirstName"]', data["First Name"])
  await page.click('input[value="Submit"]')
  
}