import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

type AddItemDialogProps = {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: AddItemFormValues) => void;
};

export type AddItemFormValues = { category: string; name: string };

export default function AddItemDialog({ isOpen, isPending, onClose, onSubmit }: AddItemDialogProps) {
  const { handleSubmit, register, reset } = useForm<AddItemFormValues>();

  const closeDialog = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={closeDialog}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Lägg till sak</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField autoFocus required label="Namn" {...register("name", { required: true })} />
            <TextField required label="Kategori" {...register("category", { required: true })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Avbryt</Button>
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? "Lägger till..." : "Lägg till sak"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
