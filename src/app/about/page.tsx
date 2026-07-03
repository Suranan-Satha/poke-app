"use client";
import {
    Box, Container, Typography, Card, CardContent,
    Avatar, Chip, Button, Divider, Grid, Link as MuiLink,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { PAGE_BG, POKE_RED } from "@/lib/constants";

/* ─── Fill in your own info ─────────────────────────── */
const DEV = {
    name:       "Suranan Satha",
    studentId:  "673450204-9",
    email:      "suranan.s@kkumail.com",
    github:     "https://github.com/Suranan-Satha/poke-app.git",
    course:     "Front-end Web Programming",
    courseCode: "IN403101",
    curriculum: "Computer Science",
    faculty:    "Interdisciplinary Studies.",
    university: "Khon Kaen University",
};

const STACK = ["Next.js 15", "React 19", "TypeScript", "Material UI v6", "PokéAPI", "Vercel"];

const FEATURES = [
    { icon: "📱", title: "Responsive Design",  desc: "Works on every screen — mobile, tablet, desktop." },
    { icon: "🔍", title: "Search",             desc: "Real-time search across all 1,351 Pokémon by name." },
    { icon: "⚡", title: "Paginated Loading",  desc: "Fetches 24 Pokémon at a time; tap Load More to continue." },
    { icon: "🔊", title: "Pokémon Cries",      desc: "Plays the official cry sound for every Pokémon." },
    { icon: "📊", title: "Base Stats",         desc: "Animated stat bars with a total score chip." },
    { icon: "🌿", title: "Evolution Chain",    desc: "Clickable evolution stages with sprite previews." },
];

/* ── Shared card style ───────────────────────────────── */
const CARD = {
    bgcolor: "#fff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 3,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
} as const;

export default function AboutPage() {
    const initial = DEV.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: PAGE_BG }}>
            {/* ── White hero banner ───────────────────────────── */}
            <Box sx={{
                bgcolor: "#ffffff", // 1. เปลี่ยนเป็นพื้นหลังสีขาว
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                py: { xs: 5, md: 7 }, px: 2, textAlign: "center",
            }}>
                <Typography variant="h2" sx={{
                    color: "#111827", // 2. เปลี่ยนข้อความเป็นสีดำ
                    fontWeight: 900, letterSpacing: "-0.04em",
                    fontSize: { xs: "1.9rem", md: "2.8rem" },
                }}>
                    About this Project
                </Typography>
                <Typography sx={{ color: "#6b7280", mt: 1, fontSize: "0.95rem" }}> {/* 3. เปลี่ยนสีข้อความอธิบาย */}
                    A full-featured Pokédex built with Next.js + PokéAPI
                </Typography>
            </Box>

            <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
                <Grid container spacing={3}>

                    {/* ── Developer info ───────────────────────── */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ ...CARD, height: "100%" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                                    <Avatar sx={{ width: 60, height: 60, bgcolor: POKE_RED, fontWeight: 900, fontSize: "1.3rem" }}>
                                        {initial}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ color: "#111827", fontWeight: 800, fontSize: "1.05rem" }}>{DEV.name}</Typography>
                                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>{DEV.studentId}</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                {[
                                    { label: "Course",     value: `${DEV.course} (${DEV.courseCode})` },
                                    { label: "Curriculum", value: DEV.curriculum },
                                    { label: "Faculty",    value: DEV.faculty },
                                    { label: "University", value: DEV.university },
                                    { label: "Email",      value: DEV.email },
                                ].map(({ label, value }) => (
                                    <Box key={label} sx={{ mb: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.09em", display: "block", fontSize: "0.67rem" }}>
                                            {label}
                                        </Typography>
                                        <Typography sx={{ color: "#374151", fontWeight: 600, fontSize: "0.88rem" }}>
                                            {value}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* ── Stack + GitHub ───────────────────────── */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {/* Tech Stack */}
                        <Card sx={{ ...CARD, mb: 3 }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography sx={{ color: POKE_RED, fontWeight: 800, mb: 1.5, fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                    Tech Stack
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {STACK.map(tech => (
                                        <Chip key={tech} label={tech} size="small"
                                              sx={{ bgcolor: "rgba(204,0,0,0.07)", color: POKE_RED, fontWeight: 700, border: `1px solid rgba(204,0,0,0.18)`, fontSize: "0.72rem" }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* GitHub link only (Vercel link removed) */}
                        <Card sx={CARD}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography sx={{ color: "#111827", fontWeight: 800, mb: 2, fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                    Source Code
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<GitHubIcon />}
                                    href={DEV.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    fullWidth
                                    sx={{
                                        bgcolor: "#24292f", color: "#fff", borderRadius: 2,
                                        textTransform: "none", fontWeight: 700, py: 1.4,
                                        "&:hover": { bgcolor: "#1c2128" },
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    }}
                                >
                                    View on GitHub
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* ── Features ─────────────────────────────── */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={CARD}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography sx={{ color: "#111827", fontWeight: 800, mb: 2.5, fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                    Features
                                </Typography>
                                <Grid container spacing={2.5}>
                                    {FEATURES.map(({ icon, title, desc }) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={title}>
                                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                                <Typography sx={{ fontSize: "1.4rem", lineHeight: 1 }}>{icon}</Typography>
                                                <Box>
                                                    <Typography sx={{ color: "#111827", fontWeight: 700, fontSize: "0.88rem" }}>{title}</Typography>
                                                    <Typography variant="caption" sx={{ color: "#6b7280", lineHeight: 1.4, display: "block" }}>
                                                        {desc}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{ textAlign: "center", mt: 5 }}>
                    <Typography sx={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                        Data by{" "}
                        <MuiLink href="https://pokeapi.co" target="_blank" sx={{ color: "#6b7280" }}>
                            PokéAPI
                        </MuiLink>
                        {" · "}Pokémon © Nintendo / Game Freak / Creatures Inc.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}