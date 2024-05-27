// import React, { useState, useMemo } from 'react';
// import { Editor, createEditor, Transforms, Node } from 'slate';
// import { Slate, Editable, withReact } from 'slate-react';
// import { TextField } from '@mui/material';

// const RichTextEditor: React.FC = () => {
//   const [value, setValue] = useState<Node[]>([
//     {
//       type: 'paragraph',
//       children: [{ text: '' }],
//     },
//   ]);

//   const editor = useMemo(() => withReact(createEditor()), []);

//   return (
//     <Slate
//       editor={editor}
//       value={value}
//       onChange={(newValue) => setValue(newValue)}
//     >
//       <Editable
//         placeholder="Enter some rich text..."
//         autoFocus
//         renderElement={(props) => <Element {...props} />}
//         renderLeaf={(props) => <Leaf {...props} />}
//         onKeyDown={(event) => {
//           if (!event.ctrlKey) {
//             return;
//           }

//           switch (event.key) {
//             case '`': {
//               event.preventDefault();
//               const [match] = Editor.nodes(editor, {
//                 match: (n) => n.type === 'code',
//               });
//               Transforms.setNodes(
//                 editor,
//                 { type: match ? 'paragraph' : 'code' },
//                 { match: (n) => Editor.isBlock(editor, n) }
//               );
//               break;
//             }
//           }
//         }}
//       />
//     </Slate>
//   );
// };

// const Element: React.FC<any> = ({ attributes, children, element }) => {
//   switch (element.type) {
//     case 'code':
//       return (
//         <pre {...attributes}>
//           <code>{children}</code>
//         </pre>
//       );
//     default:
//       return <p {...attributes}>{children}</p>;
//   }
// };

// const Leaf: React.FC<any> = ({ attributes, children, leaf }) => {
//   if (leaf.bold) {
//     children = <strong>{children}</strong>;
//   }

//   if (leaf.code) {
//     children = <code>{children}</code>;
//   }

//   if (leaf.italic) {
//     children = <em>{children}</em>;
//   }

//   return <span {...attributes}>{children}</span>;
// };

// export default RichTextEditor;
