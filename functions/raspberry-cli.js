#!/usr/bin/env node
// node ./raspberry-cli.js path/to/input.raspberry.json path/to/output.jsx

const fs = require('fs')
const raspberry = require('./raspberry-core')

//Input and output paths
const path = {
    input: process.argv[2],
    output: process.argv[3]
}

const rFileJSON = JSON.parse(String(fs.readFileSync(path.input)))
const jsx = raspberry(rFileJSON)

fs.writeFileSync(path.output, jsx)
