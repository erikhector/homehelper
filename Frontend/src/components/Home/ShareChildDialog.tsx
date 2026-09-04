import { useForm } from "react-hook-form";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";

export interface ShareChildFormValues {
  email: string;
}

interface ShareChildDialogProps {
  errorMessage: string | undefined;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: ShareChildFormValues) => void;
}

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
            <Typography color="text.secondary" variant="body2">
              Personen får en inbjudan som de kan acceptera eller avböja. Har de inget konto än kan de skapa ett och inbjudan väntar tills dess.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={isPending} onClick={closeDialog}>
            Avbryt
          </Button>
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? "Skickar..." : "Skicka inbjudan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
