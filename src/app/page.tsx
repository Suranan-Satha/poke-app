"use client";
// app/page.tsx — Paginated Pokémon grid (24/batch, up to 1 351 total)
import { useState, useEffect, useRef } from "react";
import {
    Box, Container, Typography, Card, CardContent, CardActionArea,
    Grid, Chip, Skeleton, Button, LinearProgress,
} from "@mui/material";
import { TYPE_HEX, LIMIT, TOTAL, PAGE_BG } from "@/lib/constants";

/* ── Types ───────────────────────────────────────────────── */
interface Pokemon {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: { front_default: string; other: { "official-artwork": { front_default: string } } };
}

/* ── Skeleton card ───────────────────────────────────────── */
function CardSkeleton() {
    const s = { bgcolor: "rgba(255,255,255,0.08)" };
    return (
        <Card sx={{ borderRadius: 3, height: "100%", bgcolor: "rgba(255,255,255,0.05)" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 2.5 }}>
                <Skeleton variant="circular"  width={88}  height={88}  sx={s} />
                <Skeleton variant="text"      width={40}  height={14}  sx={s} />
                <Skeleton variant="text"      width={80}  height={22}  sx={s} />
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Skeleton variant="rounded" width={54}  height={22}  sx={s} />
                    <Skeleton variant="rounded" width={54}  height={22}  sx={s} />
                </Box>
            </CardContent>
        </Card>
    );
}

/* ── Pokémon card ────────────────────────────────────────── */
function PokemonCard({ p }: { p: Pokemon }) {
    const art   = p.sprites.other["official-artwork"].front_default ?? p.sprites.front_default;
    const color = TYPE_HEX[p.types[0]?.type.name ?? "normal"] ?? "#A8A878";
    return (
        <Card
            sx={{
                height: "100%", borderRadius: 3,
                bgcolor: `${color}12`,
                border: `1.5px solid ${color}38`,
                backdropFilter: "blur(8px)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-6px)", boxShadow: `0 14px 32px ${color}50` },
            }}
        >
            <CardActionArea href={`/pokemon/${p.name}`} sx={{ height: "100%" }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 2.5, px: 2 }}>
                    <Box
                        component="img" src={art} alt={p.name} loading="lazy"
                        sx={{ width: 88, height: 88, objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}
                    />
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.12em" }}>
                        #{String(p.id).padStart(4, "0")}
                    </Typography>
                    <Typography sx={{ color: "#f0f2f8", fontWeight: 700, textTransform: "capitalize", fontSize: "0.9rem", lineHeight: 1.2, textAlign: "center" }}>
                        {p.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: "center" }}>
                        {p.types.map(({ type }) => (
                            <Chip key={type.name} label={type.name} size="small"
                                  sx={{ bgcolor: TYPE_HEX[type.name] ?? "#777", color: "#fff", textTransform: "capitalize", fontSize: "0.63rem", height: 20, fontWeight: 700 }} />
                        ))}
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

/* ── Home page ───────────────────────────────────────────── */
export default function Home() {
    const [list,    setList]    = useState<Pokemon[]>([]);
    const [offset,  setOffset]  = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const busy = useRef(false);

    const fetchBatch = async (off: number) => {
        if (busy.current) return;
        busy.current = true;
        setLoading(true);
        try {
            const { results } = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${off}`
            ).then(r => r.json());

            const details: Pokemon[] = await Promise.all(
                results.map((r: { url: string }) => fetch(r.url).then(res => res.json()))
            );

            setList(prev => [...prev, ...details]);
            setOffset(off + LIMIT);
            setHasMore(off + LIMIT < TOTAL);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            busy.current = false;
        }
    };

    useEffect(() => { fetchBatch(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const pct = Math.min(Math.round((list.length / TOTAL) * 100), 100);

    return (
        <Box sx={{ minHeight: "100vh", background: PAGE_BG }}>

            {/* ── Hero ───────────────────────────────────────── */}
            <Box sx={{ textAlign: "center", pt: { xs: 5, md: 8 }, pb: { xs: 3, md: 5 }, px: 2 }}>
                <Typography
                    variant="h2"
                    sx={{
                        color: "#f0f2f8", fontWeight: 900, letterSpacing: "-0.04em",
                        fontSize: { xs: "2.8rem", sm: "3.6rem", md: "4.6rem" },
                        textShadow: "0 0 80px rgba(229,20,26,0.45)",
                    }}
                >
                    Pokédex
                </Typography>
                <Typography sx={{ color: "rgba(240,242,248,0.45)", mt: 1, fontSize: "1rem" }}>
                    All {TOTAL.toLocaleString()} Pokémon · Gen I – IX
                </Typography>

                {/* Progress */}
                <Box sx={{ maxWidth: 400, mx: "auto", mt: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                        <Typography variant="caption" sx={{ color: "rgba(240,242,248,0.35)" }}>{list.length} loaded</Typography>
                        <Typography variant="caption" sx={{ color: "rgba(240,242,248,0.35)" }}>{pct}%</Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate" value={pct}
                        sx={{
                            height: 6, borderRadius: 4,
                            bgcolor: "rgba(255,255,255,0.07)",
                            "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #e5141a, #ffd700)", borderRadius: 4 },
                        }}
                    />
                </Box>
            </Box>

            {/* ── Grid ───────────────────────────────────────── */}
            <Container maxWidth="xl" sx={{ pb: 10 }}>
                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    {list.map(p => (
                        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={p.id}>
                            <PokemonCard p={p} />
                        </Grid>
                    ))}
                    {loading && Array.from({ length: LIMIT }).map((_, i) => (
                        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={`sk-${offset}-${i}`}>
                            <CardSkeleton />
                        </Grid>
                    ))}
                </Grid>

                {/* Load more */}
                {hasMore && !loading && (
                    <Box sx={{ textAlign: "center", mt: 7 }}>
                        <Button
                            variant="contained" size="large"
                            onClick={() => fetchBatch(offset)}
                            sx={{
                                borderRadius: 999, px: 5, py: 1.5,
                                background: "linear-gradient(135deg, #e5141a 0%, #ff6000 100%)",
                                color: "#fff", fontWeight: 800, fontSize: "0.95rem",
                                boxShadow: "0 6px 28px rgba(229,20,26,0.35)",
                                "&:hover": { filter: "brightness(1.1)", transform: "scale(1.03)" },
                                transition: "all 0.2s",
                            }}
                        >
                            Load More &nbsp;({list.length} / {TOTAL})
                        </Button>
                    </Box>
                )}

                {!hasMore && list.length > 0 && (
                    <Box sx={{ textAlign: "center", mt: 7 }}>
                        <Typography sx={{ color: "rgba(240,242,248,0.4)", fontSize: "1rem" }}>
                            🎉 All {TOTAL.toLocaleString()} Pokémon loaded!
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}