import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

import type { ChildShareInvite } from "Src/api/Dto";

interface InvitesDialogProps {
  invites: ChildShareInvite[];
  isOpen: boolean;
  isRespondingInviteId: number | undefined;
  onAccept: (inviteId: number) => void;
  onClose: () => void;
  onDecline: (inviteId: number) => void;
}

export default function InvitesDialog({ invites, isOpen, isRespondingInviteId, onAccept, onClose, onDecline }: InvitesDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogTitle>Inbjudningar</DialogTitle>
      <DialogContent dividers>
        {invites.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Du har inga väntande inbjudningar.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {invites.map((invite) => {
              const isResponding = invite.childShareInviteId === isRespondingInviteId;

              return (
                <Box key={invite.childShareInviteId}>
                  <Typography>
                    {invite.invitedByUser.displayName} ({invite.invitedByUser.username}) vill dela{" "}
                    <strong>{[invite.child.firstName, invite.child.lastName].filter(Boolean).join(" ")}</strong> med dig.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      disabled={isResponding}
                      size="small"
                      startIcon={isResponding ? <CircularProgress color="inherit" size={16} /> : <CheckRoundedIcon />}
                      variant="contained"
                      onClick={() => onAccept(invite.childShareInviteId)}
                    >
                      Acceptera
                    </Button>
                    <Button
                      color="error"
                      disabled={isResponding}
                      size="small"
                      startIcon={<CloseRoundedIcon />}
                      variant="outlined"
                      onClick={() => onDecline(invite.childShareInviteId)}
                    >
                      Avböj
                    </Button>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Stäng</Button>
      </DialogActions>
    </Dialog>
  );
}
