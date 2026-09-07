import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import { Alert, AlertTitle, Box, Button, Chip, CircularProgress, Divider, Paper, Stack, Tooltip, Typography } from "@mui/material";

import type { Item } from "Src/api/Dto";

interface TomorrowSummaryProps {
  atKindergartenCount: number;
  isFillingItems: boolean;
  missingItems: Item[];
  onFillMissingItems: () => void;
  onPackItem: (item: Item) => void;
}

export default function TomorrowSummary({ atKindergartenCount, isFillingItems, missingItems, onFillMissingItems, onPackItem }: TomorrowSummaryProps) {
  return (
    <Paper component="section" sx={{ bgcolor: "primary.main", color: "primary.contrastText", mb: 3, p: { sm: 3.5, xs: 2.5 } }}>
      <Box
        sx={{ alignItems: { sm: "center" }, display: "flex", flexDirection: { sm: "row", xs: "column" }, gap: 2, justifyContent: "space-between" }}
      >
        <Box>
          <Typography component="h2" sx={{ fontWeight: 700 }} variant="h5">
            Redo för i morgon
          </Typography>
          <Typography sx={{ color: "inherit", mt: 0.5, opacity: 0.78 }}>En snabb överblick över barnets saker.</Typography>
        </Box>
      </Box>
      {missingItems.length > 0 && (
        <Alert
          action={
            <Button
              color="inherit"
              disabled={isFillingItems}
              size="small"
              startIcon={isFillingItems ? <CircularProgress color="inherit" size={16} /> : <PlaylistAddCheckRoundedIcon />}
              sx={{ whiteSpace: "nowrap" }}
              variant="outlined"
              onClick={onFillMissingItems}
            >
              Fyll allt
            </Button>
          }
          severity="error"
          sx={{ alignItems: "flex-start", mt: 2 }}
          variant="filled"
        >
          <AlertTitle>Ta med till förskolan</AlertTitle>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {missingItems.map((item) => (
              <Tooltip key={item.itemId} title="Packad">
                <Chip
                  clickable
                  disabled={isFillingItems}
                  icon={<CheckRoundedIcon fontSize="small" />}
                  label={`${item.name} (${item.itemTemplateEntry!.quantity - item.kindergartenQuantity})`}
                  size="small"
                  sx={{
                    "& .MuiChip-icon": { color: "inherit" },
                    bgcolor: "rgba(255, 255, 255, 0.16)",
                    color: "inherit",
                    fontWeight: 600
                  }}
                  onClick={() => onPackItem(item)}
                />
              </Tooltip>
            ))}
          </Stack>
        </Alert>
      )}
      <Stack
        direction={{ sm: "row", xs: "column" }}
        divider={<Divider flexItem orientation="vertical" sx={{ borderColor: "currentColor", opacity: 0.24 }} />}
        spacing={2.5}
        sx={{ mt: 3 }}
      >
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 800 }}>{atKindergartenCount}</Typography>
          <Typography sx={{ color: "inherit", opacity: 0.78 }}>saker på förskolan</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 800 }}>{missingItems.length}</Typography>
          <Typography sx={{ color: "inherit", opacity: 0.78 }}>saker att ta med</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
