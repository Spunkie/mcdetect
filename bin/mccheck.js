#!/usr/bin/env node

const puppeteer = require('puppeteer');
const chalk = require('chalk');

console.log(process.argv.length);
const argv = require('yargs')
  .usage('Usage: $0 [url ...] [options]')
  .config().alias('c', 'config')
  .option('e', {
    alias: 'errexit',
    describe: 'exit if a target URL cannot be fetched',
    boolean: true })
  .help().alias('h', 'help')
  .argv;

(async function scan() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const failedReqs = {};

  var mcWarnings = 0;
  var mcErrors = 0;
  var cleanTargets = 0;
  var dirtyTargets = 0;

  page.on('requestfailed', r => {
    failedReqs[r._requestId] = r.url;
  });

  page._client.on('Network.loadingFailed', r => {
    if (r['blockedReason'] == 'mixed-content') {
      console.log(chalk.red("\tBLOCKED: ") + failedReqs[r['requestId']]);
      mcErrors++;
    }
  });

  page._client.on('Network.requestWillBeSent', r => {
    if (r['request']['mixedContentType'] == 'optionally-blockable') {
      console.log(chalk.yellow("\tWARNING: ") + r.request.url);
      mcWarnings++;
    }
  });

  targets = argv._.concat(argv.targets);

  for (let t of targets) {
    console.log(chalk.cyan("Checking ") + t + " ...");

    try {
      await page.goto(t);
    } catch(e) {
      console.log("\t"+chalk.red(e));
      if (argv.errexit)
        process.exit(1);
    }
  }

  console.log(
    "Checked " + targets.length + " targets in total | " +
    "Total blocked resources: " + mcErrors + " | " +
    "Total warnings ('optionally-blockable'): " + mcErrors
  );

  browser.close();
})();