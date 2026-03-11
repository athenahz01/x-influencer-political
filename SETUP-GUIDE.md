# Political Network Explorer — Setup Guide

## Quick Start (5 min)

### Step 1: Unzip & Open in Cursor

1. Unzip `political-network-explorer.zip` to your projects folder
2. Open Cursor → File → Open Folder → select `political-network-explorer`

### Step 2: Install Dependencies

Open terminal in Cursor (Ctrl+` or Cmd+`):

```bash
npm install
```

### Step 3: Run Dev Server

```bash
npm run dev
```

Open **http://localhost:3000** — you should see the explorer!

---

## Project Structure

```
political-network-explorer/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page (renders AppShell)
│   └── globals.css         # Global styles + Tailwind
│
├── components/
│   ├── layout/
│   │   └── AppShell.tsx    # Main orchestrator
│   ├── sidebar/
│   │   ├── Sidebar.tsx     # Left sidebar container
│   │   ├── SearchBox.tsx   # Search input
│   │   ├── RankModeSelect.tsx # Dropdown for rank modes
│   │   ├── RankedList.tsx  # Scrollable ranked list
│   │   └── RankedListItem.tsx # Individual list item
│   ├── graph/
│   │   ├── GraphCanvas.tsx # 3D force graph (Three.js)
│   │   └── GraphControls.tsx # Zoom/reset buttons
│   ├── panel/
│   │   └── ProfileCard.tsx # Right-side detail card
│   ├── filters/
│   │   └── LegendPanel.tsx # Category legend with toggles
│   └── modals/
│       └── MethodologyModal.tsx # Full methodology popup
│
├── data/
│   └── accounts.ts         # ~300 political accounts + edge generation
│
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── scoring.ts          # Score weights & explanation gen
│   ├── format.ts           # Number/score formatters
│   └── categories.ts       # Category definitions & colors
│
├── store/
│   └── useExplorerStore.ts # Zustand global state
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── .gitignore
```

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (state management)
- **3d-force-graph** + **Three.js** (3D visualization)
- **Framer Motion** (animations, available for future use)

## Architecture Notes

- Graph data is built client-side from `data/accounts.ts` using the scoring formula from the dev spec (Section 11.7)
- The 6-factor weighted score: Network (27%), Audience (23%), Elite Signal (18%), Relevance (17%), Freshness (10%), Bridge (5%)
- Edges are generated based on ideological lean proximity — nodes with similar political leanings cluster together
- All state flows through Zustand store — sidebar search, rank mode, category filters, selected node
- The 3D graph is dynamically imported (client-only) since Three.js doesn't work server-side

## Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repo to Vercel for auto-deploy.

## Next Steps

After this scaffold is running, we can:
1. Add real X API data ingestion
2. Set up Supabase for snapshot storage
3. Build admin review dashboard
4. Add topic clusters & ideology filters
5. Deploy to production
