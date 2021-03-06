const puppeteer = require('puppeteer');
const ua = require('useragent');
var config = require("../../config/server/main.js");
config = config.create();
const _ = require('lodash');
var urlModule = require('url');
const URL = urlModule.URL;

function isBot (useragent) {
  const agent = ua.is(useragent);
    return !agent.webkit && !agent.opera && !agent.ie &&
        !agent.chrome && !agent.safari && !agent.mobile_safari &&
        !agent.firefox && !agent.mozilla && !agent.android;
}

var CurrentUrlWorking = {};
var Cache = {};
var browser = null;
var runnerBrowser = (async function(){
  browser = await puppeteer.launch({
    args: [
      "--window-size=1280,768",
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    headless : true
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
  const local_url = req.protocol + "://" + req.get('host') + req.originalUrl;
  console.log('url path ',req.protocol + "://" + req.get('host') + req.path);
  console.log('step 1 - local_url ->',local_url);

  let checkExist = req.headers['user-agent'].match(/MY_SYSTEM/g) || [];

  /* Only real user agent get block at here */
  if(!isBot(req.headers['user-agent'])){
    let Lighthouse = req.headers['user-agent'].match(/Chrome-Lighthouse/g) || [];
    if(Lighthouse.length == 0){      
      /* If get cache load cache */
      if(loadCache(local_url,req,res) == true){
        console.log('GET CACHE');
        res.send(Cache[local_url]);
        return;
      }
      next();
      return;
    }
  }
  
  var page = null;
  if (checkExist.length > 0) {
    console.log('step 2 - Detect User Agent - closed ->',checkExist);
    next();
    return;
  } else {
    try {
        let html = null;
        let pages = await browser.pages();
        let existPage = null;
        let stylesheetContents = {};
        if(CurrentUrlWorking[local_url] != null){
          for(var a=0;a<pages.length;a++){
            var pageItem = pages[a];
            if(local_url == pageItem._target._targetInfo.url){
              existPage = pageItem;
              console.log('GOT DUPLICATE!');
              break;
            }
          }
        }
        
        if(existPage != null){
          if(existPage.isClosed()){
            if(Cache[local_url] != null){
              console.log('step 2 - existPage.isClosed() - closed ->','SECOND REQUEST USING CACHED');
              res.send(Cache[local_url]);
            }
            return 
          }
          existPage.on('close', async () => {
            console.log('SECOND REQUEST USING SAME ARE CLOSED');
            res.send(Cache[local_url]);
          });
          console.log('SECOND REQUEST USING SAME PAGE FOR EVALUATE');
          /* Just waiting it but send data use cache that saved */
          
          // res.send();
          // res.send('Please wait! Still On Rendering!');
          return;
        }else{
          if(CurrentUrlWorking[local_url] != null){
            /* Important filter */
            /* If get big concurent at the same time Dont give ssr just let user get spa only */
            console.log('If get big concurent at the same time Dont give ssr just let user get spa only');
            return next();
          }
        }

        /* If get cache load cache */
        if(loadCache(local_url,req,res) == true){
          console.log('GET CACHE');
          res.send(Cache[local_url]);
          return;
        }

        /* Give the clue this url is working */
        CurrentUrlWorking[local_url] = local_url;

        let page = await browser.newPage();
        page.setViewport({
          width: 1280,
          height: 768,
        });
        await page.setDefaultNavigationTimeout(12000);

        /* Optimation */
        /* 1. Intercept network requests. */
        await page.setRequestInterception(true);
        page.on('request', req => {
          // 2. Ignore requests for resources that don't produce DOM          
          /* block : stylesheet */
          const allowlist = ['eventsource','image','other','document', 'script', 'xhr', 'fetch'];
          if (!allowlist.includes(req.resourceType())) {
            console.log('req.resourceType() - ada yang kena blocked ',req.resourceType());
            return req.abort();
          }

          // console.log('req.resourceType() - all',req.resourceType());

          /* Avoid inflating Analytics pageviews */
          /* Don't load Google Analytics lib requests so pageviews aren't 2x. */
          const blocklist = ['www.google-analytics.com', '/gtag/js', 'ga.js', 'analytics.js'];
          if (blocklist.find(regex => req.url().match(regex))) {
            return req.abort();
          }

          /* 3. Pass through all other requests. */
          req.continue();
        });

        page.on('console', message => {
          if(message.type().substr(0, 3).toUpperCase() == "ERR"){
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
          }
          if(message.type().substr(0, 3).toUpperCase() == "LOG"){
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
          }
        });

        // .on('pageerror', ({ message }) => console.log(message))
        // page.on('response', async resp => {
        //   const responseUrl = resp.url();
        //   const sameOrigin = new URL(responseUrl).origin === new URL(local_url).origin;
        //   const isStylesheet = resp.request().resourceType() === 'stylesheet';
        //   if (sameOrigin && isStylesheet) {
        //     stylesheetContents[responseUrl] = await resp.text();
        //   }
        // });
        // .on('requestfailed', request =>
        //   console.log(`${request.failure().errorText} ${request.url()}`))

        await page.setUserAgent(req.headers['user-agent']+' MY_SYSTEM');
        switch (config.env) {
          case "development":
          case "dev":
            /* Karena pake hammer SPA jangan gunakan waitUntil */
            /* Dan jangan di test di google light house karena ada webpack hammr */
            /* Kalo pengen ambil semua content sampai selesai gunakan  waitForSelector */
            await page.goto(local_url);
            await page.waitForSelector('#headless_done');  
            break;
          case "production":
          case "devserver":
            // await page.goto(local_url);
            console.log('go to',local_url);
            await page.goto(local_url,{
              // waitUntil: "networkidle0",
              timeout: 60000, 
              waitUntil: 'networkidle0'
            });
            break;
        }
        
        /* Cadangan */
        // await page.waitForSelector('#headless_done');  

        // Replace stylesheets in the page with their equivalent <style>.
        // await page.$$eval('link[rel="stylesheet"]', (links, content) => {
        //   links.forEach(link => {
        //     const cssText = content[link.href];
        //     if (cssText) {
        //       const style = document.createElement('style');
        //       style.textContent = cssText;
        //       link.replaceWith(style);
        //     }
        //   });
        // },stylesheetContents);

        html = await evaluatePage(page);
        console.log('rendered!!');
        Cache[local_url] = html;
        await page.close();
        delete CurrentUrlWorking[local_url];
        closeOne();
        res.send(html);
        console.log('DONE RENDERING');
        return;
    } catch (err) {
        if(page != null ){
          await page.close();
        }
        console.log('err - ',err);
        closeOne();
        res.send('on Rendering!');
    }
  }
}

var isUrlAsset = function(local_url,req){
  if(req.protocol + "://" + req.get('host') + req.path != local_url){
          /* For prevent asset */
    console.log('step 2 - is asset - closed ->',req.protocol + "://" + req.get('host') + req.path);
    // console.log('WRONG - MY_SYSTEM WRONG PLACE ',req.protocol + "://" + req.get('host') + req.path);
    return false;
  }
  console.log('aaaaaaa',req.protocol + "://" + req.get('host') + req.path);
  return false;
}

var evaluatePage = async function(page){
  return await page.evaluate(() => {
    try{
      var nprogress = document.querySelector('#nprogress') !== null;
      if (nprogress) {
        document.querySelector('#nprogress').outerHTML = null;
      }
      /* Any method to access full html content? */
      return new XMLSerializer().serializeToString(document.doctype)+document.documentElement.outerHTML;
    }catch(ex){
      console.log('evaluatePage - ex',ex.message);
      return null;
    }
  });
}

var loadCache = function(url,req,res){
  if(Cache[url] != null){
    return true;
  }
  return false;
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