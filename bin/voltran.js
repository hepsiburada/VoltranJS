#!/usr/bin/env node

require = require('esm')(module /*, options*/);
require('../lib/cli').cli(process.argv);