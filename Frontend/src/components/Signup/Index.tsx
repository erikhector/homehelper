import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

export default function Index() {
  return (
    <Box component="section" sx={{ display: "grid", minHeight: "calc(100vh - 73px)", placeItems: "center", px: 2, py: 5 }}>
      <Helmet title="Create an account" />
      <Paper
        component="form"
        sx={{ maxWidth: 440, p: { sm: 4, xs: 3 }, width: "100%" }}
        variant="outlined"
        onSubmit={(event) => event.preventDefault()}
      >
        <Typography component="h1" variant="h4">
          Create your account
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          One account keeps every linked guardian up to date.
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField autoComplete="name" label="Your name" required />
          <TextField autoComplete="email" label="Email" required type="email" />
          <TextField autoComplete="new-password" label="Password" required type="password" />
          <Button type="submit" variant="contained">
            Create account
          </Button>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 3 }} variant="body2">
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
