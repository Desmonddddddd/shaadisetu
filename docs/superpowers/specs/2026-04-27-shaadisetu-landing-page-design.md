# ShaadiSetu — Landing Page & Blog Design Spec

## Overview
ShaadiSetu is an Indian wedding solutions platform. This spec covers the initial landing page and blog tab — a frontend-only Next.js app with no backend, focused on clean UI, red gradient theming, and rich placeholder content.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **City Search:** Client-side searchable combobox (no external library — custom component)
- **Deployment:** Local dev only for now

## Color Palette
- Primary gradient: `#DC2626` (red-600) → `#F43F5E` (rose-500) → `#FB7185` (rose-400)
- Background: White (`#FFFFFF`) + warm gray (`#F9FAFB`, `#F3F4F6`)
- Text: Slate-900 (`#0F172A`) for headings, Slate-600 (`#475569`) for body
- Accent: Rose-100 (`#FFE4E6`) for subtle highlights
- Card borders/shadows: Soft warm grays

## Page Structure

### 1. Navbar (sticky, all pages)
- Logo: "ShaadiSetu" in red gradient text (bold, decorative feel)
- City dropdown: searchable combobox with 500+ Indian cities, grouped by state
- Navigation tabs: Home | Blog
- CTA button: "List Your Business" (red gradient background)

### 2. Hero Section (Home)
- Full-width red-to-rose gradient background
- Headline: "Your Perfect Wedding, One Click Away"
- Subtext: "Discover the best wedding vendors, venues, and services across India"
- Inline search: city selector + category dropdown + search button
- Subtle decorative elements (CSS patterns, no images)

### 3. Wedding Categories Grid (Home)
- 12 category cards in a responsive grid (4 cols desktop, 2 cols mobile)
- Categories: Bridal Wear, Groom Wear, Venues, Catering, Mehendi Artists, Photography, Makeup Artists, Decorators, Wedding Invitations, Music & DJ, Wedding Pandits, Jewellery
- Each card: placeholder icon (emoji or CSS), category name, short description
- Hover effect: lift + shadow + red accent border

### 4. How It Works (Home)
- 3-step horizontal flow (vertical on mobile)
- Steps: Choose Your City → Browse Categories → Connect with Vendors
- Numbered circles with red gradient, connecting lines
- Brief description under each step

### 5. Popular Cities (Home)
- Pill/chip layout showing 20+ popular wedding cities
- Cities: Delhi, Mumbai, Jaipur, Lucknow, Udaipur, Kolkata, Chennai, Hyderabad, Bangalore, Pune, Chandigarh, Goa, Ahmedabad, Jodhpur, Agra, Varanasi, Indore, Bhopal, Kochi, Coimbatore
- Clickable pills (set city selection on click)

### 6. Footer (all pages)
- 4-column layout: About, Categories, Cities, Contact
- Social media placeholder links
- Copyright: "2026 ShaadiSetu. All rights reserved."
- Red gradient top border

### 7. Blog Page (`/blog`)
- Hero: "Wedding Diaries" with rose gradient background
- Filter chips: All, Big Fat Weddings, Trending, Bridal Tips, Venue Ideas, Real Weddings
- Blog card grid (3 cols desktop, 1 col mobile)
- Each card: placeholder image area (gray box), title, excerpt (2-3 lines), date, category tag
- 8 pre-written placeholder blog articles with realistic Indian wedding content

## City Dropdown Component
- Custom searchable combobox (no external dependency)
- 500+ Indian cities covering all states/UTs
- Fuzzy text search: typing "Ban" shows Bangalore, Banswara, Banda, etc.
- Grouped by state in the dropdown list
- Persists selection via React state (no backend)
- Mobile-friendly: full-width overlay on small screens

## Blog Placeholder Content
8 articles with titles, excerpts, dates, and categories:
1. "Inside the 500 Crore Ambani-Style Wedding That Broke the Internet" — Big Fat Weddings
2. "Pastel Lehengas Are Out: What Brides Are Choosing in 2026" — Trending
3. "10 Palace Venues in Rajasthan That Will Make Your Wedding Royal" — Venue Ideas
4. "Real Wedding: Priya & Arjun's Intimate Ceremony in Udaipur" — Real Weddings
5. "The Ultimate Bridal Mehendi Guide: 50+ Designs That Are Trending" — Bridal Tips
6. "Why Destination Weddings in Goa Are Surging This Season" — Trending
7. "From Haldi to Vidaai: A Complete Guide to North Indian Wedding Rituals" — Bridal Tips
8. "Budget vs Luxury: What Indian Couples Are Really Spending on Weddings" — Big Fat Weddings

## Responsive Behavior
- Mobile-first Tailwind approach
- Navbar collapses to hamburger menu on mobile
- Category grid: 1 col (mobile) → 2 cols (tablet) → 4 cols (desktop)
- Blog grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- City dropdown becomes full-screen overlay on mobile

## Out of Scope
- Backend API / database
- Real images (all placeholders)
- User authentication
- Vendor listing/detail pages
- Payment or booking flows
- SEO meta tags (will add later)
