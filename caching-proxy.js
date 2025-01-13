const { Command } = require('commander');
const express = require('express');
//const fetch = require('node-fetch');

const program = new Command();
const app = express();
const cache = new Map();

program
    .option('-p, --port<number>', 'Port number for the proxy server', parseInt)
    .action(()=>{
        console.log('Hello')
    })