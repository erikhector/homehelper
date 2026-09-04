import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";

import type { Child } from "Src/api/Dto";

import { ParentChildRole } from "Src/api/Enums";

interface ManageChildAccessDialogProps {
  child: Child | undefined;
  currentUserId: number | undefined;
  errorMessage: string | undefined;
  isCancelingInviteId: number | undefined;
  isDeletingChild: boolean;
  isOpen: boolean;
  isRevokingParentUserId: number | undefined;
  onCancelInvite: (inviteId: number) => void;
  onClose: () => void;
  onDeleteChild: () => void;
  onRevokeAccess: (parentUserId: number) => void;
}

export default function ManageChildAccessDialog({
  child,
  currentUserId,
  errorMessage,
  isCancelingInviteId,
  isDeletingChild,
  isOpen,
  isRevokingParentUserId,
  onCancelInvite,
  onClose,
  onDeleteChild,
  onRevokeAccess
}: ManageChildAccessDialogProps) {
  const currentUserLink = child?.parentLinks.find((link) => link.userId === currentUserId);
  const isOwner = currentUserLink?.role === ParentChildRole.Owner;
  const guardians = child?.parentLinks.filter((link) => link.role === ParentChildRole.Guardian) ?? [];
  const pendingInvites = child?.shareInvites ?? [];

  return (
    <Dialog fullWidth maxWidth="xs" open={isOpen} onClose={onClose}>
      <DialogTitle>Hantera åtkomst</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {isOwner ? (
            <>
              <Typography color="text.secondary" variant="body2">
                Vårdnadshavare med åtkomst till {child?.firstName}.
              </Typography>
              {guardians.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  Barnet är inte delat med någon annan.
                </Typography>
              ) : (
                guardians.map((guardian) => {
                  const isRevokingAccess = guardian.userId === isRevokingParentUserId;

                  return (
                    <Box key={guardian.parentChildLinkId} sx={{ alignItems: "center", display: "flex", gap: 1 }}>
                      <Avatar sx={{ height: 30, width: 30 }}>{guardian.user.displayName.charAt(0).toUpperCase()}</Avatar>
                      <Typography sx={{ flex: 1 }}>{guardian.user.displayName}</Typography>
                      <Tooltip title="Ta bort åtkomst">
                        <span>
                          <IconButton
                            aria-label={`Ta bort åtkomst för ${guardian.user.displayName}`}
                            color="error"
                            disabled={isRevokingAccess}
                            onClick={() => onRevokeAccess(guardian.userId)}
                          >
                            {isRevokingAccess ? (
                              <CircularProgress aria-label="Tar bort åtkomst" color="inherit" size={20} />
                            ) : (
                              <PersonRemoveRoundedIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  );
                })
              )}
              {pendingInvites.length > 0 && (
                <>
                  <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                    Väntande inbjudningar.
                  </Typography>
                  {pendingInvites.map((invite) => {
                    const isCancelingInvite = invite.childShareInviteId === isCancelingInviteId;

                    return (
                      <Box key={invite.childShareInviteId} sx={{ alignItems: "center", display: "flex", gap: 1 }}>
                        <Typography sx={{ flex: 1 }}>{invite.invitedEmail}</Typography>
                        <Typography color="text.secondary" variant="caption">
                          Väntar på svar
                        </Typography>
                        <Tooltip title="Avbryt inbjudan">
                          <span>
                            <IconButton
                              aria-label={`Avbryt inbjudan till ${invite.invitedEmail}`}
                              color="error"
                              disabled={isCancelingInvite}
                              onClick={() => onCancelInvite(invite.childShareInviteId)}
                            >
                              {isCancelingInvite ? (
                                <CircularProgress aria-label="Avbryter inbjudan" color="inherit" size={20} />
                              ) : (
                                <PersonRemoveRoundedIcon />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    );
                  })}
                </>
              )}
            </>
          ) : (
            <>
              <Typography color="text.secondary" variant="body2">
                Du har åtkomst som vårdnadshavare. Du kan lämna delningen när som helst.
              </Typography>
              <Button
                color="error"
                disabled={!currentUserLink || isRevokingParentUserId === currentUserId}
                startIcon={isRevokingParentUserId === currentUserId ? <CircularProgress color="inherit" size={18} /> : <PersonRemoveRoundedIcon />}
                variant="outlined"
                onClick={() => currentUserId && onRevokeAccess(currentUserId)}
              >
                Lämna delning
              </Button>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between" }}>
        {isOwner ? (
          <Button
            color="error"
            disabled={isDeletingChild}
            startIcon={isDeletingChild ? <CircularProgress color="inherit" size={18} /> : <DeleteRoundedIcon />}
            onClick={onDeleteChild}
          >
            Ta bort barn
          </Button>
        ) : (
          <Box />
        )}
        <Button onClick={onClose}>Stäng</Button>
      </DialogActions>
    </Dialog>
  );
}
