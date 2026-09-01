import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";

import type { Child } from "Src/api/Dto";

type ChildDashboardHeaderProps = {
  activeChildId: "" | number;
  children: Child[];
  currentDate: string;
  selectedChild: Child | undefined;
  onAddChild: () => void;
  onSelectChild: (childId: "" | number) => void;
};

export default function ChildDashboardHeader({
  activeChildId,
  children,
  currentDate,
  selectedChild,
  onAddChild,
  onSelectChild
}: ChildDashboardHeaderProps) {
  return (
    <Box
      sx={{
        alignItems: { sm: "center" },
        display: "flex",
        flexDirection: { sm: "row", xs: "column" },
        gap: 2,
        justifyContent: "space-between",
        mb: 4
      }}
    >
      <Box>
        <Typography color="text.secondary" sx={{ fontWeight: 700 }} variant="body2">
          {currentDate}
        </Typography>
        <Typography component="h1" sx={{ mt: 0.5 }} variant="h4">
          {selectedChild ? `${selectedChild.firstName}'s things` : "Your children"}
        </Typography>
      </Box>
      <Stack direction="row" spacing={1}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="child-select-label">Child</InputLabel>
          <Select label="Child" labelId="child-select-label" value={activeChildId} onChange={(event) => onSelectChild(event.target.value)}>
            {children.map((child) => (
              <MenuItem key={child.childId} value={child.childId}>
                {[child.firstName, child.lastName].filter(Boolean).join(" ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={onAddChild}>
          Add child
        </Button>
      </Stack>
    </Box>
  );
}
