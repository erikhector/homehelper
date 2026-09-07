import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ChecklistRtlRoundedIcon from "@mui/icons-material/ChecklistRtlRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

const features = [
  {
    color: "#8b46df",
    description: "Se direkt vad som ligger hemma och vad som redan finns på förskolan, per barn och kategori.",
    icon: ChecklistRtlRoundedIcon,
    title: "Packlista som håller koll"
  },
  {
    color: "#e08a2f",
    description: 'Fylls det på av sig själv? Nej. Men tryck på "Fyll allt" så är barnets väska redo på sekunden.',
    icon: NotificationsActiveRoundedIcon,
    title: "Redo för i morgon"
  },
  {
    color: "#2f9e6b",
    description: "Bygg en mall med allt barnet ska ha och aktivera den – klart, ingen mer huvudräkning.",
    icon: ListAltRoundedIcon,
    title: "Mallar för varje barn"
  },
  {
    color: "#c23b7a",
    description: "Lägg till hur många barn du vill och växla mellan dem med ett klick.",
    icon: FamilyRestroomRoundedIcon,
    title: "Flera barn, en app"
  },
  {
    color: "#3e6fd8",
    description: "Bjud in den andra föräldern eller en vårdnadshavare så uppdateras listan för er båda live.",
    icon: ShareRoundedIcon,
    title: "Dela med familjen"
  },
  {
    color: "#a72d64",
    description: "Bygg listor som passar just er vardag – förskola, fritids eller helgväskan till mormor.",
    icon: DashboardCustomizeRoundedIcon,
    title: "Anpassa efter er vardag"
  }
];

const steps = [
  { description: "Registrera dig på under en minut, helt gratis.", icon: PersonAddAltRoundedIcon, title: "Skapa ett konto" },
  { description: "Lägg till barnet och bygg en mall med det som ska finnas på förskolan.", icon: ListAltRoundedIcon, title: "Lägg till barnet" },
  { description: "Fyll i vad som finns hemma – appen räknar ut vad som saknas.", icon: ChecklistRtlRoundedIcon, title: "Fyll i packlistan" },
  { description: "Bjud in den andra föräldern så slipper ni dubbelkolla väskan.", icon: GroupAddRoundedIcon, title: "Dela med någon" }
];

export default function Index() {
  return (
    <Box component="section">
      <Helmet title="Ordning på vardagen" />

      <Box sx={{ display: "grid", placeItems: "center", px: { sm: 4, xs: 2 }, py: { sm: 10, xs: 6 } }}>
        <Box sx={{ maxWidth: 640, textAlign: "center" }}>
          <Stack
            alignItems="center"
            direction="row"
            spacing={0.75}
            sx={{
              bgcolor: "primary.light",
              borderRadius: 999,
              color: "primary.dark",
              display: "inline-flex",
              fontWeight: 700,
              fontSize: "0.8rem",
              px: 1.75,
              py: 0.6
            }}
          >
            <AutoAwesomeRoundedIcon fontSize="inherit" sx={{ fontSize: "1rem" }} />
            <span>Lugnare morgnar börjar här</span>
          </Stack>
          <Typography component="h1" sx={{ mt: 3 }} variant="h3">
            Allt barnet behöver,{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              packat och klart.
            </Box>
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.125rem", mt: 2 }}>
            Håll packlistan för förskolan uppdaterad och synkad mellan föräldrar och vårdnadshavare – ingen mer letande efter regnbyxorna klockan sju
            på morgonen.
          </Typography>
          <Stack direction={{ sm: "row", xs: "column" }} spacing={1.5} sx={{ justifyContent: "center", mt: 4 }}>
            <Button component={Link} endIcon={<AutoAwesomeRoundedIcon />} size="large" to="/signup" variant="contained">
              Skapa konto
            </Button>
            <Button component={Link} size="large" startIcon={<LoginRoundedIcon />} to="/login" variant="outlined">
              Logga in
            </Button>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 2.5 }} variant="body2">
            Helt gratis att komma igång – klart på under 2 minuter.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1120, mx: "auto", px: { sm: 4, xs: 2 }, py: { sm: 4, xs: 2 } }}>
        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { md: "repeat(3, 1fr)", sm: "repeat(2, 1fr)", xs: "1fr" } }}>
          {features.map(({ color, description, icon: Icon, title }) => (
            <Paper
              key={title}
              sx={{
                "&:hover": { boxShadow: 4, transform: "translateY(-4px)" },
                p: 3,
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              variant="outlined"
            >
              <Box
                sx={{
                  alignItems: "center",
                  bgcolor: `${color}26`,
                  borderRadius: 2.5,
                  color,
                  display: "flex",
                  height: 44,
                  justifyContent: "center",
                  mb: 1.5,
                  width: 44
                }}
              >
                <Icon />
              </Box>
              <Typography component="h3" variant="h6">
                {title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
                {description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1120, mx: "auto", px: { sm: 4, xs: 2 }, py: { sm: 8, xs: 5 } }}>
        <Stack alignItems="center" spacing={0.75} sx={{ textAlign: "center" }}>
          <Typography component="h2" variant="h4">
            Så funkar det
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 440 }}>
            Fyra steg mellan dig och en väska som packar sig (nästan) själv.
          </Typography>
        </Stack>
        <Box sx={{ display: "grid", gap: { sm: 4, xs: 3 }, gridTemplateColumns: { md: "repeat(4, 1fr)", sm: "repeat(2, 1fr)", xs: "1fr" }, mt: 5 }}>
          {steps.map(({ description, icon: Icon, title }, index) => (
            <Stack key={title} alignItems="center" spacing={1.25} sx={{ textAlign: "center" }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    alignItems: "center",
                    bgcolor: "primary.light",
                    borderRadius: "50%",
                    color: "primary.dark",
                    display: "flex",
                    height: 56,
                    justifyContent: "center",
                    width: 56
                  }}
                >
                  <Icon />
                </Box>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                    color: "primary.contrastText",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    height: 22,
                    position: "absolute",
                    right: -4,
                    top: -4,
                    width: 22
                  }}
                >
                  {index + 1}
                </Stack>
              </Box>
              <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {description}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>

      <Box sx={{ px: { sm: 4, xs: 2 }, py: { sm: 4, xs: 3 } }}>
        <Paper
          sx={{
            bgcolor: "primary.light",
            borderRadius: 5,
            maxWidth: 720,
            mx: "auto",
            p: { sm: 6, xs: 4 },
            textAlign: "center"
          }}
        >
          <Typography component="h2" variant="h4">
            Redo att lugna ner morgonstressen?
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 420, mt: 1.5, mx: "auto" }}>
            Skapa ett konto, lägg till barnet och bjud in den andra föräldern – helt gratis.
          </Typography>
          <Button component={Link} endIcon={<AutoAwesomeRoundedIcon />} size="large" sx={{ mt: 3 }} to="/signup" variant="contained">
            Kom igång nu
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
