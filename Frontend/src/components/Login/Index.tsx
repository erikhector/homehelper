import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "Src/api/Auth";
import { ProblemDetailsError } from "Src/api/HttpClient";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Index() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleSubmit, register } = useForm<LoginFormValues>();
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(["current-user"], user);
      navigate("/children");
    }
  });
  const errorMessage = loginMutation.error instanceof ProblemDetailsError ? loginMutation.error.detail : "Det gick inte att logga in. Försök igen.";

  const submitLogin = ({ email, password }: LoginFormValues) => {
    loginMutation.mutate({ email, password });
  };

  return (
    <Box component="section" sx={{ display: "grid", minHeight: "calc(100vh - 73px)", placeItems: "center", px: 2, py: 5 }}>
      <Helmet title="Logga in" />
      <Paper component="form" sx={{ maxWidth: 440, p: { sm: 4, xs: 3 }, width: "100%" }} variant="outlined" onSubmit={handleSubmit(submitLogin)}>
        <Typography component="h1" variant="h4">
          Välkommen tillbaka
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Logga in för att se dina barns packlistor.
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {loginMutation.isError && <Alert severity="error">{errorMessage}</Alert>}
          <TextField required autoComplete="email" label="E-post" type="email" {...register("email", { required: true })} />
          <TextField required autoComplete="current-password" label="Lösenord" type="password" {...register("password", { required: true })} />
          <Button disabled={loginMutation.isPending} type="submit" variant="contained">
            {loginMutation.isPending ? "Loggar in..." : "Logga in"}
          </Button>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 3 }} variant="body2">
          Ny på HomeHelper? <Link to="/signup">Skapa ett konto</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
