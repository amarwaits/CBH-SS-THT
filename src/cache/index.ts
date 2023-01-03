const NodeCache = require('node-cache')

export const MyCache = new NodeCache({ stdTTL: 0, checkperiod: 120 });