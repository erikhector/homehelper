import { useState } from "react";
import { Link, useLocation } from "react-router";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Badge, Box, Stack, Tooltip, Typography } from "@mui/material";

import type { PaletteMode } from "@mui/material";
import type { ReactNode } from "react";

import { isNavItemActive, navItems } from "Src/components/layout/nav-items";

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";
const EXPANDED_WIDTH = 224;
const COLLAPSED_WIDTH = 72;

interface SidebarProps {
  displayName?: string;
  invitesCount: number;
  isLoggingOut: boolean;
  mode: PaletteMode;
  onLogout: () => void;
  onOpenInvites: () => void;
  onOpenProfile: () => void;
  onToggleMode: () => void;
}

interface SidebarActionButtonProps {
  disabled?: boolean;
  expanded: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function SidebarActionButton({ disabled, expanded, icon, label, onClick }: SidebarActionButtonProps) {
  const button = (
    <Box
      aria-disabled={disabled}
      aria-label={label}
      component="button"
      sx={{
        "&:hover": disabled ? undefined : { bgcolor: "action.hover", color: "text.primary" },
        alignItems: "center",
        bgcolor: "transparent",
        border: "none",
        borderRadius: 2,
        color: "text.secondary",
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        font: "inherit",
        gap: 1.25,
        justifyContent: expanded ? "flex-start" : "center",
        opacity: disabled ? 0.6 : 1,
        px: expanded ? 1.25 : 1,
        py: 1,
        textAlign: "left",
        width: "100%"
      }}
      type="button"
      onClick={disabled ? undefined : onClick}
    >
      {icon}
      {expanded && (
        <Typography noWrap sx={{ fontSize: "0.8125rem", fontWeight: 600 }}>
          {label}
        </Typography>
      )}
    </Box>
  );

  return expanded ? (
    button
  ) : (
    <Tooltip placement="right" title={label}>
      {button}
    </Tooltip>
  );
}

export default function Sidebar({
  displayName,
  invitesCount,
  isLoggingOut,
  mode,
  onLogout,
  onOpenInvites,
  onOpenProfile,
  onToggleMode
}: SidebarProps) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(() => localStorage.getItem(SIDEBAR_STORAGE_KEY) !== "0");

  const toggleExpanded = () => {
    setExpanded((current) => {
      const next = !current;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? "1" : "0");

      return next;
    });
  };

  return (
    <Box
      component="aside"
      sx={{
        bgcolor: "background.paper",
        borderColor: "divider",
        borderRight: 1,
        display: { sm: "flex", xs: "none" },
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        transition: "width 150ms",
        width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH
      }}
    >
      <Box
        component={Link}
        sx={{
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          color: "inherit",
          display: "flex",
          gap: 1.25,
          justifyContent: expanded ? "flex-start" : "center",
          px: expanded ? 2 : 1,
          py: 2.25,
          textDecoration: "none"
        }}
        to="/children"
      >
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "primary.main",
            borderRadius: 2,
            color: "common.white",
            display: "flex",
            flexShrink: 0,
            height: 36,
            justifyContent: "center",
            width: 36
          }}
        >
          <HomeRoundedIcon />
        </Box>
        {expanded && (
          <Typography color="primary.dark" sx={{ fontFamily: '"Baloo 2", sans-serif', fontSize: "1.15rem", fontWeight: 700 }}>
            HomeHelper
          </Typography>
        )}
      </Box>
      <Stack component="nav" spacing={0.5} sx={{ flex: 1, overflowY: "auto", p: 1 }}>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = isNavItemActive(location.pathname, href);
          const link = (
            <Box
              key={href}
              component={Link}
              sx={{
                "&:hover": { bgcolor: active ? "primary.main" : "action.hover", color: active ? "primary.contrastText" : "text.primary" },
                alignItems: "center",
                bgcolor: active ? "primary.main" : "transparent",
                borderRadius: 2,
                color: active ? "primary.contrastText" : "text.secondary",
                display: "flex",
                gap: 1.25,
                justifyContent: expanded ? "flex-start" : "center",
                px: expanded ? 1.25 : 0,
                py: 1,
                textDecoration: "none",
                transition: "background-color 150ms, color 150ms"
              }}
              to={href}
            >
              <Icon fontSize="small" />
              {expanded && (
                <Typography noWrap sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  {label}
                </Typography>
              )}
            </Box>
          );

          return expanded ? (
            link
          ) : (
            <Tooltip key={href} placement="right" title={label}>
              {link}
            </Tooltip>
          );
        })}
      </Stack>
      <Stack spacing={0.5} sx={{ borderColor: "divider", borderTop: 1, p: 1 }}>
        <SidebarActionButton
          expanded={expanded}
          icon={
            <Badge badgeContent={invitesCount} color="error">
              <NotificationsRoundedIcon fontSize="small" />
            </Badge>
          }
          label="Inbjudningar"
          onClick={onOpenInvites}
        />
        <SidebarActionButton
          expanded={expanded}
          icon={<PersonRoundedIcon fontSize="small" />}
          label={displayName ?? "Konto"}
          onClick={onOpenProfile}
        />
        <SidebarActionButton
          expanded={expanded}
          icon={mode === "light" ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />}
          label={mode === "light" ? "Mörkt läge" : "Ljust läge"}
          onClick={onToggleMode}
        />
        <SidebarActionButton
          disabled={isLoggingOut}
          expanded={expanded}
          icon={<LogoutRoundedIcon fontSize="small" />}
          label={isLoggingOut ? "Loggar ut…" : "Logga ut"}
          onClick={onLogout}
        />
        <SidebarActionButton
          expanded={expanded}
          icon={expanded ? <ChevronLeftRoundedIcon fontSize="small" /> : <ChevronRightRoundedIcon fontSize="small" />}
          label="Fäll ihop"
          onClick={toggleExpanded}
        />
      </Stack>
    </Box>
  );
}
