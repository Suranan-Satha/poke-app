"use client";
// app/pokemon/[pokemonname]/page.tsx — Classic Pokémon light theme
import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Box, Container, Typography, Chip, Grid, LinearProgress,
    Button, Skeleton, Avatar, Card, CardContent, CardActionArea, Tooltip,
} from "@mui/material";
import { TYPE_HEX, STAT_META, PAGE_BG, POKE_RED } from "@/lib/constants";

/* ── Types ──────────────────────────────────────────── */
interface PokemonDetail {
    id: number; name: string; height: number; weight: number;
    types:     { type: { name: string } }[];
    stats:     { base_stat: number; stat: { name: string } }[];
    abilities: { ability: { name: string }; is_hidden: boolean }[];
    sprites:   { front_default: string; other: { "official-artwork": { front_default: string } } };
    cries:     { latest: string; legacy: string };
}
interface PokemonSpecies {
    flavor_text_entries: { flavor_text: string; language: { name: string } }[];
    genera:              { genus: string; language: { name: string } }[];
    evolution_chain:     { url: string };
}
interface EvoStage { name: string; id: number }

/* ── Helpers ─────────────────────────────────────────── */
function parseEvolution(chain: any): EvoStage[][] {
    const stages: EvoStage[][] = [];
    function walk(node: any, depth: number) {
        const id = Number(node.species.url.split("/").filter(Boolean).pop());
        (stages[depth] ??= []).push({ name: node.species.name, id });
        node.evolves_to?.forEach((n: any) => walk(n, depth + 1));
    }
    walk(chain, 0);
    return stages;
}

