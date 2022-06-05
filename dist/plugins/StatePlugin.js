"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = StatePlugin;

require("core-js/modules/web.dom-collections.iterator.js");

var _LexicalComposerContext = require("@lexical/react/LexicalComposerContext");

var _LexicalOnChangePlugin = require("@lexical/react/LexicalOnChangePlugin");

var _react = require("react");

const noop = () => {};

const defaultState = {
  value: "",
  onChange: noop,
  onInit: noop
};

function StatePlugin() {
  let {
    value,
    onChange,
    onInit
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  const [editor] = (0, _LexicalComposerContext.useLexicalComposerContext)();
  (0, _react.useEffect)(() => {
    if (typeof onInit === "function") {
      onInit(editor);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  (0, _react.useEffect)(() => {
    if (value) {
      editor.setEditorState(editor.parseEditorState(value));
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [editor]);
  return /*#__PURE__*/React.createElement(_LexicalOnChangePlugin.OnChangePlugin, {
    onChange: onChange
  });
}