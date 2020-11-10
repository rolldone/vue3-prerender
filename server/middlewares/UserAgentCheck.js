const puppeteer = require('puppeteer');
const ua = require('useragent');

function isBot (useragent) {
  const agent = ua.is(useragent);
    return !agent.webkit && !agent.opera && !agent.ie &&
        !agent.chrome && !agent.safari && !agent.mobile_safari &&
        !agent.firefox && !agent.mozilla && !agent.android;
}

var Cache = {};

module.exports = async function(req,res,next){
  
  console.log('req',req.headers.referer);
  const local_url = req.headers.referer || req.protocol + "://" + req.get('host') + req.path;
  console.log('local_url',local_url);  

  console.log('user-agent -> ',req.headers['user-agent']);
  let checkExist = req.headers['user-agent'].match(/MY_SYSTEM/g) || [];
  // console.log('checkExist -> ',checkExist);
  if(!isBot(req.headers['user-agent'])){
    let Lighthouse = req.headers['user-agent'].match(/Chrome-Lighthouse/g) || [];
    if(Lighthouse.length == 0){
      // console.log('Bukan Crawling');
      return next();
    }
  }
  if (checkExist.length > 0) {
    // console.log('Deteck Dari Crawling');
    next();
  } else {
      try {
          let html = null;
          if(Cache[local_url] != null){
              console.log('Cache -> ',local_url);
              console.log('Content ->',Cache[local_url]);
              res.send(Cache[local_url]);
              return;
          }
          const browser = await puppeteer.launch({
            // executablePath: await chromium.executablePath,
            // args: chromium.args,
            // defaultViewport: chromium.defaultViewport,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox'
            ],
          })
          const page = await browser.newPage();
          await page.setDefaultNavigationTimeout(60000);
          await page.setUserAgent(req.headers['user-agent']+' MY_SYSTEM');
          
          // await page.waitForTimeout(10000);
          await page.goto(local_url,{
            waitUntil: "networkidle0"
          });  
          // await page.waitForSelector('#mapsingleid');    
          html = await page.evaluate(() => {
              return document.documentElement.innerHTML;
          });
          Cache[local_url] = html;
          await browser.close();
          res.send(html);
      } catch (err) {
          console.log('content -> ',err);
          next();
      }
  }
}