import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { register } from "Src/api/Auth";
import { ProblemDetailsError } from "Src/api/HttpClient";

interface SignupFormValues {
  displayName: string;
  email: string;
  password: string;
}

export default function Index() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleSubmit, register: registerField } = useForm<SignupFormValues>();
  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      queryClient.setQueryData(["current-user"], user);
      navigate("/children");
    }
  });
  const errorMessage =
    registerMutation.error instanceof ProblemDetailsError ? registerMutation.error.detail : "Det gick inte att skapa kontot. Försök igen.";

  const submitRegistration = ({ displayName, email, password }: SignupFormValues) => {
    registerMutation.mutate({ displayName, email, password });
  };

  return (
    <Box component="section" sx={{ display: "grid", minHeight: "calc(100vh - 73px)", placeItems: "center", px: 2, py: 5 }}>
      <Helmet title="Skapa konto" />
      <Paper
        component="form"
        sx={{ maxWidth: 440, p: { sm: 4, xs: 3 }, width: "100%" }}
        variant="outlined"
        onSubmit={handleSubmit(submitRegistration)}
      >
        <Typography component="h1" variant="h4">
          Skapa ditt konto
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Ett konto håller alla anslutna vårdnadshavare uppdaterade.
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {registerMutation.isError && <Alert severity="error">{errorMessage}</Alert>}
          <TextField required autoComplete="name" label="Ditt namn" {...registerField("displayName", { required: true })} />
          <TextField required autoComplete="email" label="E-post" type="email" {...registerField("email", { required: true })} />
          <TextField required autoComplete="new-password" label="Lösenord" type="password" {...registerField("password", { required: true })} />
          <Button disabled={registerMutation.isPending} type="submit" variant="contained">
            {registerMutation.isPending ? "Skapar konto..." : "Skapa konto"}
          </Button>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 3 }} variant="body2">
          Har du redan ett konto? <Link to="/login">Logga in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
