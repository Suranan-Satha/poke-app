# PokéDex

A full-featured Pokédex web app built with **Next.js 15**, **Material UI v6**, and the **PokéAPI** — browse all 1,351 Pokémon with real-time search, type filtering, detailed stat pages, evolution chains, and cry sounds.

🔗 **Live demo:** [poke-app-neon.vercel.app](https://poke-app-neon.vercel.app/)

---

## 👤 Developer

| | |
|---|---|
| **Name** | Suranan Satha |
| **Student ID** | 673450204-9 |
| **Course** | Front-end Web Programming (IN403101) |
| **Curriculum** | Computer Science |
| **Faculty** | Interdisciplinary Studies |
| **University** | Khon Kaen University |
| **Email** | suranan.s@kkumail.com |

---

## 📸 Screenshots

<!-- แคปหน้าจอเว็บที่รันจริงแล้วใส่ในโฟลเดอร์ /src/picture (ตามที่มีอยู่แล้วในโปรเจกต์) -->

| Home | Pokémon Detail | About |
|---|---|---|
| ![Home](./src/picture/home.png) | ![Detail](./src/picture/detail.png) | ![About](./src/picture/about.png) |

---

## ✨ Features

- **Paginated fetching** — loads 24 Pokémon per request (`limit`/`offset`) instead of pulling all 1,351 at once, with a "Load More" button to continue
- **Real-time search** — debounced client-side search across all Pokémon names
- **Type filter** — filter the grid by any of the 18 Pokémon types, combinable with search
- **Detail page** — name, official artwork with a mouse-reactive 3D tilt/parallax effect, base stats (animated bars + total), full evolution chain, type chips, and an official cry sound player
- **Loading skeletons** — [MUI Skeleton](https://mui.com/material-ui/react-skeleton/) components on every screen that fetches data, so the layout never jumps around while loading
- **About page** — developer info, tech stack, and a link back to this repository
- **Responsive design** — built with MUI's Grid breakpoint system (`xs`/`sm`/`md`/`lg`), works from mobile to desktop

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI v6](https://mui.com/)
- [PokéAPI](https://pokeapi.co/)
- [Vercel](https://vercel.com/) (deployment)

## 📂 Project Structure

```
src/
 ├─ app/
 │   ├─ page.tsx                  # Home — paginated grid, search, type filter
 │   ├─ about/page.tsx            # About this project
 │   ├─ pokemon/[pokemonname]/    # Pokémon detail page
 │   └─ layout.tsx                # Root layout, navbar, theme
 ├─ components/
 │   └─ Navbar.tsx
 ├─ lib/
 │   └─ constants.ts              # Type colors, stat metadata, shared constants
 └─ picture/                      # Screenshots used in this README
```

## 📄 Credits

Data provided by [PokéAPI](https://pokeapi.co).
Pokémon © Nintendo / Game Freak / Creatures Inc. This is a non-commercial student project made for educational purposes only.