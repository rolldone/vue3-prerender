const InitCheckRoute = async (to, from, done, nextMiddleware) => {
  console.log("to", to);
  console.log("from", from);
  switch (to.name) {
    case "auth.login":
    case "auth.register":
    case "auth.oauth.callback":
    case "auth.logout":
      /* Just cut this section, dont let next middleware*/
      return done();
    default:
      break;
  }
  nextMiddleware();
};

export default InitCheckRoute;
