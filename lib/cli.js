import arg from 'arg';
import fs from 'fs';
import path from 'path';
import clc from "cli-color";
import { spawn } from 'child_process';

import normalizeUrl from './os';

import defaultConfigs from './config';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--config': String,
      '--dev': Boolean,
      '--bundle': Boolean,
      '--release': Boolean,
      '--for-cdn': Boolean,
      '--no-bundle': Boolean,
      '--analyze': Boolean,
      '--port': Number,
      '--ssr': Boolean,
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  const argsList = removeUnneccesaryValueInObject({
    port: args['--port'],
    dev: args['--dev'],
    bundle: args['--bundle'],
    noBundle: args['--no-bundle'],
    analyze: args['--analyze'],
    configFile: args['--config'],
    ssr: args['--ssr'],
  });

  return argsList;
}

function getVoltranConfigs(configFile) {
  const normalizePath =  normalizeUrl(path.resolve(__dirname));
  const dirName = normalizePath.indexOf('node_modules') > -1 ?
    normalizePath.split('/node_modules')[0] :
    normalizePath.split('voltran/lib')[0] + 'voltran';
  const voltranConfigs = require(path.resolve(dirName, configFile));

  return voltranConfigs;
}

function removeUnneccesaryValueInObject(argsList) {
  for (const property in argsList) {
    if (argsList[property] === undefined) {
      delete argsList[property];
    }
  }

  return argsList;
}

function runDevelopmentMode() {
  const run = require('../src/tools/run');
  const start = require('../src/tools/start');

  run(start);
}

function runProductionMode(voltranConfigs, onlyBundle) {
  const bundle = require('../src/tools/bundle');

  bundle()
    .then((res) => {
      console.log(clc.green('Bundle is completed.\n',`File: ${voltranConfigs.distFolder}/server/server.js`));

      if (!onlyBundle) {
        serve(voltranConfigs);
      }
    });
}

function serve(voltranConfigs) {
  console.log(clc.green('Project Serve is starting...'));

  const out = spawn('node', [
    '-r',
    'source-map-support/register',
    '--max-http-header-size=20480',
    `${voltranConfigs.distFolder}/server/server.js`
  ], {env: {'NODE_ENV': 'production', ...process.env}});

  out.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  out.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  out.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function checkRequiredVariables(mergeConfigs) {
  if (!mergeConfigs.prefix) {
    console.log(clc.red("***ERROR*** - 'prefix' is required"));
    console.log(clc.red("Please add 'prefix' value to your config file"));

    return false;
  }

  return true;
}

export function cli(args) {
  const argumentList = parseArgumentsIntoOptions(args);
  console.log(clc.blue(JSON.stringify(argumentList)));
  const voltranConfigs = argumentList.configFile ? getVoltranConfigs(argumentList.configFile) : {};
  const assignedArgsAndVoltranConfigs = Object.assign(voltranConfigs, argumentList);
  const mergeAllConfigs = Object.assign(defaultConfigs, assignedArgsAndVoltranConfigs);
  const isValid = checkRequiredVariables(mergeAllConfigs);

  if (isValid) {
    const createdConfig = `module.exports = ${JSON.stringify(mergeAllConfigs)}`;

    fs.writeFile(path.resolve(__dirname, '../voltran.config.js'), createdConfig, function (err) {
      if (err) throw err;

      console.log('File is created successfully.', mergeAllConfigs.dev);

      if (mergeAllConfigs.dev) {
        runDevelopmentMode();
      } else {
        argumentList.noBundle ?
          serve(voltranConfigs) :
          runProductionMode(mergeAllConfigs, argumentList.bundle);
      }
    });
  } else {
    return false;
  }
}
