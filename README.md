# Lexical rte

It is a lexical based rich text editor

### Todo

- [x] Add editor
- [ ] Add docs
- [ ] Publish to npm
- [ ] Add KaTex support with annotation
- [ ] Add Types

### Example

```jsx
import { Editor } from "lexical-rte";

function App() {
  const [currentValue, setCurrentValue] = useState("");
  return (
    <div className="md:container mx-auto my-5">
      <h1>Rich text editor</h1>
      <Editor
        onInit={(editor) => {
          console.log(editor);
        }}
        onSave={(editorState) => {
          console.log(editorState);
        }}
        value={currentValue}
        onChange={(editorState) => {
          console.log(editorState);
        }}
      />
    </div>
  );
}
```
