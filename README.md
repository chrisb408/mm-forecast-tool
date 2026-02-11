# Sales Forecast Tool

A real-time collaborative sales forecasting application built with Next.js and Supabase.

## Features

- **Manager View**: Team-wide dashboard showing rollup metrics for all reps
- **Individual Rep Views**: Each rep can manage their own deal pipeline
- **Real-time Updates**: Changes sync instantly across all users
- **Automatic Calculations**:
  - Days in stage
  - Age-based probability adjustments
  - Weighted pipeline values
  - Forecast categories (Best Case, Commit, Conservative)
- **No Authentication Required**: Simple rep selection dropdown

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to **Settings > API** and copy:
   - Project URL
   - Anon/Public key

### 2. Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this repository
3. Paste and run the SQL to create:
   - Tables: `reps`, `deals`, `closed_deals`
   - Database view: `rep_summary`
   - Row Level Security policies
4. Go to **Database > Replication** and enable replication for:
   - `reps`
   - `deals`
   - `closed_deals`

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
mm-forecast-tool/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Manager view
│   ├── rep/[repId]/page.tsx    # Rep view
│   └── globals.css
├── components/
│   ├── manager/                # Manager view components
│   ├── rep/                    # Rep view components
│   └── shared/                 # Shared components
├── lib/
│   ├── supabase/               # Supabase clients
│   ├── hooks/                  # React hooks
│   ├── utils/                  # Utilities
│   └── types.ts                # TypeScript types
└── supabase-schema.sql         # Database schema
```

## Usage

### Manager View

- View aggregated metrics for all reps
- See team totals (quota, closed-won, forecasts)
- Click on any rep name to navigate to their individual view

### Rep View

- Add new deals with the "Add Deal" button
- View all deals with calculated fields:
  - Days in stage
  - Age adjustment (1.0 for 0-60 days, 0.6 for 61-90 days, 0.5 for 90+ days)
  - Stage probability (Stage 2: 57%, Stage 3: 78%, Stage 4: 88%, Stage 5: 96%)
  - Weighted value (ACV × Stage Prob × Age Adj)
- Edit or delete deals
- Mark deals as "Closed-Won" to move them to closed deals tracking

### Real-time Updates

Open the app in multiple browser windows or tabs. When you make a change in one window (e.g., add a deal), all other windows update instantly.

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

Your app will be live at `https://your-project.vercel.app`

## Formula Reference

All calculations match the original Excel spreadsheet:

| Calculation | Formula |
|------------|---------|
| Days in Stage | `TODAY - S2 Date` |
| Age Adjustment | `1.0` (0-60d), `0.6` (61-90d), `0.5` (90+d) |
| Stage Probability | Stage 2: `0.57`, Stage 3: `0.78`, Stage 4: `0.88`, Stage 5: `0.96` |
| Adjusted Probability | `Stage Prob × Age Adjustment` |
| Weighted Value | `ACV × Adjusted Probability` |
| Best Case | `Closed-Won + All deals (stage ≥ 2)` |
| Commit | `Closed-Won + Stage 4-5 deals` |
| Conservative | `Closed-Won + Stage 5 only` |

## Support

For issues or questions, please open an issue on GitHub.
