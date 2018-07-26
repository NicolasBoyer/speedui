#!/usr/bin/env node

"use strict";

const files = require("../tools/files");
const tools = require("../tools/tools");

// Permet de créer la librairie avec l'aide du tsconfig
files.remove("./library");
const tsConfig = {
    "extends": "../../tsconfig.json",
    "include": ["../../src/index.ts"]
}
const tsConfigPath = "./scripts/tmp";
files.appendFile(tsConfigPath + "/tsConfig.json", JSON.stringify(tsConfig, null, 2), true)
tools.runCommand("tsc --p " + tsConfigPath, () => files.remove(tsConfigPath));