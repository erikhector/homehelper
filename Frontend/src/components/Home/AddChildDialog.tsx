import { useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

export interface AddChildFormValues {
  firstName: string;
  lastName: string;
}

interface AddChildDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: AddChildFormValues) => void;
}

export default function AddChildDialog({ isOpen, isPending, onClose, onSubmit }: AddChildDialogProps) {
  const { handleSubmit, register, reset } = useForm<AddChildFormValues>();

  const closeDialog = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={closeDialog}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Lägg till barn</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField autoFocus required label="Förnamn" {...register("firstName", { required: true })} />
            <TextField label="Efternamn" {...register("lastName")} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Avbryt</Button>
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? "Lägger till..." : "Lägg till barn"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
