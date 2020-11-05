var UberProto = require('uberproto');

const Main = UberProto.extend({
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3006,
})

module.exports = Main;