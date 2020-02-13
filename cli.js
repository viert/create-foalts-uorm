#!/usr/bin/env node
const nunjucks = require("nunjucks");
const path = require("path");
const fs = require("fs");

function processDirectory(srcDir, dstDir, ctx) {
  if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir);

  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    const src = path.join(srcDir, file);
    const dst = path.join(dstDir, file);
    const stat = fs.lstatSync(src);
    if (stat.isFile()) {
      console.log(`copying ${src} to ${dst}`);
      const result = nunjucks.render(src, ctx);
      fs.writeFileSync(dst, result);
    } else if (stat.isDirectory()) {
      processDirectory(src, dst, ctx);
    }
  });
}

if (process.argv.length !== 3) {
  console.warn("Usage: boilfoal <projectName>");
  process.exit();
}

const projectName = process.argv[2];
const boilerDir = path.join(__dirname, "boilerplate");
const projectDir = path.join(process.cwd(), projectName);

processDirectory(boilerDir, projectDir, { projectName });
