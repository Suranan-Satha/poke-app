"use client";
// app/page.tsx — Classic Pokémon theme + real-time search
import { useState, useEffect, useRef } from "react";
import {
    Box, Container, Typography, Card, CardContent, CardActionArea,
    Grid, Chip, Skeleton, Button, LinearProgress,
    TextField, InputAdornment, IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon  from "@mui/icons-material/Clear";
import { TYPE_HEX, LIMIT, TOTAL, PAGE_BG, POKE_RED } from "@/lib/constants";

/* ── Types ──────────────────────────────────────────── */
interface Pokemon {
    id: number;
    name: string;
    types: { type: { name: string } }[];
    sprites: { front_default: string; other: { "official-artwork": { front_default: string } } };
}

/* ── Skeleton card ──────────────────────────────────── */
function CardSkeleton() {
    return (
        <Card sx={{ borderRadius: 3, height: "100%", bgcolor: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderTop: "4px solid #e5e7eb" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 2.5 }}>
                <Skeleton variant="circular"  width={88} height={88} />
                <Skeleton variant="text"      width={40} height={14} />
                <Skeleton variant="text"      width={80} height={22} />
                <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Skeleton variant="rounded" width={54} height={20} />
                    <Skeleton variant="rounded" width={54} height={20} />
                </Box>
            </CardContent>
        </Card>
    );
}

/* ── 🥚 Secret entry (easter egg) ─────────────────────
   Save your own Nergigante artwork into: public/secret/nergigante.png
   (this app never hosts or generates Capcom's copyrighted art itself) */
const SECRET_NERGIGANTE: Pokemon = {
    id: 9999,
    name: "nergigante",
    types: [{ type: { name: "dragon" } }],
    sprites: {
        front_default: "/secret/nergigante.png",
        other: { "official-artwork": { front_default: "/secret/nergigante.png" } },
    },
};

/* ── Pokémon card ───────────────────────────────────── */
function PokemonCard({ p }: { p: Pokemon }) {
    const isSecret = p.name === "nergigante";
    const art   = p.sprites.other["official-artwork"].front_default ?? p.sprites.front_default;
    const color = isSecret ? "#7038F8" : (TYPE_HEX[p.types[0]?.type.name ?? "normal"] ?? "#A8A878");
    return (
        <Card sx={{
            height: "100%", borderRadius: 3,
            bgcolor: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            borderTop: `4px solid ${color}`,          /* type-colour top stripe */
            boxShadow: isSecret ? "0 0 18px rgba(112,56,248,0.5)" : "0 2px 8px rgba(0,0,0,0.06)",
            transition: "transform 0.2s, box-shadow 0.2s",
            ...(isSecret && {
                animation: "secretGlow 1.8s ease-in-out infinite",
                "@keyframes secretGlow": {
                    "0%, 100%": { boxShadow: "0 0 14px rgba(112,56,248,0.4)" },
                    "50%":      { boxShadow: "0 0 30px rgba(112,56,248,0.85)" },
                },
            }),
            "&:hover": { transform: "translateY(-5px)", boxShadow: isSecret ? "0 0 34px rgba(112,56,248,0.9)" : `0 12px 28px rgba(0,0,0,0.12)` },
        }}>
            <CardActionArea href={`/pokemon/${p.name}`} sx={{ height: "100%" }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 2.5, px: 2 }}>
                    <Box
                        component="img" src={art} alt={p.name} loading="lazy"
                        sx={{ width: 88, height: 88, objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}
                    />
                    <Typography variant="caption" sx={{ color: isSecret ? "#7038F8" : "#9ca3af", fontWeight: 700, letterSpacing: "0.12em" }}>
                        {isSecret ? "★ SECRET" : `#${String(p.id).padStart(4, "0")}`}
                    </Typography>
                    <Typography sx={{ color: "#111827", fontWeight: 700, textTransform: "capitalize", fontSize: "0.9rem", lineHeight: 1.2, textAlign: "center" }}>
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

/* ── Home Page ──────────────────────────────────────── */
export default function Home() {
    /* Paginated list */
    const [list,    setList]    = useState<Pokemon[]>([]);
    const [offset,  setOffset]  = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const busy = useRef(false);

    /* Search */
    const [query,      setQuery]      = useState("");
    const [allNames,   setAllNames]   = useState<{ name: string; url: string }[]>([]);
    const [results,    setResults]    = useState<Pokemon[]>([]);
    const [searching,  setSearching]  = useState(false);
    const [noResult,   setNoResult]   = useState(false);

    /* Type filter */
    const TYPES = Object.keys(TYPE_HEX);
    const [selectedType,    setSelectedType]    = useState<string | null>(null);
    const [typeMemberNames, setTypeMemberNames] = useState<{ name: string; url: string }[]>([]);
    const [typeList,        setTypeList]        = useState<Pokemon[]>([]);
    const [typeOffset,      setTypeOffset]      = useState(0);
    const [typeLoading,     setTypeLoading]     = useState(false);
    const [typeHasMore,     setTypeHasMore]     = useState(true);
    const typeBusy = useRef(false);

    /* Fetch all members of the selected type, then load the first batch */
    useEffect(() => {
        if (!selectedType) {
            setTypeMemberNames([]); setTypeList([]); setTypeOffset(0); setTypeHasMore(true);
            return;
        }
        let cancelled = false;
        typeBusy.current = false;
        setTypeList([]); setTypeOffset(0); setTypeHasMore(true); setTypeLoading(true);
        fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
            .then(r => r.json())
            .then(async (d) => {
                if (cancelled) return;
                const members: { name: string; url: string }[] = d.pokemon.map((p: any) => p.pokemon);
                setTypeMemberNames(members);
                typeBusy.current = true;
                const batch = members.slice(0, LIMIT);
                const details: Pokemon[] = await Promise.all(batch.map(m => fetch(m.url).then(r => r.json())));
                if (cancelled) return;
                setTypeList(details);
                setTypeOffset(LIMIT);
                setTypeHasMore(LIMIT < members.length);
            })
            .catch(console.error)
            .finally(() => { if (!cancelled) { setTypeLoading(false); typeBusy.current = false; } });
        return () => { cancelled = true; };
    }, [selectedType]);

    /* Load more within the selected type */
    const fetchTypeBatch = async (off: number) => {
        if (typeBusy.current) return;
        typeBusy.current = true;
        setTypeLoading(true);
        try {
            const batch = typeMemberNames.slice(off, off + LIMIT);
            const details: Pokemon[] = await Promise.all(batch.map(m => fetch(m.url).then(r => r.json())));
            setTypeList(prev => [...prev, ...details]);
            const newOffset = off + LIMIT;
            setTypeOffset(newOffset);
            setTypeHasMore(newOffset < typeMemberNames.length);
        } catch (e) { console.error(e); }
        finally { setTypeLoading(false); typeBusy.current = false; }
    };

    /* Fetch all names once (lightweight — just name+url, ~50KB) */
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL}`)
            .then(r => r.json())
            .then(d => setAllNames(d.results));
    }, []);

    /* Debounced search — filter client-side, then fetch matched details */
    useEffect(() => {
        if (!query.trim()) { setResults([]); setNoResult(false); return; }
        const timer = setTimeout(async () => {
            const q = query.toLowerCase().trim();

            /* 🥚 easter egg — bypasses PokeAPI entirely */
            if (q === "nergigante") {
                setNoResult(false);
                setResults([SECRET_NERGIGANTE]);
                return;
            }

            const pool = selectedType ? typeMemberNames : allNames;
            const matches = pool.filter(p => p.name.includes(q)).slice(0, LIMIT);
            if (!matches.length) { setResults([]); setNoResult(true); return; }
            setNoResult(false);
            setSearching(true);
            const details = await Promise.all(matches.map(m => fetch(m.url).then(r => r.json())));
            setResults(details);
            setSearching(false);
        }, 350);
        return () => clearTimeout(timer);
    }, [query, allNames, selectedType, typeMemberNames]);

    /* Paginated fetch */
    const fetchBatch = async (off: number) => {
        if (busy.current) return;
        busy.current = true;
        setLoading(true);
        try {
            const { results: raw } = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${off}`).then(r => r.json());
            const details: Pokemon[] = await Promise.all(raw.map((r: { url: string }) => fetch(r.url).then(r => r.json())));
            setList(prev => [...prev, ...details]);
            setOffset(off + LIMIT);
            setHasMore(off + LIMIT < TOTAL);
        } catch (e) { console.error(e); }
        finally { setLoading(false); busy.current = false; }
    };

    useEffect(() => { fetchBatch(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const isSearchMode = query.trim().length > 0;
    const isTypeMode   = !!selectedType && !isSearchMode;
    const displayList  = isSearchMode ? results : isTypeMode ? typeList : list;
    const isLoadingAny = loading || searching || typeLoading;
    const pct          = Math.min(Math.round((list.length / TOTAL) * 100), 100);

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: PAGE_BG }}>

            {/* ── Hero + Search ──────────────────────────────── */}
            <Box sx={{
                bgcolor: "#ffffff",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
                pt: { xs: 6, md: 10 }, pb: { xs: 5, md: 8 },
                px: 2, textAlign: "center",
            }}>
                <Typography variant="h2" sx={{
                    color: "#111827",
                    fontWeight: 900, letterSpacing: "-0.04em",
                    fontSize: { xs: "2.8rem", sm: "3.8rem", md: "5rem" },
                    mb: 0.5,
                }}>
                    Pokédex
                </Typography>
                <Typography sx={{ color: "#6b7280", fontSize: "1rem", mb: 4 }}>
                    All {TOTAL.toLocaleString()} Pokémon · Generation I – IX
                </Typography>

                {/* Search bar */}
                <Box sx={{ maxWidth: 540, mx: "auto", px: { xs: 0, sm: 2 } }}>
                    <TextField
                        fullWidth
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type search here..."
                        variant="outlined"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "#9ca3af" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: query ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            aria-label="clear search"
                                            onClick={() => setQuery("")}
                                        >
                                            <ClearIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                                        </IconButton>
                                    </InputAdornment>
                                ) : undefined,
                            },
                        }}
                        sx={{
                            bgcolor: "#f4f4f4",
                            borderRadius: 3,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 3,
                                height: 52,
                                fontSize: "1rem",
                                "& fieldset": { borderColor: "transparent" },
                                "&:hover fieldset": { borderColor: POKE_RED },
                                "&.Mui-focused fieldset": { borderColor: POKE_RED, borderWidth: 2 },
                            },
                        }}
                    />
                </Box>

                {/* Type filter chips */}
                <Box sx={{ maxWidth: 760, mx: "auto", mt: 3, px: { xs: 1, sm: 2 }, display: "flex", flexWrap: "wrap", gap: 0.75, justifyContent: "center" }}>
                    <Chip
                        label="All"
                        onClick={() => setSelectedType(null)}
                        sx={{
                            fontWeight: 700, cursor: "pointer",
                            bgcolor: !selectedType ? "#111827" : "transparent",
                            color:   !selectedType ? "#fff" : "#374151",
                            border: "1px solid rgba(0,0,0,0.15)",
                            "&:hover": { bgcolor: !selectedType ? "#111827" : "rgba(0,0,0,0.05)" },
                            transition: "all 0.15s",
                        }}
                    />
                    {TYPES.map(t => {
                        const active = selectedType === t;
                        const color  = TYPE_HEX[t];
                        return (
                            <Chip
                                key={t}
                                label={t}
                                onClick={() => setSelectedType(active ? null : t)}
                                sx={{
                                    fontWeight: 700, textTransform: "capitalize", cursor: "pointer",
                                    bgcolor: active ? color : `${color}18`,
                                    color:   active ? "#fff" : color,
                                    border: `1px solid ${color}55`,
                                    "&:hover": { bgcolor: active ? color : `${color}30` },
                                    transition: "all 0.15s",
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* Progress bar (browse mode only) */}
            {!isSearchMode && !isTypeMode && (
                <Box sx={{ maxWidth: 420, mx: "auto", mt: 3, mb: 1, px: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>{list.length} loaded</Typography>
                        <Typography variant="caption" sx={{ color: "#9ca3af" }}>{pct}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={pct} sx={{
                        height: 5, borderRadius: 4,
                        bgcolor: "rgba(0,0,0,0.08)",
                        "& .MuiLinearProgress-bar": { background: `linear-gradient(90deg, ${POKE_RED}, #FFDE00)`, borderRadius: 4 },
                    }} />
                </Box>
            )}

            {/* Search result count */}
            {isSearchMode && !searching && !noResult && results.length > 0 && (
                <Box sx={{ maxWidth: "xl", mx: "auto", px: 3, mt: 2 }}>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
                        {selectedType && <> in <Box component="span" sx={{ textTransform: "capitalize", fontWeight: 700, color: TYPE_HEX[selectedType] }}>{selectedType}</Box></>}
                    </Typography>
                </Box>
            )}

            {/* Type result count */}
            {isTypeMode && !typeLoading && typeList.length > 0 && (
                <Box sx={{ maxWidth: "xl", mx: "auto", px: 3, mt: 2 }}>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                        Showing {typeList.length} of {typeMemberNames.length}{" "}
                        <Box component="span" sx={{ textTransform: "capitalize", fontWeight: 700, color: TYPE_HEX[selectedType!] }}>{selectedType}</Box>-type Pokémon
                    </Typography>
                </Box>
            )}

            {/* ── Grid ───────────────────────────────────────── */}
            <Container maxWidth="xl" sx={{ py: 3, pb: 10 }}>

                {/* No results */}
                {noResult && (
                    <Box sx={{ textAlign: "center", py: 10 }}>
                        <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🔍</Typography>
                        <Typography sx={{ color: "#374151", fontWeight: 700, fontSize: "1.1rem" }}>
                            No Pokémon found for "{query}"
                        </Typography>
                        <Typography sx={{ color: "#9ca3af", mt: 0.5, fontSize: "0.9rem" }}>
                            Try a different name or check your spelling
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                    {displayList.map(p => (
                        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={p.id}>
                            <PokemonCard p={p} />
                        </Grid>
                    ))}
                    {isLoadingAny && Array.from({ length: LIMIT }).map((_, i) => (
                        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={`sk-${offset}-${typeOffset}-${i}`}>
                            <CardSkeleton />
                        </Grid>
                    ))}
                </Grid>

                {/* Load more — browse mode */}
                {!isSearchMode && !isTypeMode && hasMore && !loading && (
                    <Box sx={{ textAlign: "center", mt: 7 }}>
                        <Button variant="contained" size="large" onClick={() => fetchBatch(offset)}
                                sx={{
                                    borderRadius: 999, px: 5, py: 1.5,
                                    bgcolor: POKE_RED, color: "#fff", fontWeight: 800, fontSize: "0.95rem",
                                    boxShadow: "0 4px 20px rgba(204,0,0,0.28)",
                                    "&:hover": { bgcolor: "#aa0000", transform: "scale(1.03)" },
                                    transition: "all 0.2s",
                                }}>
                            Load More ({list.length} / {TOTAL})
                        </Button>
                    </Box>
                )}

                {!isSearchMode && !isTypeMode && !hasMore && list.length > 0 && (
                    <Box sx={{ textAlign: "center", mt: 7 }}>
                        <Typography sx={{ color: "#9ca3af", fontSize: "1rem" }}>
                            🎉 All {TOTAL.toLocaleString()} Pokémon loaded!
                        </Typography>
                    </Box>
                )}

                {/* Load more — type mode */}
                {isTypeMode && typeHasMore && !typeLoading && (
                    <Box sx={{ textAlign: "center", mt: 7 }}>
                        <Button variant="contained" size="large" onClick={() => fetchTypeBatch(typeOffset)}
                                sx={{
                                    borderRadius: 999, px: 5, py: 1.5,
                                    bgcolor: TYPE_HEX[selectedType!], color: "#fff", fontWeight: 800, fontSize: "0.95rem",
                                    boxShadow: `0 4px 20px ${TYPE_HEX[selectedType!]}55`,
                                    "&:hover": { filter: "brightness(0.92)", transform: "scale(1.03)" },
                                    transition: "all 0.2s",
                                }}>
                            Load More ({typeList.length} / {typeMemberNames.length})
                        </Button>
                    </Box>
                )}

                {isTypeMode && !typeHasMore && typeList.length > 0 && (
                    <Box sx={{ textAlign: "center", mt: 7 }}>
                        <Typography sx={{ color: "#9ca3af", fontSize: "1rem" }}>
                            🎉 All {typeMemberNames.length} <Box component="span" sx={{ textTransform: "capitalize" }}>{selectedType}</Box>-type Pokémon loaded!
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}