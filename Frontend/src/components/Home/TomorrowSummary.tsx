import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";

type TomorrowSummaryProps = { atKindergartenCount: number; bringTomorrowCount: number };

export default function TomorrowSummary({ atKindergartenCount, bringTomorrowCount }: TomorrowSummaryProps) {
  return (
    <Paper component="section" sx={{ bgcolor: "primary.dark", color: "common.white", mb: 3, p: { sm: 3.5, xs: 2.5 } }}>
      <Box
        sx={{ alignItems: { sm: "center" }, display: "flex", flexDirection: { sm: "row", xs: "column" }, gap: 2, justifyContent: "space-between" }}
      >
        <Box>
          <Typography component="h2" sx={{ fontWeight: 700 }} variant="h5">
            Ready for tomorrow
          </Typography>
          <Typography sx={{ color: "#dcefe8", mt: 0.5 }}>A quick look at what needs to leave home.</Typography>
        </Box>
        <Chip
          icon={<Inventory2OutlinedIcon />}
          label={`${bringTomorrowCount} things to bring`}
          sx={{ bgcolor: "#dcefe8", color: "primary.dark", fontWeight: 800, px: 0.5 }}
        />
      </Box>
      <Stack
        direction={{ sm: "row", xs: "column" }}
        divider={<Divider flexItem orientation="vertical" sx={{ borderColor: "#4b8d80" }} />}
        spacing={2.5}
        sx={{ mt: 3 }}
      >
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 800 }}>{atKindergartenCount}</Typography>
          <Typography sx={{ color: "#dcefe8" }}>already there</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "2rem", fontWeight: 800 }}>{bringTomorrowCount}</Typography>
          <Typography sx={{ color: "#dcefe8" }}>to pack</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
