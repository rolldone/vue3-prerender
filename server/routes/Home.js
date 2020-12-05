var express = require('express');
var router = express.Router();
const RenderPage = require('../middlewares/RenderPage');
const UserAgentInfo = require('../middlewares/UserAgentInfo');

module.exports = function(props){
  router.get("/*",[UserAgentInfo,RenderPage],function (req, res) {
    res.render(props.basePath + "/views/v1/"+props.viewModeFolder+"/main", {title: 'Artyplanet', date: props.versionCompile});
    // res.sendFile(__dirname + "/dist/index.html");
    /* res.sendFile(__dirname + "/views/index.html"); */
  });
  return router; 
};