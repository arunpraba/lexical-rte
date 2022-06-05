"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ToolbarPlugin;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _LexicalComposerContext = require("@lexical/react/LexicalComposerContext");

var _lexical = require("lexical");

var _link = require("@lexical/link");

var _selection = require("@lexical/selection");

var _utils = require("@lexical/utils");

var _list = require("@lexical/list");

var _reactDom = require("react-dom");

var _richText = require("@lexical/rich-text");

var _code = require("@lexical/code");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const LowPriority = 1;
const supportedBlockTypes = new Set(["paragraph", "quote", "code", "h1", "h2", "ul", "ol"]);
const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List"
};

function Divider() {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "divider"
  });
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = "".concat(rect.top + rect.height + window.pageYOffset + 10, "px");
    editor.style.left = "".concat(rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2, "px");
  }
}

function FloatingLinkEditor(_ref) {
  let {
    editor
  } = _ref;
  const editorRef = (0, _react.useRef)(null);
  const inputRef = (0, _react.useRef)(null);
  const mouseDownRef = (0, _react.useRef)(false);
  const [linkUrl, setLinkUrl] = (0, _react.useState)("");
  const [isEditMode, setEditMode] = (0, _react.useState)(false);
  const [lastSelection, setLastSelection] = (0, _react.useState)(null);
  const updateLinkEditor = (0, _react.useCallback)(() => {
    const selection = (0, _lexical.$getSelection)();

    if ((0, _lexical.$isRangeSelection)(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ((0, _link.$isLinkNode)(parent)) {
        setLinkUrl(parent.getURL());
      } else if ((0, _link.$isLinkNode)(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }

    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (selection !== null && !nativeSelection.isCollapsed && rootElement !== null && rootElement.contains(nativeSelection.anchorNode)) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;

      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;

        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }

        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }

      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);
  (0, _react.useEffect)(() => {
    return (0, _utils.mergeRegister)(editor.registerUpdateListener(_ref2 => {
      let {
        editorState
      } = _ref2;
      editorState.read(() => {
        updateLinkEditor();
      });
    }), editor.registerCommand(_lexical.SELECTION_CHANGE_COMMAND, () => {
      updateLinkEditor();
      return true;
    }, LowPriority));
  }, [editor, updateLinkEditor]);
  (0, _react.useEffect)(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);
  (0, _react.useEffect)(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: editorRef,
    className: "link-editor"
  }, isEditMode ? /*#__PURE__*/_react.default.createElement("input", {
    ref: inputRef,
    className: "link-input",
    value: linkUrl,
    onChange: event => {
      setLinkUrl(event.target.value);
    },
    onKeyDown: event => {
      if (event.key === "Enter") {
        event.preventDefault();

        if (lastSelection !== null) {
          if (linkUrl !== "") {
            editor.dispatchCommand(_link.TOGGLE_LINK_COMMAND, linkUrl);
          }

          setEditMode(false);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        setEditMode(false);
      }
    }
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "link-input"
  }, /*#__PURE__*/_react.default.createElement("a", {
    href: linkUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, linkUrl), /*#__PURE__*/_react.default.createElement("div", {
    className: "link-edit",
    role: "button",
    tabIndex: 0,
    onMouseDown: event => event.preventDefault(),
    onClick: () => {
      setEditMode(true);
    }
  }))));
}

function Select(_ref3) {
  let {
    onChange,
    className,
    options,
    value
  } = _ref3;
  return /*#__PURE__*/_react.default.createElement("select", {
    className: className,
    onChange: onChange,
    value: value
  }, /*#__PURE__*/_react.default.createElement("option", {
    hidden: true,
    value: ""
  }), options.map(option => /*#__PURE__*/_react.default.createElement("option", {
    key: option,
    value: option
  }, option)));
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();

  if (anchorNode === focusNode) {
    return anchorNode;
  }

  const isBackward = selection.isBackward();

  if (isBackward) {
    return (0, _selection.$isAtNodeEnd)(focus) ? anchorNode : focusNode;
  } else {
    return (0, _selection.$isAtNodeEnd)(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList(_ref4) {
  let {
    editor,
    blockType,
    toolbarRef,
    setShowBlockOptionsDropDown
  } = _ref4;
  const dropDownRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const {
        top,
        left
      } = toolbar.getBoundingClientRect();
      dropDown.style.top = "".concat(top + 40, "px");
      dropDown.style.left = "".concat(left, "px");
    }
  }, [dropDownRef, toolbarRef]);
  (0, _react.useEffect)(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = event => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };

      document.addEventListener("click", handle);
      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = (0, _lexical.$getSelection)();

        if ((0, _lexical.$isRangeSelection)(selection)) {
          (0, _selection.$wrapLeafNodesInElements)(selection, () => (0, _lexical.$createParagraphNode)());
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = (0, _lexical.$getSelection)();

        if ((0, _lexical.$isRangeSelection)(selection)) {
          (0, _selection.$wrapLeafNodesInElements)(selection, () => (0, _richText.$createHeadingNode)("h1"));
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = (0, _lexical.$getSelection)();

        if ((0, _lexical.$isRangeSelection)(selection)) {
          (0, _selection.$wrapLeafNodesInElements)(selection, () => (0, _richText.$createHeadingNode)("h2"));
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(_list.INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(_list.REMOVE_LIST_COMMAND);
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(_list.INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(_list.REMOVE_LIST_COMMAND);
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = (0, _lexical.$getSelection)();

        if ((0, _lexical.$isRangeSelection)(selection)) {
          (0, _selection.$wrapLeafNodesInElements)(selection, () => (0, _richText.$createQuoteNode)());
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = (0, _lexical.$getSelection)();

        if ((0, _lexical.$isRangeSelection)(selection)) {
          (0, _selection.$wrapLeafNodesInElements)(selection, () => (0, _code.$createCodeNode)());
        }
      });
    }

    setShowBlockOptionsDropDown(false);
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown",
    ref: dropDownRef
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "item",
    onClick: formatParagraph
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon paragraph"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, "Normal"), blockType === "paragraph" && /*#__PURE__*/_react.default.createElement("span", {
    className: "active"
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "item",
    onClick: formatLargeHeading
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon large-heading"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, "Large Heading"), blockType === "h1" && /*#__PURE__*/_react.default.createElement("span", {
    className: "active"
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "item",
    onClick: formatSmallHeading
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon small-heading"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, "Small Heading"), blockType === "h2" && /*#__PURE__*/_react.default.createElement("span", {
    className: "active"
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "item",
    onClick: formatBulletList
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon bullet-list"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, "Bullet List"), blockType === "ul" && /*#__PURE__*/_react.default.createElement("span", {
    className: "active"
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "item",
    onClick: formatNumberedList
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon numbered-list"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, "Numbered List"), blockType === "ol" && /*#__PURE__*/_react.default.createElement("span", {
    className: "active"
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "item",
    onClick: formatQuote
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon quote"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, "Quote"), blockType === "quote" && /*#__PURE__*/_react.default.createElement("span", {
    className: "active"
  })), /*#__PURE__*/_react.default.createElement("button", {
    className: "item",
    onClick: formatCode
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon code"
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, "Code Block"), blockType === "code" && /*#__PURE__*/_react.default.createElement("span", {
    className: "active"
  })));
}

function ToolbarPlugin(_ref5) {
  let {
    onSave
  } = _ref5;
  const [editor] = (0, _LexicalComposerContext.useLexicalComposerContext)();
  const toolbarRef = (0, _react.useRef)(null);
  const [canUndo, setCanUndo] = (0, _react.useState)(false);
  const [canRedo, setCanRedo] = (0, _react.useState)(false);
  const [blockType, setBlockType] = (0, _react.useState)("paragraph");
  const [selectedElementKey, setSelectedElementKey] = (0, _react.useState)(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = (0, _react.useState)(false);
  const [codeLanguage, setCodeLanguage] = (0, _react.useState)("");
  const [, setIsRTL] = (0, _react.useState)(false);
  const [isLink, setIsLink] = (0, _react.useState)(false);
  const [isBold, setIsBold] = (0, _react.useState)(false);
  const [isItalic, setIsItalic] = (0, _react.useState)(false);
  const [isUnderline, setIsUnderline] = (0, _react.useState)(false);
  const [isStrikethrough, setIsStrikethrough] = (0, _react.useState)(false);
  const [isCode, setIsCode] = (0, _react.useState)(false);
  const updateToolbar = (0, _react.useCallback)(() => {
    const selection = (0, _lexical.$getSelection)();

    if ((0, _lexical.$isRangeSelection)(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);

        if ((0, _list.$isListNode)(element)) {
          const parentList = (0, _utils.$getNearestNodeOfType)(anchorNode, _list.ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = (0, _richText.$isHeadingNode)(element) ? element.getTag() : element.getType();
          setBlockType(type);

          if ((0, _code.$isCodeNode)(element)) {
            setCodeLanguage(element.getLanguage() || (0, _code.getDefaultCodeLanguage)());
          }
        }
      } // Update text format


      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL((0, _selection.$isParentElementRTL)(selection)); // Update links

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ((0, _link.$isLinkNode)(parent) || (0, _link.$isLinkNode)(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);
  (0, _react.useEffect)(() => {
    return (0, _utils.mergeRegister)(editor.registerUpdateListener(_ref6 => {
      let {
        editorState
      } = _ref6;
      editorState.read(() => {
        updateToolbar();
      });
    }), editor.registerCommand(_lexical.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
      updateToolbar();
      return false;
    }, LowPriority), editor.registerCommand(_lexical.CAN_UNDO_COMMAND, payload => {
      setCanUndo(payload);
      return false;
    }, LowPriority), editor.registerCommand(_lexical.CAN_REDO_COMMAND, payload => {
      setCanRedo(payload);
      return false;
    }, LowPriority));
  }, [editor, updateToolbar]);
  const codeLanguges = (0, _react.useMemo)(() => (0, _code.getCodeLanguages)(), []);
  const onCodeLanguageSelect = (0, _react.useCallback)(e => {
    editor.update(() => {
      if (selectedElementKey !== null) {
        const node = (0, _lexical.$getNodeByKey)(selectedElementKey);

        if ((0, _code.$isCodeNode)(node)) {
          node.setLanguage(e.target.value);
        }
      }
    });
  }, [editor, selectedElementKey]);
  const insertLink = (0, _react.useCallback)(() => {
    if (!isLink) {
      editor.dispatchCommand(_link.TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(_link.TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "toolbar",
    ref: toolbarRef
  }, /*#__PURE__*/_react.default.createElement("button", {
    disabled: !canUndo,
    onClick: () => {
      editor.dispatchCommand(_lexical.UNDO_COMMAND);
    },
    className: "toolbar-item spaced",
    "aria-label": "Undo"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format undo"
  })), /*#__PURE__*/_react.default.createElement("button", {
    disabled: !canRedo,
    onClick: () => {
      editor.dispatchCommand(_lexical.REDO_COMMAND);
    },
    className: "toolbar-item",
    "aria-label": "Redo"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format redo"
  })), /*#__PURE__*/_react.default.createElement(Divider, null), supportedBlockTypes.has(blockType) && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    className: "toolbar-item block-controls",
    onClick: () => setShowBlockOptionsDropDown(!showBlockOptionsDropDown),
    "aria-label": "Formatting Options"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "icon block-type " + blockType
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "text"
  }, blockTypeToBlockName[blockType]), /*#__PURE__*/_react.default.createElement("i", {
    className: "chevron-down"
  })), showBlockOptionsDropDown && /*#__PURE__*/(0, _reactDom.createPortal)( /*#__PURE__*/_react.default.createElement(BlockOptionsDropdownList, {
    editor: editor,
    blockType: blockType,
    toolbarRef: toolbarRef,
    setShowBlockOptionsDropDown: setShowBlockOptionsDropDown
  }), document.body), /*#__PURE__*/_react.default.createElement(Divider, null)), blockType === "code" ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Select, {
    className: "toolbar-item code-language",
    onChange: onCodeLanguageSelect,
    options: codeLanguges,
    value: codeLanguage
  }), /*#__PURE__*/_react.default.createElement("i", {
    className: "chevron-down inside"
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_TEXT_COMMAND, "bold");
    },
    className: "toolbar-item spaced " + (isBold ? "active" : ""),
    "aria-label": "Format Bold"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format bold"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_TEXT_COMMAND, "italic");
    },
    className: "toolbar-item spaced " + (isItalic ? "active" : ""),
    "aria-label": "Format Italics"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format italic"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_TEXT_COMMAND, "underline");
    },
    className: "toolbar-item spaced " + (isUnderline ? "active" : ""),
    "aria-label": "Format Underline"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format underline"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_TEXT_COMMAND, "strikethrough");
    },
    className: "toolbar-item spaced " + (isStrikethrough ? "active" : ""),
    "aria-label": "Format Strikethrough"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format strikethrough"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_TEXT_COMMAND, "code");
    },
    className: "toolbar-item spaced " + (isCode ? "active" : ""),
    "aria-label": "Insert Code"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format code"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: insertLink,
    className: "toolbar-item spaced " + (isLink ? "active" : ""),
    "aria-label": "Insert Link"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format link"
  })), isLink && /*#__PURE__*/(0, _reactDom.createPortal)( /*#__PURE__*/_react.default.createElement(FloatingLinkEditor, {
    editor: editor
  }), document.body), /*#__PURE__*/_react.default.createElement(Divider, null), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_ELEMENT_COMMAND, "left");
    },
    className: "toolbar-item spaced",
    "aria-label": "Left Align"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format left-align"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_ELEMENT_COMMAND, "center");
    },
    className: "toolbar-item spaced",
    "aria-label": "Center Align"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format center-align"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_ELEMENT_COMMAND, "right");
    },
    className: "toolbar-item spaced",
    "aria-label": "Right Align"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format right-align"
  })), /*#__PURE__*/_react.default.createElement("button", {
    onClick: () => {
      editor.dispatchCommand(_lexical.FORMAT_ELEMENT_COMMAND, "justify");
    },
    className: "toolbar-item",
    "aria-label": "Justify Align"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "format justify-align"
  })), " ", /*#__PURE__*/_react.default.createElement("button", {
    className: "ml-auto mr-2 border px-2 rounded",
    onClick: () => {
      onSave(editor.getEditorState());
    }
  }, "Save")));
}