import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar color="inherit" elevation={0} position="static" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ gap: 1.5, justifyContent: "space-between", minHeight: { xs: 64, sm: 72 } }}>
          <Box component={Link} sx={{ alignItems: "center", color: "inherit", display: "flex", gap: 1.25, textDecoration: "none" }} to="/">
            <Box
              sx={{
                alignItems: "center",
                bgcolor: "primary.main",
                borderRadius: 2,
                color: "common.white",
                display: "flex",
                height: 36,
                justifyContent: "center",
                width: 36
              }}
            >
              <HomeRoundedIcon />
            </Box>
            <Typography color="primary.dark" component="span" sx={{ fontSize: "1.15rem", fontWeight: 800 }}>
              HomeHelper
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </Box>
  );
}
