import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEffect } from "react";

const noop = () => {};

const defaultState = { value: "", onChange: noop, onInit: noop };

export default function StatePlugin({
  value,
  onChange,
  onInit,
} = defaultState) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (typeof onInit === "function") {
      onInit(editor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value) {
      editor.setEditorState(editor.parseEditorState(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return <OnChangePlugin onChange={onChange} />;
}
