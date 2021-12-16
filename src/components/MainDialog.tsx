import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

function MainDialog({ container, open, handleClose }) {
  return (
    <>
      <Dialog container={container} open={open} onClose={handleClose}>
        <DialogTitle>Welcome to skillwallet</DialogTitle>
        <DialogContent>content</DialogContent>
        <DialogActions>
          <Button autoFocus>Agree</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MainDialog;
