import { useEffect, useRef, useState } from 'react';
import { Data } from './data/PDFListData';
import PDFList from './pdfComponents/PDFList';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface IPDFList {
  title: string;
  description?: string;
  url: string;
  path?: string;
  tags?: string[]
}

const PDFViewer = () => {
  const data: IPDFList[] = Data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', url: '' });

  useEffect(() => {
    document.onkeydown = function (e) {
      if (e.ctrlKey || e.altKey) {
        return false;
      }
    };

    window.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    }, false);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, url: file.name });
      setOpen(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    console.log('Saving data:', formData);
    // Add logic to save the data
    setOpen(false);
  };

  return (
    <div className="small-space">
      <div className='container'>
        <h1 className='main-title'>
          Program and PDFs
        </h1>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept=".pdf"
        />
        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleButtonClick}
        >
          Upload PDF
        </Button>
        
        <PDFList lists={data} />

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add PDF Details</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              variant="standard"
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Selected File"
              type="text"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="standard"
              value={formData.url}
              disabled
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default PDFViewer;
