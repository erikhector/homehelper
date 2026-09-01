import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

export interface CreateItemTemplateFormValues {
  name: string;
}

interface CreateItemTemplateDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: CreateItemTemplateFormValues) => void;
}

export default function CreateItemTemplateDialog({ isOpen, isPending, onClose, onSubmit }: CreateItemTemplateDialogProps) {
  const { handleSubmit, register, reset } = useForm<CreateItemTemplateFormValues>();

  const closeDialog = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={closeDialog}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Skapa mall</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField autoFocus required label="Mallens namn" {...register("name", { required: true })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Avbryt</Button>
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? "Sparar..." : "Spara mall"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
