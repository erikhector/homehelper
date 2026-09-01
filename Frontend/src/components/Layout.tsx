import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useContext, useState } from "react";
import { AppBar, Box, IconButton, LinearProgress, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "react-router";

import { getCurrentUser, logout, updateDisplayName } from "Src/api/Auth";
import ProfileDialog, { type ProfileFormValues } from "Src/components/ProfileDialog";
import { ThemeModeContext } from "Src/styles/ThemeModeContext";

export default function Layout() {
  const { mode, toggleMode } = useContext(ThemeModeContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLElement | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({ queryFn: getCurrentUser, queryKey: ["current-user"], retry: false });
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
    setAccountMenuAnchor(null);
    setIsProfileDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar color="inherit" elevation={0} position="static" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ gap: 1, justifyContent: "space-between", minHeight: { xs: 56, sm: 64 } }}>
          <Box
            component={Link}
            onClick={(event) => {
              if (!currentUser) {
                event.preventDefault();
              }
            }}
            sx={{ alignItems: "center", color: "inherit", display: "flex", gap: 1.25, textDecoration: "none" }}
            to="/children"
          >
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
            <Typography color="primary.dark" component="span" sx={{ fontSize: "1.15rem", fontWeight: 800 }}>
              HomeHelper
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={mode === "light" ? "Använd mörkt läge" : "Använd ljust läge"}>
              <IconButton aria-label={mode === "light" ? "Använd mörkt läge" : "Använd ljust läge"} onClick={toggleMode}>
                {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
              </IconButton>
            </Tooltip>
            {currentUser && (
              <>
                <Tooltip title="Konto">
                  <IconButton aria-label="Öppna kontomeny" onClick={(event) => setAccountMenuAnchor(event.currentTarget)}>
                    <PersonRoundedIcon />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={accountMenuAnchor} open={Boolean(accountMenuAnchor)} onClose={() => setAccountMenuAnchor(null)}>
                  <MenuItem disabled>{currentUser.displayName}</MenuItem>
                  <MenuItem onClick={openProfileDialog}>Ändra visningsnamn</MenuItem>
                  <MenuItem disabled={logoutMutation.isPending} onClick={() => logoutMutation.mutate()}>
                    {logoutMutation.isPending ? "Loggar ut..." : "Logga ut"}
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>
        </Toolbar>
        {isLoadingUser && <LinearProgress />}
      </AppBar>
      <main>
        <Outlet />
      </main>
      <ProfileDialog
        displayName={displayName}
        isOpen={isProfileDialogOpen}
        isPending={updateDisplayNameMutation.isPending}
        onClose={() => setIsProfileDialogOpen(false)}
        onSubmit={({ displayName: newDisplayName }: ProfileFormValues) => updateDisplayNameMutation.mutate({ displayName: newDisplayName.trim() })}
      />
    </Box>
  );
}
