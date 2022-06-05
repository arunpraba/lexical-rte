"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ListMaxIndentLevelPlugin;

require("core-js/modules/web.dom-collections.iterator.js");

var _list = require("@lexical/list");

var _LexicalComposerContext = require("@lexical/react/LexicalComposerContext");

var _lexical = require("lexical");

var _react = require("react");

function getElementNodesInSelection(selection) {
  const nodesInSelection = selection.getNodes();

  if (nodesInSelection.length === 0) {
    return new Set([selection.anchor.getNode().getParentOrThrow(), selection.focus.getNode().getParentOrThrow()]);
  }

  return new Set(nodesInSelection.map(n => (0, _lexical.$isElementNode)(n) ? n : n.getParentOrThrow()));
}

function isIndentPermitted(maxDepth) {
  const selection = (0, _lexical.$getSelection)();

  if (!(0, _lexical.$isRangeSelection)(selection)) {
    return false;
  }

  const elementNodesInSelection = getElementNodesInSelection(selection);
  let totalDepth = 0;

  for (const elementNode of elementNodesInSelection) {
    if ((0, _list.$isListNode)(elementNode)) {
      totalDepth = Math.max((0, _list.$getListDepth)(elementNode) + 1, totalDepth);
    } else if ((0, _list.$isListItemNode)(elementNode)) {
      const parent = elementNode.getParent();

      if (!(0, _list.$isListNode)(parent)) {
        throw new Error("ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent.");
      }

      totalDepth = Math.max((0, _list.$getListDepth)(parent) + 1, totalDepth);
    }
  }

  return totalDepth <= maxDepth;
}

function ListMaxIndentLevelPlugin(_ref) {
  let {
    maxDepth
  } = _ref;
  const [editor] = (0, _LexicalComposerContext.useLexicalComposerContext)();
  (0, _react.useEffect)(() => {
    return editor.registerCommand(_lexical.INDENT_CONTENT_COMMAND, () => !isIndentPermitted(maxDepth !== null && maxDepth !== void 0 ? maxDepth : 7), _lexical.COMMAND_PRIORITY_HIGH);
  }, [editor, maxDepth]);
  return null;
}