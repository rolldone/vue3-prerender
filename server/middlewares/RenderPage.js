const puppeteer = require('puppeteer');
const ua = require('useragent');
var config = require("../../config/server/main.js");
config = config.create();
const _ = require('lodash');

function isBot (useragent) {
  const agent = ua.is(useragent);
    return !agent.webkit && !agent.opera && !agent.ie &&
        !agent.chrome && !agent.safari && !agent.mobile_safari &&
        !agent.firefox && !agent.mozilla && !agent.android;
}

var Cache = {};
var browser = null;
var runnerBrowser = (async function(){
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
  });
  browser.on('disconnected', runnerBrowser);
  /* Puppeteer opens an empty tab in non-headless mode */
  /* You can add this to automatically close the first "blank" page whenever you open a new page. */
  browser.on('targetcreated', async function f() {
    let pages = await browser.pages();
    if (pages.length > 1) {
        await pages[0].close();
        browser.off('targetcreated', f);
    }
  });
});
runnerBrowser();

module.exports = async function(req,res,next){
  /* For index path access will detect null "req.protocol + "://" + req.get('host') + req.path" */
  /* So use exception handling to get referer */
  const local_url = req.headers.referer || req.protocol + "://" + req.get('host') + req.path;
  
  let checkExist = req.headers['user-agent'].match(/MY_SYSTEM/g) || [];

  /* If get cache load cache */
  if(Cache[local_url] != null){
    console.log('Cache -> ',local_url);
    res.send(Cache[local_url]);
    return;
  }

  /* Only real user agent get block at here */
  if(!isBot(req.headers['user-agent'])){
    let Lighthouse = req.headers['user-agent'].match(/Chrome-Lighthouse/g) || [];
    if(Lighthouse.length == 0){
      return next();
    }
  }
  
  var page = null;
  if (checkExist.length > 0) {
    next();
  } else {
    try {
        let html = null;
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        await page.setUserAgent(req.headers['user-agent']+' MY_SYSTEM');
        switch (config.env) {
          case "development":
          case "dev":
            /* Karena pake hammer SPA jangan gunakan waitUntil */
            await page.goto(local_url);
            break;
          case "production":
          case "devserver":
            await page.goto(local_url,{
              waitUntil: "networkidle0"
            });
            break;
        }
          
        // await page.waitForSelector('#mapsingleid');    
        html = await page.evaluate(() => {
            document.querySelector('#nprogress').outerHTML = null;
            /* Any method to access full html content? */
            return new XMLSerializer().serializeToString(document.doctype)+document.documentElement.outerHTML;
        });
        Cache[local_url] = html;
        // await page.goto('about:blank');
        await page.close();
        closeOne();
        res.send(html);
        return;
    } catch (err) {
        // await page.goto('about:blank');
        await page.close();
        closeOne();
        console.log('content -> ',err);
        next();
    }
  }
}

var pendingDebounce = null;
var closeOne = function(){
  if(pendingDebounce != null){
    pendingDebounce.cancel();
  }
  pendingDebounce = _.debounce(async function(){
    console.log('(await browser.pages()).length',(await browser.pages()).length)
    if ((await browser.pages()).length == 1 || (await browser.pages()).length == 0) {
      browser.close();
    }
  },120000);
  pendingDebounce();
}