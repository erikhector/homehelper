import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

type ShareChildDialogProps = {
  errorMessage: string | undefined;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: ShareChildFormValues) => void;
};

export type ShareChildFormValues = { email: string };

export default function ShareChildDialog({ errorMessage, isOpen, isPending, onClose, onSubmit }: ShareChildDialogProps) {
  const { handleSubmit, register, reset } = useForm<ShareChildFormValues>();

  const closeDialog = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={closeDialog}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Dela barnet</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <TextField autoFocus required autoComplete="email" label="Förälderns e-post" type="email" {...register("email", { required: true })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={isPending} onClick={closeDialog}>
            Avbryt
          </Button>
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? "Delar..." : "Dela barn"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
