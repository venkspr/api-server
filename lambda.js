'use strict'
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./lib/index');
const server = awsServerlessExpress.createServer(index);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
