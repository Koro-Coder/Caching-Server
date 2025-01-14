#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const open = require('open'); 

const CACHE_FILE = path.resolve(__dirname, "cache.json");
const CACHE_LIMIT = 10; // Maximum number of entries in the cache

const program = new Command();

const loadCache = () => {
  if (fs.existsSync(CACHE_FILE)) {
    const data = fs.readFileSync(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  }
  return {};
};

const saveCache = (cache) => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
};

const clearCache = () => {
  if (fs.existsSync(CACHE_FILE)) {
    fs.unlinkSync(CACHE_FILE);
  }
  console.log("Cache cleared.");
};

program
  .option("--port <number>", "Port on which the proxy server runs", parseInt)
  .option("--url <url>", "Origin URL to forward requests")
  .option("--clear-cache", "Clear the cache and exit", false)
  .action(async (options) => {
    const { port, url, clearCache: shouldClearCache } = options;

    if (shouldClearCache) {
      clearCache();
      return;
    }

    if (!url) {
      program.error("Argument for --url are required.");
      return;
    }

    const cache = loadCache();

    if (cache[url]) {
      console.log("Cache hit:", cache[url].response);
      cache[url].timestamp = Date.now();
      saveCache(cache);
    } else {
      try {
        const response = await axios.get(url);
        console.log("Cache miss:", response.data);

        cache[url] = {
          response: response.data,
          timestamp: Date.now(),
        };

        const keys = Object.keys(cache);
        if (keys.length > CACHE_LIMIT) {
          const lruKey = keys.reduce((oldest, key) =>
            cache[key].timestamp < cache[oldest].timestamp ? key : oldest
          );
          delete cache[lruKey];
        }

        saveCache(cache);
      } catch (err) {
        console.error("Error fetching URL:", err.message);
      }
    }

    const filePath = path.join(__dirname, "cached-response.html");

    // Write the response body to the file
    fs.writeFileSync(filePath, cache[url].response);

    // Open the saved HTML file in the browser
    console.log(`Saved content to ${filePath}`);
    open(filePath); // Open the HTML file in the browser
    console.log("Opening the response in the browser...");
    console.log();
  });

program.parse();
