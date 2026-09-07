import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";
import { Alert, Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";

import type { Item } from "Src/api/Dto";

interface TomorrowSummaryProps {
  atKindergartenCount: number;
  isFillingItems: boolean;
  missingItems: Item[];
  onFillMissingItems: () => void;
}

export default function TomorrowSummary({ atKindergartenCount, isFillingItems, missingItems, onFillMissingItems }: TomorrowSummaryProps) {
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
          sx={{ alignItems: "center", mt: 2 }}
          variant="filled"
        >
          Ta med till förskolan:{" "}
          {missingItems.map((item) => `${item.name} (${item.itemTemplateEntry!.quantity - item.kindergartenQuantity})`).join(", ")}
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
