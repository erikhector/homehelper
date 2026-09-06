import { useState } from "react";
import { Link, useLocation } from "react-router";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Badge, Box, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

import type { PaletteMode } from "@mui/material";

import { isNavItemActive, navItems } from "Src/components/layout/nav-items";

interface BottomNavProps {
  invitesCount: number;
  isLoggingOut: boolean;
  mode: PaletteMode;
  onLogout: () => void;
  onOpenInvites: () => void;
  onOpenProfile: () => void;
  onToggleMode: () => void;
}

export default function BottomNav({ invitesCount, isLoggingOut, mode, onLogout, onOpenInvites, onOpenProfile, onToggleMode }: BottomNavProps) {
  const location = useLocation();
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);
  const closeMore = () => setMoreAnchor(null);

  return (
    <Box
      component="nav"
      sx={{
        bgcolor: "background.paper",
        borderColor: "divider",
        borderTop: 1,
        bottom: 0,
        display: { sm: "none", xs: "flex" },
        left: 0,
        pb: "env(safe-area-inset-bottom)",
        position: "fixed",
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar
      }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = isNavItemActive(location.pathname, href);

        return (
          <Box
            key={href}
            component={Link}
            sx={{
              alignItems: "center",
              color: active ? "primary.main" : "text.secondary",
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 0.25,
              py: 1,
              textDecoration: "none"
            }}
            to={href}
          >
            <Icon fontSize="small" />
            <Box component="span" sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
              {label}
            </Box>
          </Box>
        );
      })}
      <Box
        aria-label="Mer"
        component="button"
        sx={{
          alignItems: "center",
          bgcolor: "transparent",
          border: "none",
          color: moreAnchor ? "primary.main" : "text.secondary",
          display: "flex",
          flex: 1,
          flexDirection: "column",
          font: "inherit",
          gap: 0.25,
          py: 1
        }}
        type="button"
        onClick={(event) => setMoreAnchor(event.currentTarget)}
      >
        <Badge badgeContent={invitesCount} color="error">
          <MoreHorizRoundedIcon fontSize="small" />
        </Badge>
        <Box component="span" sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
          Mer
        </Box>
      </Box>
      <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} slotProps={{ list: { dense: true } }} onClose={closeMore}>
        <MenuItem
          onClick={() => {
            closeMore();
            onOpenInvites();
          }}
        >
          <ListItemIcon>
            <NotificationsRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Inbjudningar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMore();
            onOpenProfile();
          }}
        >
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Konto</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMore();
            onToggleMode();
          }}
        >
          <ListItemIcon>{mode === "light" ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />}</ListItemIcon>
          <ListItemText>{mode === "light" ? "Mörkt läge" : "Ljust läge"}</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={isLoggingOut}
          onClick={() => {
            closeMore();
            onLogout();
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{isLoggingOut ? "Loggar ut…" : "Logga ut"}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
