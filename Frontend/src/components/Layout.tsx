import { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { AppBar, Box, IconButton, LinearProgress, Toolbar, Tooltip, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProfileFormValues } from "Src/components/ProfileDialog";

import { getCurrentUser, logout, updateDisplayName } from "Src/api/Auth";

import InvitesDialog from "Src/components/InvitesDialog";
import BottomNav from "Src/components/layout/BottomNav";
import Sidebar from "Src/components/layout/Sidebar";
import ProfileDialog from "Src/components/ProfileDialog";

import useReceivedInvites from "Src/hooks/useReceivedInvites";

import { ThemeModeContext } from "Src/styles/ThemeModeContext";

export default function Layout() {
  const { mode, toggleMode } = useContext(ThemeModeContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isInvitesDialogOpen, setIsInvitesDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({ queryFn: getCurrentUser, queryKey: ["current-user"], retry: false });
  const { acceptInviteMutation, declineInviteMutation, receivedInvitesQuery } = useReceivedInvites(Boolean(currentUser));
  const receivedInvites = receivedInvitesQuery.data ?? [];
  let respondingInviteId: number | undefined;
  if (acceptInviteMutation.isPending) respondingInviteId = acceptInviteMutation.variables;
  else if (declineInviteMutation.isPending) respondingInviteId = declineInviteMutation.variables;
  const updateDisplayNameMutation = useMutation({
    mutationFn: updateDisplayName,
    onSuccess: async (user) => {
      queryClient.setQueryData(["current-user"], user);
      setIsProfileDialogOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    }
  });
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
    }
  });

  const openProfileDialog = () => {
    setDisplayName(currentUser?.displayName ?? "");
    setIsProfileDialogOpen(true);
  };
  const isAuthenticated = Boolean(currentUser);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {isAuthenticated && (
        <Sidebar
          displayName={currentUser?.displayName}
          invitesCount={receivedInvites.length}
          isLoggingOut={logoutMutation.isPending}
          mode={mode}
          onLogout={() => logoutMutation.mutate()}
          onOpenInvites={() => setIsInvitesDialogOpen(true)}
          onOpenProfile={openProfileDialog}
          onToggleMode={toggleMode}
        />
      )}
      <Box sx={{ display: "flex", flex: 1, flexDirection: "column", minWidth: 0 }}>
        {!isAuthenticated && (
          <AppBar color="inherit" elevation={0} position="static" sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Toolbar sx={{ gap: 1, justifyContent: "space-between", minHeight: { sm: 64, xs: 56 } }}>
              <Box component={Link} sx={{ alignItems: "center", color: "inherit", display: "flex", gap: 1.25, textDecoration: "none" }} to="/">
                <Box
                  sx={{
                    alignItems: "center",
                    bgcolor: "primary.main",
                    borderRadius: 2,
                    color: "common.white",
                    display: "flex",
                    height: 36,
                    justifyContent: "center",
                    width: 36
                  }}
                >
                  <HomeRoundedIcon />
                </Box>
                <Typography color="primary.dark" component="span" sx={{ fontFamily: '"Baloo 2", sans-serif', fontSize: "1.15rem", fontWeight: 700 }}>
                  HomeHelper
                </Typography>
              </Box>
              <Tooltip title={mode === "light" ? "Använd mörkt läge" : "Använd ljust läge"}>
                <IconButton aria-label={mode === "light" ? "Använd mörkt läge" : "Använd ljust läge"} onClick={toggleMode}>
                  {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
                </IconButton>
              </Tooltip>
            </Toolbar>
            {isLoadingUser && <LinearProgress />}
          </AppBar>
        )}
        <Box component="main" sx={{ flex: 1, pb: isAuthenticated ? { sm: 0, xs: 9 } : 0 }}>
          <Outlet />
        </Box>
      </Box>
      {isAuthenticated && (
        <BottomNav
          invitesCount={receivedInvites.length}
          isLoggingOut={logoutMutation.isPending}
          mode={mode}
          onLogout={() => logoutMutation.mutate()}
          onOpenInvites={() => setIsInvitesDialogOpen(true)}
          onOpenProfile={openProfileDialog}
          onToggleMode={toggleMode}
        />
      )}
      <ProfileDialog
        displayName={displayName}
        isOpen={isProfileDialogOpen}
        isPending={updateDisplayNameMutation.isPending}
        onClose={() => setIsProfileDialogOpen(false)}
        onSubmit={({ displayName: newDisplayName }: ProfileFormValues) => updateDisplayNameMutation.mutate({ displayName: newDisplayName.trim() })}
      />
      <InvitesDialog
        invites={receivedInvites}
        isOpen={isInvitesDialogOpen}
        isRespondingInviteId={respondingInviteId}
        onAccept={(inviteId) => acceptInviteMutation.mutate(inviteId)}
        onClose={() => setIsInvitesDialogOpen(false)}
        onDecline={(inviteId) => declineInviteMutation.mutate(inviteId)}
      />
    </Box>
  );
}