/* ── 3D tilt artwork (CSS perspective, mouse-reactive) ── */
function TiltArtwork({ src, alt, typeColor, size }: { src: string; alt: string; typeColor: string; size: { xs: number; sm: number; md: number } }) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState({
        transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
        transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
    });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;   // 0 → 1
        const py = (e.clientY - rect.top) / rect.height;   // 0 → 1
        const rotateY = (px - 0.5) * 34;   // left/right tilt
        const rotateX = (0.5 - py) * 34;   // up/down tilt
        setStyle({
            transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.08,1.08,1.08)`,
            transition: "transform 0.08s linear",
        });
        setGlare({ x: px * 100, y: py * 100, opacity: 0.4 });
    };

    const handleLeave = () => {
        setStyle({
            transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
            transition: "transform 0.5s cubic-bezier(0.23,1,0.32,1)",
        });
        setGlare(g => ({ ...g, opacity: 0 }));
    };

    return (
        <Box
            ref={wrapRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            sx={{
                width: size, height: size,
                bgcolor: "#fff",
                border: `2px solid ${typeColor}40`,
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 8px 32px ${typeColor}30`,
                position: "relative",
                cursor: "grab",
                transformStyle: "preserve-3d",
                willChange: "transform",
                ...style,
            }}
        >
            <Box
                component="img" src={src} alt={alt}
                sx={{
                    width: "85%", height: "85%", objectFit: "contain",
                    filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.15))",
                    transform: "translateZ(45px)",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            />
            {/* Glare sweep — sells the 3D glass-card feel */}
            <Box
                sx={{
                    position: "absolute", inset: 0, borderRadius: "50%",
                    pointerEvents: "none",
                    background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.85), transparent 55%)`,
                    opacity: glare.opacity,
                    transition: "opacity 0.25s ease",
                }}
            />
        </Box>
    );
}

/* ── Loading skeleton ────────────────────────────────── */
function DetailSkeleton() {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: PAGE_BG, pt: 2 }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Skeleton variant="rounded" width={100} height={36} sx={{ mb: 3 }} />
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Skeleton variant="circular" width={200} height={200} />
                    <Skeleton variant="text" width="50%" height={48} />
                    <Skeleton variant="text" width="30%" height={28} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Skeleton variant="rounded" width={80} height={32} />
                        <Skeleton variant="rounded" width={80} height={32} />
                    </Box>
                    <Skeleton variant="rounded" width="100%" height={160} />
                    <Skeleton variant="rounded" width="100%" height={200} />
                </Box>
            </Container>
        </Box>
    );
}

/* ── Page ────────────────────────────────────────────── */
export default function PokemonDetailPage({ params }: { params: Promise<{ pokemonname: string }> }) {
    const { pokemonname } = use(params);
    const router = useRouter();

    const [pokemon,   setPokemon]   = useState<PokemonDetail | null>(null);
    const [species,   setSpecies]   = useState<PokemonSpecies | null>(null);
    const [evolution, setEvolution] = useState<EvoStage[][]>([]);
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(false);
    const [crying,    setCrying]    = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true); setError(false);
            try {
                const [pokRes, spRes] = await Promise.all([
                    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonname}`),
                    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonname}`),
                ]);
                if (!pokRes.ok) throw new Error("not found");
                const [pok, sp]: [PokemonDetail, PokemonSpecies] = await Promise.all([pokRes.json(), spRes.json()]);
                if (cancelled) return;
                setPokemon(pok); setSpecies(sp);
                const evo = await fetch(sp.evolution_chain.url).then(r => r.json());
                if (!cancelled) setEvolution(parseEvolution(evo.chain));
            } catch { if (!cancelled) setError(true); }
            finally { if (!cancelled) setLoading(false); }
        }
        load();
        return () => { cancelled = true; };
    }, [pokemonname]);

    const playCry = () => {
        const url = pokemon?.cries?.latest || pokemon?.cries?.legacy;
        if (!url) return;
        const audio = new Audio(url);
        setCrying(true);
        audio.play().catch(console.error);
        audio.onended = () => setCrying(false);
    };

    /* Error */
    if (error) return (
        <Box sx={{ minHeight: "100vh", bgcolor: PAGE_BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <Typography variant="h4" sx={{ color: "#111827" }}>Pokémon not found</Typography>
            <Button variant="contained" onClick={() => router.push("/")}
                    sx={{ borderRadius: 999, px: 4, bgcolor: POKE_RED, "&:hover": { bgcolor: "#aa0000" } }}>
                ← Back to Pokédex
            </Button>
        </Box>
    );

    if (loading || !pokemon || !species) return <DetailSkeleton />;

    /* Derived values */
    const primaryType  = pokemon.types[0]?.type.name ?? "normal";
    const typeColor    = TYPE_HEX[primaryType] ?? "#A8A878";
    const artwork      = pokemon.sprites.other["official-artwork"].front_default ?? pokemon.sprites.front_default;
    const totalStats   = pokemon.stats.reduce((s, x) => s + x.base_stat, 0);
    const flavorText   = species.flavor_text_entries.find(e => e.language.name === "en")
        ?.flavor_text.replace(/[\n\f\r]/g, " ") ?? "";
    const genus        = species.genera.find(g => g.language.name === "en")?.genus ?? "";

    /* Shared card style */
    const CARD = {
        bgcolor: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: PAGE_BG }}>

            {/* ── Type-tinted hero (light) ────────────────── */}
            <Box sx={{
                background: `linear-gradient(135deg, ${typeColor}30 0%, ${typeColor}10 60%, ${PAGE_BG} 100%)`,
                borderBottom: `3px solid ${typeColor}50`,
                pt: { xs: 3, md: 5 }, pb: { xs: 4, md: 6 },
            }}>
                <Container maxWidth="md">
                    <Button onClick={() => router.back()}
                            sx={{ color: POKE_RED, fontWeight: 700, mb: 2, "&:hover": { bgcolor: "rgba(204,0,0,0.06)" } }}>
                        ← Back
                    </Button>

                    <Grid container spacing={3} sx={{ alignItems: "center" }}>
                        {/* Artwork */}
                        <Grid size={{ xs: 12, sm: 5 }} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                            <TiltArtwork
                                src={artwork}
                                alt={pokemon.name}
                                typeColor={typeColor}
                                size={{ xs: 180, sm: 220, md: 260 }}
                            />

                            {/* Cry button */}
                            <Tooltip title={crying ? "Playing…" : "Play cry"}>
                <span>   {/* span wrapper fixes Tooltip + disabled button warning */}
                    <Button onClick={playCry} disabled={crying} variant="outlined"
                            sx={{
                                borderRadius: 999, px: 3,
                                color: typeColor, borderColor: `${typeColor}80`,
                                "&:hover": { borderColor: typeColor, bgcolor: `${typeColor}10` },
                                "&.Mui-disabled": { color: "#9ca3af", borderColor: "#e5e7eb" },
                            }}>
                    {crying ? "🔊 Playing…" : "🔊 Play Cry"}
                  </Button>
                </span>
                            </Tooltip>
                        </Grid>

                        {/* Info */}
                        <Grid size={{ xs: 12, sm: 7 }}>
                            <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 700, letterSpacing: "0.12em", fontSize: "0.88rem" }}>
                                #{String(pokemon.id).padStart(4, "0")}
                            </Typography>
                            <Typography variant="h2"
                                        sx={{ color: "#111827", fontWeight: 900, textTransform: "capitalize", lineHeight: 1.05, mt: 0.5, mb: 0.75, fontSize: { xs: "2.2rem", md: "3rem" } }}>
                                {pokemon.name}
                            </Typography>
                            {genus && (
                                <Typography sx={{ color: "#6b7280", fontStyle: "italic", mb: 1.5 }}>{genus}</Typography>
                            )}

                            {/* Types */}
                            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                                {pokemon.types.map(({ type }) => (
                                    <Chip key={type.name} label={type.name}
                                          sx={{ bgcolor: TYPE_HEX[type.name] ?? "#777", color: "#fff", textTransform: "capitalize", fontWeight: 700, height: 28 }} />
                                ))}
                            </Box>

                            {/* Flavor text */}
                            {flavorText && (
                                <Typography sx={{ color: "#374151", lineHeight: 1.65, mb: 2.5, fontSize: "0.93rem" }}>
                                    {flavorText}
                                </Typography>
                            )}

                            {/* Height / Weight / Abilities */}
                            <Grid container spacing={1.5}>
                                {[{ label: "Height", value: `${(pokemon.height / 10).toFixed(1)} m` },
                                    { label: "Weight", value: `${(pokemon.weight / 10).toFixed(1)} kg` }].map(({ label, value }) => (
                                    <Grid size={{ xs: 6 }} key={label}>
                                        <Box sx={{ bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 2, p: 1.5, textAlign: "center" }}>
                                            <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.68rem" }}>
                                                {label}
                                            </Typography>
                                            <Typography sx={{ color: "#111827", fontWeight: 700, fontSize: "1rem" }}>{value}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 2, p: 1.5 }}>
                                        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.68rem", mb: 0.5 }}>
                                            Abilities
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                                            {pokemon.abilities.map(({ ability, is_hidden }) => (
                                                <Chip key={ability.name}
                                                      label={`${ability.name}${is_hidden ? " (hidden)" : ""}`}
                                                      size="small"
                                                      sx={{ bgcolor: "rgba(0,0,0,0.05)", color: "#374151", textTransform: "capitalize", fontSize: "0.73rem" }} />
                                            ))}
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ── Stats + Evolution ───────────────────────── */}
            <Container maxWidth="md" sx={{ py: 5 }}>

                {/* Base stats */}
                <Card sx={{ ...CARD, p: { xs: 2.5, md: 4 }, mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h5" sx={{ color: "#111827", fontWeight: 800 }}>Base Stats</Typography>
                        <Chip label={`Total: ${totalStats}`} sx={{ bgcolor: typeColor, color: "#fff", fontWeight: 800 }} />
                    </Box>
                    {pokemon.stats.map(({ stat, base_stat }) => {
                        const meta = STAT_META[stat.name] ?? { label: stat.name.toUpperCase(), color: "#999" };
                        const pct  = Math.min((base_stat / 255) * 100, 100);
                        return (
                            <Box key={stat.name} sx={{ mb: 2 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700, minWidth: 60, letterSpacing: "0.06em" }}>
                                        {meta.label}
                                    </Typography>
                                    <Typography sx={{ color: "#111827", fontWeight: 800, fontSize: "0.92rem", minWidth: 36, textAlign: "right" }}>
                                        {base_stat}
                                    </Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={pct}
                                                sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(0,0,0,0.07)", "& .MuiLinearProgress-bar": { bgcolor: meta.color, borderRadius: 4, transition: "transform 0.7s ease" } }} />
                            </Box>
                        );
                    })}
                </Card>

                {/* Evolution chain */}
                {evolution.length > 1 && (
                    <Card sx={{ ...CARD, p: { xs: 2.5, md: 4 } }}>
                        <Typography variant="h5" sx={{ color: "#111827", fontWeight: 800, mb: 3 }}>Evolution</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: { xs: 1, sm: 2 } }}>
                            {evolution.map((stage, si) => (
                                <Box key={si} sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
                                    {si > 0 && <Typography sx={{ color: "#d1d5db", fontSize: { xs: "1.4rem", sm: "2rem" } }}>→</Typography>}
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                        {stage.map(({ name, id }) => (
                                            <CardActionArea key={name} onClick={() => router.push(`/pokemon/${name}`)}
                                                            sx={{
                                                                borderRadius: 3, p: 1.5,
                                                                display: "flex", flexDirection: "column", alignItems: "center",
                                                                minWidth: { xs: 72, sm: 88 },
                                                                bgcolor: name === pokemonname ? `${typeColor}15` : "transparent",
                                                                border: `2px solid ${name === pokemonname ? typeColor : "transparent"}`,
                                                                "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                                                                transition: "all 0.2s",
                                                            }}>
                                                <Avatar
                                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                                                    alt={name}
                                                    sx={{ width: { xs: 56, sm: 64 }, height: { xs: 56, sm: 64 }, bgcolor: "rgba(0,0,0,0.04)" }}
                                                />
                                                <Typography variant="caption"
                                                            sx={{ color: name === pokemonname ? typeColor : "#6b7280", textTransform: "capitalize", fontWeight: 700, textAlign: "center", mt: 0.5, fontSize: "0.68rem" }}>
                                                    {name}
                                                </Typography>
                                            </CardActionArea>
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                )}

                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button onClick={() => router.push("/")} sx={{ color: "#9ca3af", "&:hover": { color: POKE_RED } }}>
                        ← Back to all Pokémon
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}