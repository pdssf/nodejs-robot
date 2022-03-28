const puppeteer = require("puppeteer");
const fs = require("fs");
const sessionsSiteArray = [{
  site: 'https://webmedia.org.br/2020/programacao-em-html/#st1',
	year: 2020
	},{
		site: 'https://webmedia.org.br/2019/programacao-em-html/#st1',
		year: 2019
	}
];

const sessionsArray = []

/**
 * @description main arrow function that prepares the ambient
 */
;(async () => {
  console.time("inicio");

  // launches the browser and configure it to not download any media, making the navigation faster
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
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
  
  for (const site of sessionsSiteArray){
		await page.goto(site.site)
		await page.waitForTimeout(1000)
		await getData(page, site)
		await page.waitForTimeout(10000)
	}
  process.exit(0)
})();


/**
 * @description goes to the webpage and extract the data to store on a csv file
 * @param {puppeteer.Page} page 
 * @param {number} day 
 * @param {string} strDate 
 */
const getData = async (page, data) => {
	const sessions = (await page.$x(`//p[contains(., 'ST')]`))[0]
	const sessionsNum = await sessions.$$eval('a', e => e.length)
	console.log('temos', sessionsNum, 'sessoes')
	const sessionsNameTemp = await page.$$eval('h4', e => e.map((e) => e.textContent))
	console.log({sessionsNameTemp})
	const sessionsName = sessionsNameTemp.map(e => {
		if(e.includes('ST')) return e
	})
	const sessionsParagraph = await page.$$('p')
	let chair
	let actualSession
	let counter = 0
	for(const p of sessionsParagraph){
		let pText = (await p.evaluate(el => el.textContent)).replace(/\n/g, '').replace('  ', ' ')
		if(pText?.includes('Chair') || pText?.includes('chair') ){
			actualSession = sessionsName[counter]
			chair = pText.replace('Chair: ', '').replace('chair: ', '')
			counter++
			if(counter > sessionsNum) {
				console.log('fim das sessões tecnicas')
				break
			}
		}else if(counter > 0){
			const title = (await p.$$eval('strong', e => e.map((e) => e.textContent))).join('').replace('\n', '')
			const author = pText.replace(title, '')
			sessionsArray.push({
				name: actualSession,
				chair,
				title,
				author
			})
			console.log({title, author})
		}
	}
	console.log(sessionsArray)
	printToFile(sessionsArray, data.year)
}

const printToFile = (data, year) => {
	fs.writeFileSync(`./webmedia_${year}.json`, JSON.stringify(data))
	fs.writeFileSync(`./webmedia_${year}.csv`, `sessao_tecnica;cadeira;artigo;autores\n`)
	for(const obj of data){
		fs.appendFileSync(`./webmedia_${year}.csv`, `${obj.name};${obj.chair};${obj.title};${obj.author}\n`)
	}
}