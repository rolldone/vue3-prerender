const NotifRouteChange = async function(to, from, done, nextMiddleware) {
  try {
    console.log('from',from);
    console.log('to',to);
    window.masterData.saveData('url_update',{
      from : from,
      to : to
    });
    nextMiddleware();
  } catch (ex) {
    console.error("NotifRouteChange - ex", ex);
  }
};

export default NotifRouteChange;
