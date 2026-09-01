import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

type AddItemDialogProps = {
  category: string;
  isOpen: boolean;
  isPending: boolean;
  name: string;
  onCategoryChange: (value: string) => void;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
};

export default function AddItemDialog({ category, isOpen, isPending, name, onCategoryChange, onClose, onNameChange, onSubmit }: AddItemDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogTitle>Add an item</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField autoFocus label="Item name" value={name} onChange={(event) => onNameChange(event.target.value)} />
          <TextField label="Category" value={category} onChange={(event) => onCategoryChange(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!name.trim() || !category.trim() || isPending} variant="contained" onClick={onSubmit}>
          Add item
        </Button>
      </DialogActions>
    </Dialog>
  );
}
