import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEffect } from "react";

export default function StatePlugin({ value = "", onChange = () => {} }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value) {
      editor.setEditorState(editor.parseEditorState(value));
    }
  }, [editor]);

  return <OnChangePlugin onChange={onChange} />;
}
