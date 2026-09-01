import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

type AddChildDialogProps = {
  firstName: string;
  isOpen: boolean;
  isPending: boolean;
  lastName: string;
  onClose: () => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: () => void;
};

export default function AddChildDialog({
  firstName,
  isOpen,
  isPending,
  lastName,
  onClose,
  onFirstNameChange,
  onLastNameChange,
  onSubmit
}: AddChildDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogTitle>Add a child</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField autoFocus label="First name" value={firstName} onChange={(event) => onFirstNameChange(event.target.value)} />
          <TextField label="Last name" value={lastName} onChange={(event) => onLastNameChange(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!firstName.trim() || isPending} variant="contained" onClick={onSubmit}>
          Add child
        </Button>
      </DialogActions>
    </Dialog>
  );
}
