"use client";
import {
    Box, Container, Typography, Card, CardContent,
    Avatar, Chip, Button, Divider, Grid, Link as MuiLink,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { PAGE_BG } from "@/lib/constants";

const DEV = {
    name:       "Suranan Satha",          //full name
    studentId:  "673450204-9",            //student ID
    email:      "suranan.s@kkumail.com",      //e-mail
    github:     "https://github.com/yourusername/pokedex",   // ← GitHub repo
    deploy:     "https://your-project.vercel.app",           // ← Vercel URL
    course:     "Internet Application Development",
    courseCode: "SC374002",
    curriculum: "Computer Science",
    faculty:    "Faculty of Science",
    university: "Khon Kaen University",
};

const STACK = ["Next.js 15", "React 19", "TypeScript", "Material UI v6", "PokéAPI", "Vercel"];

const FEATURES = [
    { icon: "📱", title: "Responsive Design",   desc: "Works on every screen — mobile, tablet, desktop." },
    { icon: "⚡", title: "Paginated Loading",   desc: "Fetches 24 Pokémon at a time; tap 'Load More' to continue." },
    { icon: "🔍", title: "Full Pokédex",        desc: "All 1 351 Pokémon from Generation I through IX." },
    { icon: "🔊", title: "Pokémon Cries",       desc: "Plays the official cry sound for every Pokémon." },
    { icon: "📊", title: "Base Stats",          desc: "Animated stat bars with a total score chip." },
    { icon: "🌿", title: "Evolution Chain",     desc: "Clickable evolution stages with sprite previews." },
];

/* ────────────────────────────────────────────────────────── */
const GLASS = {
    bgcolor: "rgba(255,255,255,0.055)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 3,
} as const;

export default function AboutPage() {
    const initial = DEV.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <Box sx={{ minHeight: "100vh", background: PAGE_BG }}>
            <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>

                {/* ── Header ────────────────────────────────── */}
                <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 } }}>
                    <Typography
                        variant="h2"
                        sx={{ color: "#f0f2f8", fontWeight: 900, letterSpacing: "-0.04em",
                            fontSize: { xs: "2rem", md: "2.8rem" },
                            textShadow: "0 0 60px rgba(229,20,26,0.35)" }}
                    >
                        About this Project
                    </Typography>
                    <Typography sx={{ color: "rgba(240,242,248,0.4)", mt: 1, fontSize: "0.95rem" }}>
                        A full-featured Pokédex built with Next.js&nbsp;+&nbsp;PokéAPI
                    </Typography>
                </Box>

                <Grid container spacing={3}>

                    {/* ── Developer card ───────────────────────── */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ ...GLASS, height: "100%" }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                                    <Avatar
                                        sx={{ width: 60, height: 60, bgcolor: "#e5141a", fontWeight: 900, fontSize: "1.3rem" }}
                                    >
                                        {initial}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ color: "#f0f2f8", fontWeight: 800, fontSize: "1.05rem" }}>{DEV.name}</Typography>
                                        <Typography variant="caption" sx={{ color: "rgba(240,242,248,0.45)" }}>{DEV.studentId}</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />
                                {[
                                    { label: "Course",      value: `${DEV.course} (${DEV.courseCode})` },
                                    { label: "Curriculum",  value: DEV.curriculum },
                                    { label: "Faculty",     value: DEV.faculty },
                                    { label: "University",  value: DEV.university },
                                    { label: "Email",       value: DEV.email },
                                ].map(({ label, value }) => (
                                    <Box key={label} sx={{ mb: 1.5 }}>
                                        <Typography variant="caption"
                                                    sx={{ color: "rgba(240,242,248,0.38)", textTransform: "uppercase", letterSpacing: "0.09em", display: "block", fontSize: "0.67rem" }}>
                                            {label}
                                        </Typography>
                                        <Typography sx={{ color: "rgba(240,242,248,0.82)", fontWeight: 600, fontSize: "0.88rem" }}>
                                            {value}
                                        </Typography>
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* ── Stack + Links ───────────────────────── */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {/* Tech stack */}
                        <Card sx={{ ...GLASS, mb: 3 }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography sx={{ color: "#ffd700", fontWeight: 800, mb: 1.5, fontSize: "0.92rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    Tech Stack
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {STACK.map(tech => (
                                        <Chip key={tech} label={tech} size="small"
                                              sx={{ bgcolor: "rgba(255,215,0,0.12)", color: "#ffd700", fontWeight: 700, border: "1px solid rgba(255,215,0,0.22)", fontSize: "0.72rem" }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Links */}
                        <Card sx={GLASS}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography sx={{ color: "#f0f2f8", fontWeight: 800, mb: 2, fontSize: "0.92rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    Links
                                </Typography>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                    <Button
                                        variant="outlined" startIcon={<GitHubIcon />}
                                        href={DEV.github} target="_blank" rel="noopener noreferrer" fullWidth
                                        sx={{ borderColor: "rgba(255,255,255,0.25)", color: "#f0f2f8", borderRadius: 2, textTransform: "none", fontWeight: 600, "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.07)" } }}
                                    >
                                        GitHub Source Code
                                    </Button>
                                    <Button
                                        variant="contained" startIcon={<OpenInNewIcon />}
                                        href={DEV.deploy} target="_blank" rel="noopener noreferrer" fullWidth
                                        sx={{ background: "linear-gradient(135deg, #e5141a 0%, #ff6000 100%)", color: "#fff", borderRadius: 2, textTransform: "none", fontWeight: 700, boxShadow: "0 4px 18px rgba(229,20,26,0.3)", "&:hover": { filter: "brightness(1.1)" } }}
                                    >
                                        Live Demo on Vercel
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* ── Features ─────────────────────────────── */}
                    <Grid size={{ xs: 12 }}>
                        <Card sx={GLASS}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Typography sx={{ color: "#f0f2f8", fontWeight: 800, mb: 2.5, fontSize: "0.92rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    Features
                                </Typography>
                                <Grid container spacing={2.5}>
                                    {FEATURES.map(({ icon, title, desc }) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={title}>
                                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                                                <Typography sx={{ fontSize: "1.45rem", lineHeight: 1 }}>{icon}</Typography>
                                                <Box>
                                                    <Typography sx={{ color: "#f0f2f8", fontWeight: 700, fontSize: "0.88rem" }}>{title}</Typography>
                                                    <Typography variant="caption" sx={{ color: "rgba(240,242,248,0.45)", lineHeight: 1.4, display: "block" }}>
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

                {/* ── Footer note ──────────────────────────── */}
                <Box sx={{ textAlign: "center", mt: 6 }}>
                    <Typography sx={{ color: "rgba(240,242,248,0.25)", fontSize: "0.8rem" }}>
                        Data by{" "}
                        <MuiLink href="https://pokeapi.co" target="_blank" sx={{ color: "rgba(240,242,248,0.4)", textDecorationColor: "rgba(240,242,248,0.2)" }}>
                            PokéAPI
                        </MuiLink>
                        {" · "}Pokémon © Nintendo / Game Freak / Creatures Inc.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}