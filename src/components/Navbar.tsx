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
                bgcolor: "#ffffff", // 1. เปลี่ยนพื้นหลังเป็นสีขาว
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)", // ปรับเงาให้ดูนุ่มขึ้น
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ gap: 1, py: 0.5 }}>
                    <Typography
                        component={Link}
                        href="/"
                        variant="h6"
                        sx={{
                            textDecoration: "none",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                            mr: 3,
                            lineHeight: 1,
                        }}
                    >
                        {/* 2. เปลี่ยนสีโลโก้ให้ตัดกับพื้นหลังสีขาว */}
                        <Box component="span" sx={{ color: "#CC0000" }}>Poké</Box>
                        <Box component="span" sx={{ color: "#111827" }}>Dex</Box>
                    </Typography>

                    <Box sx={{ display: "flex", gap: 0.5 }}>
                        {NAV.map(({ href, label }) => (
                            <Button
                                key={href}
                                component={Link}
                                href={href}
                                sx={{
                                    // 3. เปลี่ยนสีปุ่มเมนูต่างๆ
                                    color:   path === href ? "#CC0000" : "#6b7280",
                                    fontWeight: path === href ? 700 : 500,
                                    borderRadius: 999,
                                    px: 2,
                                    bgcolor: path === href ? "rgba(204,0,0,0.08)" : "transparent",
                                    "&:hover": { color: "#111827", bgcolor: "rgba(0,0,0,0.04)" },
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