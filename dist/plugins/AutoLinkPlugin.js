"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PlaygroundAutoLinkPlugin;

require("core-js/modules/es.regexp.exec.js");

var _react = _interopRequireDefault(require("react"));

var _LexicalAutoLinkPlugin = require("@lexical/react/LexicalAutoLinkPlugin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const EMAIL_MATCHER = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const MATCHERS = [text => {
  const match = URL_MATCHER.exec(text);
  return match && {
    index: match.index,
    length: match[0].length,
    text: match[0],
    url: match[0]
  };
}, text => {
  const match = EMAIL_MATCHER.exec(text);
  return match && {
    index: match.index,
    length: match[0].length,
    text: match[0],
    url: "mailto:".concat(match[0])
  };
}];

function PlaygroundAutoLinkPlugin() {
  return /*#__PURE__*/_react.default.createElement(_LexicalAutoLinkPlugin.AutoLinkPlugin, {
    matchers: MATCHERS
  });
}