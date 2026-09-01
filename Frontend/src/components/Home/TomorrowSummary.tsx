import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";

type TomorrowSummaryProps = { atKindergartenCount: number; homeCount: number };

export default function TomorrowSummary({ atKindergartenCount, homeCount }: TomorrowSummaryProps) {
  return (
    <Paper component="section" sx={{ bgcolor: "primary.dark", color: "primary.contrastText", mb: 3, p: { sm: 3.5, xs: 2.5 } }}>
      <Box
        sx={{ alignItems: { sm: "center" }, display: "flex", flexDirection: { sm: "row", xs: "column" }, gap: 2, justifyContent: "space-between" }}
      >
        <Box>
          <Typography component="h2" sx={{ fontWeight: 700 }} variant="h5">
            Redo för i morgon
          </Typography>
          <Typography sx={{ color: "inherit", mt: 0.5, opacity: 0.78 }}>En snabb överblick över barnets saker.</Typography>
        </Box>
        <Chip
          icon={<Inventory2OutlinedIcon />}
          label={`${homeCount} saker hemma`}
          sx={{ bgcolor: "background.paper", color: "text.primary", fontWeight: 800, px: 0.5 }}
        />
      </Box>
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
          <Typography sx={{ fontSize: "2rem", fontWeight: 800 }}>{homeCount}</Typography>
          <Typography sx={{ color: "inherit", opacity: 0.78 }}>saker hemma</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
