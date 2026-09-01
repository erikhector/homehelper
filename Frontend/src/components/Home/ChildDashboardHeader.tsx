import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { Avatar, Box, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tooltip, Typography } from "@mui/material";

import type { Child } from "Src/api/Dto";

import { ParentChildRole } from "Src/api/Enums";

interface ChildDashboardHeaderProps {
  activeChildId: "" | number;
  childProfiles: Child[];
  currentDate: string;
  currentUserId: number | undefined;
  onAddChild: () => void;
  onManageChild: () => void;
  onSelectChild: (childId: "" | number) => void;
  onShareChild: () => void;
  selectedChild: Child | undefined;
}

export default function ChildDashboardHeader({
  activeChildId,
  childProfiles,
  currentDate,
  currentUserId,
  onAddChild,
  onManageChild,
  onSelectChild,
  onShareChild,
  selectedChild
}: ChildDashboardHeaderProps) {
  const parentLinks = selectedChild?.parentLinks ?? [];
  const otherParentLinks = parentLinks.filter((link) => link.userId !== currentUserId);
  const visibleParentLinks = otherParentLinks.length > 0 ? otherParentLinks : parentLinks;
  const isSharedChild = parentLinks.length > 1;
  const isOwner = parentLinks.some((link) => link.userId === currentUserId && link.role === ParentChildRole.Owner);

  return (
    <Box
      sx={{
        alignItems: { sm: "center" },
        display: "flex",
        flexDirection: { sm: "row", xs: "column" },
        gap: 2,
        justifyContent: "space-between",
        mb: 2.5
      }}
    >
      <Box>
        <Typography color="text.secondary" sx={{ fontWeight: 700 }} variant="body2">
          {currentDate}
        </Typography>
        <Typography component="h1" sx={{ mt: 0.5 }} variant="h4">
          {selectedChild ? `${selectedChild.firstName}s saker` : "Dina barn"}
        </Typography>
        {selectedChild && isSharedChild && (
          <Box
            sx={{
              alignItems: { sm: "center" },
              border: 1,
              borderColor: "primary.light",
              borderRadius: 2,
              display: "flex",
              flexDirection: { sm: "row", xs: "column" },
              gap: 1.25,
              mt: 1.5,
              p: 1.25
            }}
          >
            <Chip color="primary" icon={<GroupRoundedIcon />} label="Delat barn" size="small" variant="outlined" />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {visibleParentLinks.map((link) => (
                <Chip
                  key={link.parentChildLinkId}
                  avatar={<Avatar>{link.user.displayName.charAt(0).toUpperCase()}</Avatar>}
                  label={`${link.user.displayName} (${link.role === ParentChildRole.Owner ? "ägare" : "vårdnadshavare"})`}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
      <Stack direction="row" spacing={1}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="child-select-label">Barn</InputLabel>
          <Select label="Barn" labelId="child-select-label" value={activeChildId} onChange={(event) => onSelectChild(event.target.value)}>
            {childProfiles.map((child) => (
              <MenuItem key={child.childId} value={child.childId}>
                {[child.firstName, child.lastName].filter(Boolean).join(" ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={onAddChild}>
          Lägg till barn
        </Button>
        {selectedChild && isOwner && (
          <Button variant="outlined" onClick={onShareChild}>
            Dela
          </Button>
        )}
        {selectedChild && (
          <Tooltip title="Hantera åtkomst">
            <IconButton aria-label="Hantera åtkomst" onClick={onManageChild}>
              <ManageAccountsRoundedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
}
