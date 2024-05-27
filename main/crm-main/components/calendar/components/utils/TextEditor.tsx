'use client';
import { useState } from 'react';
import { EditorState } from 'draft-js';
import { Editor, toggleBold, toggleItalic, toggleUnderline, getDefaultKeyBindingFn, shortcutHandler } from 'contenido';
import Button from '@mui/material/Button';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { Box, Grid, Paper } from '@mui/material';

const CustomEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const toolbarButtons = [
    { icon: <FormatBoldIcon />, handler: toggleBold },
    { icon: <FormatItalicIcon />, handler: toggleItalic },
    { icon: <FormatUnderlinedIcon />, handler: toggleUnderline },
  ];

  return (
    <Box sx={{ p:2 }}>
      <Grid item xs={12}>
        {toolbarButtons.map((btn, index) => (
          <Button
            key={index}
            onMouseDown={(e) => {
              e.preventDefault();
              btn.handler(editorState, setEditorState);
            }}
            startIcon={btn.icon}
            >
          </Button>
        ))}
      </Grid>
      <Grid item xs={12}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={shortcutHandler(setEditorState)}
          keyBindingFn={getDefaultKeyBindingFn}
          />
        </Grid>
    </Box>
  );
};

export default CustomEditor;
