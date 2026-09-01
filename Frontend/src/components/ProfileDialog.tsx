import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

type ProfileDialogProps = {
  displayName: string;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: ProfileFormValues) => void;
};

export type ProfileFormValues = { displayName: string };

export default function ProfileDialog({ displayName, isOpen, isPending, onClose, onSubmit }: ProfileDialogProps) {
  const { handleSubmit, register, reset } = useForm<ProfileFormValues>({ values: { displayName } });

  const closeDialog = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={closeDialog}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Din profil</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField autoFocus required label="Visningsnamn" {...register("displayName", { required: true })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={isPending} onClick={closeDialog}>
            Avbryt
          </Button>
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? "Sparar..." : "Spara andringar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
