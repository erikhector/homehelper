import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

export default function Index() {
  return (
    <Box component="section" sx={{ display: "grid", minHeight: "calc(100vh - 73px)", placeItems: "center", px: 2, py: 5 }}>
      <Helmet title="Log in" />
      <Paper
        component="form"
        sx={{ maxWidth: 440, p: { sm: 4, xs: 3 }, width: "100%" }}
        variant="outlined"
        onSubmit={(event) => event.preventDefault()}
      >
        <Typography component="h1" variant="h4">
          Welcome back
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Log in to see your children&apos;s packing lists.
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField autoComplete="email" label="Email" required type="email" />
          <TextField autoComplete="current-password" label="Password" required type="password" />
          <Button type="submit" variant="contained">
            Log in
          </Button>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 3 }} variant="body2">
          New to HomeHelper? <Link to="/signup">Create an account</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
