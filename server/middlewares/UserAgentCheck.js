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
    // executablePath: await chromium.executablePath,
    // args: chromium.args,
    // defaultViewport: chromium.defaultViewport,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
  });
  browser.on('disconnected', runnerBrowser);
});
runnerBrowser();
module.exports = async function(req,res,next){
  console.log('req',req.headers.referer);
  const local_url = req.headers.referer || req.protocol + "://" + req.get('host') + req.path;
  console.log('local_url',local_url);  

  console.log('user-agent -> ',req.headers['user-agent']);
  let checkExist = req.headers['user-agent'].match(/MY_SYSTEM/g) || [];
  // console.log('checkExist -> ',checkExist);
  // if(!isBot(req.headers['user-agent'])){
  //   let Lighthouse = req.headers['user-agent'].match(/Chrome-Lighthouse/g) || [];
  //   if(Lighthouse.length == 0){
  //     // console.log('Bukan Crawling');
  //     return next();
  //   }
  // }
  var page = null;
  if (checkExist.length > 0) {
    // console.log('Deteck Dari Crawling');
    next();
  } else {
      try {
          let html = null;
          // if(Cache[local_url] != null){
          //     console.log('Cache -> ',local_url);
          //     console.log('Content ->','Cache[local_url]');
          //     res.send(Cache[local_url]);
          //     return;
          // }
          
          
          console.log('acccesss it');
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
              return document.documentElement.innerHTML;
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