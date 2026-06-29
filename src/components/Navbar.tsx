"use client";
// components/Navbar.tsx
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/",      label: "Pokédex" },
    { href: "/about", label: "About"   },
];

export default function Navbar() {
    const path = usePathname();
    return (
        <AppBar
            position="sticky"
            sx={{
                bgcolor: "rgba(6,8,15,0.92)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "none",
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ gap: 1, py: 0.5 }}>
                    {/* Logo */}
                    <Typography
                        component={Link}
                        href="/"
                        variant="h6"
                        sx={{
                            textDecoration: "none",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            mr: 3,
                            "& .pk": { color: "#e5141a" },
                            "& .dx": { color: "#f0f2f8" },
                        }}
                    >
                        <span className="pk">Poké</span>
                        <span className="dx">Dex</span>
                    </Typography>

                    {/* Nav links */}
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        {NAV.map(({ href, label }) => (
                            <Button
                                key={href}
                                component={Link}
                                href={href}
                                sx={{
                                    color: path === href ? "#ffd700" : "rgba(255,255,255,0.6)",
                                    fontWeight: path === href ? 700 : 500,
                                    borderRadius: 999,
                                    px: 2,
                                    bgcolor: path === href ? "rgba(255,215,0,0.1)" : "transparent",
                                    "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                                    transition: "all 0.18s",
                                    fontSize: "0.88rem",
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}