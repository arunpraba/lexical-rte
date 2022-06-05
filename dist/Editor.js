"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = void 0;

var _LexicalComposer = require("@lexical/react/LexicalComposer");

var _LexicalRichTextPlugin = require("@lexical/react/LexicalRichTextPlugin");

var _LexicalContentEditable = require("@lexical/react/LexicalContentEditable");

var _LexicalHistoryPlugin = require("@lexical/react/LexicalHistoryPlugin");

var _LexicalAutoFocusPlugin = require("@lexical/react/LexicalAutoFocusPlugin");

var _richText = require("@lexical/rich-text");

var _table = require("@lexical/table");

var _list = require("@lexical/list");

var _code = require("@lexical/code");

var _link = require("@lexical/link");

var _LexicalLinkPlugin = require("@lexical/react/LexicalLinkPlugin");

var _LexicalListPlugin = require("@lexical/react/LexicalListPlugin");

var _LexicalMarkdownShortcutPlugin = require("@lexical/react/LexicalMarkdownShortcutPlugin");

var _markdown = require("@lexical/markdown");

var _ExampleTheme = _interopRequireDefault(require("./themes/ExampleTheme"));

var _ListMaxIndentLevelPlugin = _interopRequireDefault(require("./plugins/ListMaxIndentLevelPlugin"));

var _CodeHighlightPlugin = _interopRequireDefault(require("./plugins/CodeHighlightPlugin"));

var _AutoLinkPlugin = _interopRequireDefault(require("./plugins/AutoLinkPlugin"));

var _ToolbarPlugin = _interopRequireDefault(require("./plugins/ToolbarPlugin"));

var _StatePlugin = _interopRequireDefault(require("./plugins/StatePlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Placeholder() {
  return /*#__PURE__*/React.createElement("div", {
    className: "editor-placeholder"
  }, "Enter some rich text...");
}

const editorConfig = {
  // The editor theme
  theme: _ExampleTheme.default,

  // Handling of errors during update
  onError(error) {
    throw error;
  },

  // Any custom nodes go here
  nodes: [_richText.HeadingNode, _list.ListNode, _list.ListItemNode, _richText.QuoteNode, _code.CodeNode, _code.CodeHighlightNode, _table.TableNode, _table.TableCellNode, _table.TableRowNode, _link.AutoLinkNode, _link.LinkNode]
};

const Editor = _ref => {
  let {
    value,
    onInit,
    onChange,
    onSave
  } = _ref;
  return /*#__PURE__*/React.createElement(_LexicalComposer.LexicalComposer, {
    initialConfig: editorConfig
  }, /*#__PURE__*/React.createElement("div", {
    className: "editor-container"
  }, /*#__PURE__*/React.createElement(_ToolbarPlugin.default, {
    onSave: onSave
  }), /*#__PURE__*/React.createElement("div", {
    className: "editor-inner"
  }, /*#__PURE__*/React.createElement(_LexicalRichTextPlugin.RichTextPlugin, {
    contentEditable: /*#__PURE__*/React.createElement(_LexicalContentEditable.ContentEditable, {
      className: "editor-input"
    }),
    placeholder: /*#__PURE__*/React.createElement(Placeholder, null)
  }), /*#__PURE__*/React.createElement(_LexicalHistoryPlugin.HistoryPlugin, null), /*#__PURE__*/React.createElement(_LexicalAutoFocusPlugin.AutoFocusPlugin, null), /*#__PURE__*/React.createElement(_CodeHighlightPlugin.default, null), /*#__PURE__*/React.createElement(_LexicalListPlugin.ListPlugin, null), /*#__PURE__*/React.createElement(_LexicalLinkPlugin.LinkPlugin, null), /*#__PURE__*/React.createElement(_AutoLinkPlugin.default, null), /*#__PURE__*/React.createElement(_ListMaxIndentLevelPlugin.default, {
    maxDepth: 7
  }), /*#__PURE__*/React.createElement(_LexicalMarkdownShortcutPlugin.MarkdownShortcutPlugin, {
    transformers: _markdown.TRANSFORMERS
  }), /*#__PURE__*/React.createElement(_StatePlugin.default, {
    onInit: onInit,
    value: value,
    onChange: onChange
  }))));
};

exports.Editor = Editor;