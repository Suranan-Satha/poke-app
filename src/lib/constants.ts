

export const TYPE_HEX: Record<string, string> = {
    normal:   "#A8A878", fire:     "#F08030", water:    "#6890F0",
    electric: "#F8D030", grass:    "#78C850", ice:      "#98D8D8",
    fighting: "#C03028", poison:   "#A040A0", ground:   "#E0C068",
    flying:   "#A890F0", psychic:  "#F85888", bug:      "#A8B820",
    rock:     "#B8A038", ghost:    "#705898", dragon:   "#7038F8",
    dark:     "#705848", steel:    "#B8B8D0", fairy:    "#EE99AC",
};

export const STAT_META: Record<string, { label: string; color: string }> = {
    hp:               { label: "HP",      color: "#FF5959" },
    attack:           { label: "ATK",     color: "#F5AC78" },
    defense:          { label: "DEF",     color: "#FAE078" },
    "special-attack": { label: "Sp.ATK", color: "#9DB7F5" },
    "special-defense":{ label: "Sp.DEF", color: "#A7DB8D" },
    speed:            { label: "SPD",     color: "#FA92B2" },
};

export const LIMIT = 24;
export const TOTAL = 1351;

/** New deep-space navy background — replaces the purple gradient */
export const PAGE_BG = "linear-gradient(160deg, #06080f 0%, #0d1220 45%, #06080f 100%)";