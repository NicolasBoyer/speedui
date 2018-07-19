#!/usr/bin/env node

"use strict";

const files = require("../tools/files");
const tools = require("../tools/tools");

// Permet de créer la librairie avec l'aide du tsconfig et de ce qui est dans src (avec namespace et export) dans le dossier library
files.remove("../library");
tools.runCommand("tsc");