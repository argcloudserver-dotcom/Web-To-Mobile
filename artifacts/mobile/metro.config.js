const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Block Metro from watching server-only packages that create temp dirs
// (e.g. exceljs creates _tmp_ dirs that disappear before Metro can watch them)
const blockList = config.resolver.blockList
  ? Array.isArray(config.resolver.blockList)
    ? config.resolver.blockList
    : [config.resolver.blockList]
  : [];

config.resolver.blockList = [
  ...blockList,
  /node_modules\/.*\/exceljs_tmp_.*/,
  /node_modules\/.pnpm\/exceljs.*/,
  /node_modules\/exceljs\/.*/,
  /node_modules\/sharp\/.*/,
  /node_modules\/nodemailer\/.*/,
  /node_modules\/passport\/.*/,
  /node_modules\/passport-google-oauth20\/.*/,
  /node_modules\/passport-facebook\/.*/,
];

module.exports = config;
