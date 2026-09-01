import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Avatar, Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";

import type { Child, Item } from "Src/api/Dto";

type PackingListProps = {
  atKindergartenStatus: Item["status"] | undefined;
  items: Item[];
  needsToBringStatus: Item["status"] | undefined;
  selectedChild: Child | undefined;
  onAddItem: () => void;
  onCycleItemStatus: (item: Item) => void;
};

const displayStatus = (status: number | string) =>
  String(status)
    .replaceAll(/([A-Z])/g, " $1")
    .trim();

export default function PackingList({
  atKindergartenStatus,
  items,
  needsToBringStatus,
  selectedChild,
  onAddItem,
  onCycleItemStatus
}: PackingListProps) {
  return (
    <>
      <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography component="h2" variant="h6">
          Packing list
        </Typography>
        <Button disabled={!selectedChild} startIcon={<AddRoundedIcon />} variant="contained" onClick={onAddItem}>
          Add item
        </Button>
      </Box>
      <Paper component="section" variant="outlined">
        {items.map((item, index) => (
          <Box key={item.itemId}>
            {index > 0 && <Divider />}
            <Box sx={{ alignItems: "center", display: "flex", gap: 1.5, p: { sm: 2, xs: 1.5 } }}>
              <Avatar
                sx={{
                  bgcolor: item.status === needsToBringStatus ? "#fff1d9" : "primary.light",
                  color: item.status === needsToBringStatus ? "warning.main" : "primary.dark"
                }}
              >
                <CheckCircleRoundedIcon />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {item.category}
                </Typography>
              </Box>
              <Chip
                label={displayStatus(item.status)}
                size="small"
                sx={{
                  bgcolor: item.status === needsToBringStatus ? "warning.main" : item.status === atKindergartenStatus ? "success.main" : "grey.200",
                  color: item.status === needsToBringStatus || item.status === atKindergartenStatus ? "common.white" : "text.primary",
                  cursor: "pointer",
                  fontWeight: 700
                }}
                onClick={() => onCycleItemStatus(item)}
              />
              <ChevronRightRoundedIcon color="action" />
            </Box>
          </Box>
        ))}
      </Paper>
    </>
  );
}
