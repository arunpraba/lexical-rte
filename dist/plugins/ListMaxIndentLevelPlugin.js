"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ListMaxIndentLevelPlugin;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _list = require("@lexical/list");

var _LexicalComposerContext = require("@lexical/react/LexicalComposerContext");

var _lexical = require("lexical");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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