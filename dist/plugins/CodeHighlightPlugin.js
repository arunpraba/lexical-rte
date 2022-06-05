"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CodeHighlightPlugin;

require("core-js/modules/web.dom-collections.iterator.js");

var _code = require("@lexical/code");

var _LexicalComposerContext = require("@lexical/react/LexicalComposerContext");

var _react = require("react");

function CodeHighlightPlugin() {
  const [editor] = (0, _LexicalComposerContext.useLexicalComposerContext)();
  (0, _react.useEffect)(() => {
    return (0, _code.registerCodeHighlighting)(editor);
  }, [editor]);
  return null;
}