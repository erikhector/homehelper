import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function Index() {
  return (
    <Box component="section" sx={{ display: "grid", minHeight: "calc(100vh - 73px)", placeItems: "center", px: { sm: 4, xs: 2 }, py: 6 }}>
      <Helmet title="Ordning på vardagen" />
      <Box sx={{ maxWidth: 640, textAlign: "center" }}>
        <Box sx={{ bgcolor: "primary.light", borderRadius: "50%", color: "primary.dark", display: "inline-flex", p: 2 }}>
          <FamilyRestroomRoundedIcon fontSize="large" />
        </Box>
        <Typography component="h1" sx={{ mt: 3 }} variant="h3">
          Allt barnet behöver, delat med dem som bryr sig.
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "1.125rem", mt: 2 }}>
          Håll packlistan för förskolan uppdaterad och synkad mellan föräldrar och vårdnadshavare.
        </Typography>
        <Stack direction={{ sm: "row", xs: "column" }} spacing={1.5} sx={{ justifyContent: "center", mt: 4 }}>
          <Button component={Link} size="large" to="/signup" variant="contained">
            Skapa konto
          </Button>
          <Button component={Link} size="large" to="/login" variant="outlined">
            Logga in
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
