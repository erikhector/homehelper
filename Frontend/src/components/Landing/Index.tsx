import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

export default function Index() {
  return (
    <Box component="section" sx={{ display: "grid", minHeight: "calc(100vh - 73px)", placeItems: "center", px: { sm: 4, xs: 2 }, py: 6 }}>
      <Helmet title="Keep the everyday sorted" />
      <Box sx={{ maxWidth: 640, textAlign: "center" }}>
        <Box sx={{ bgcolor: "primary.light", borderRadius: "50%", color: "primary.dark", display: "inline-flex", p: 2 }}>
          <FamilyRestroomRoundedIcon fontSize="large" />
        </Box>
        <Typography component="h1" sx={{ mt: 3 }} variant="h3">
          Everything they need, shared with the people who care.
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "1.125rem", mt: 2 }}>
          Keep a current packing list for kindergarten and stay in sync across every parent and guardian.
        </Typography>
        <Stack direction={{ sm: "row", xs: "column" }} spacing={1.5} sx={{ justifyContent: "center", mt: 4 }}>
          <Button component={Link} size="large" to="/signup" variant="contained">
            Create an account
          </Button>
          <Button component={Link} size="large" to="/login" variant="outlined">
            Log in
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
