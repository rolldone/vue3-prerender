const DeviceDetector = require("device-detector-js");

module.exports = async function(req,res,next){
  const deviceDetector = new DeviceDetector();
  const local_url = req.protocol + "://" + req.get('host') + req.originalUrl;
  const device = deviceDetector.parse(req.headers['user-agent']);
  // console.log('deviceDetector url',local_url);
  console.log('device',device);
  next();
}