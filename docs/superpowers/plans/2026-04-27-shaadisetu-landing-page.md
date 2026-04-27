# ShaadiSetu Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visually appealing Next.js landing page for ShaadiSetu — an Indian wedding solutions platform — with red gradient theming, searchable city dropdown (500+ cities), wedding category grid, and a blog tab with placeholder content.

**Architecture:** Next.js 15 App Router with Tailwind CSS 4 for styling. All data is static (no backend). City data lives in a TypeScript constant file. A shared layout wraps all pages with Navbar + Footer. The city selection is managed via React Context so it persists across pages.

**Tech Stack:** Next.js 15, Tailwind CSS 4, TypeScript

---

## File Structure

```
shaadisetu/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout: CityProvider + Navbar + Footer
│   │   ├── page.tsx            # Home page: Hero + Categories + HowItWorks + PopularCities
│   │   ├── globals.css         # Tailwind imports + custom gradient utilities
│   │   └── blog/
│   │       └── page.tsx        # Blog page: BlogHero + filters + BlogCard grid
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky navbar: logo, city dropdown, nav links, CTA
│   │   ├── MobileMenu.tsx      # Hamburger slide-out menu for mobile
│   │   ├── CitySearch.tsx      # Searchable city combobox dropdown
│   │   ├── HeroSection.tsx     # Full-width gradient hero with inline search
│   │   ├── CategoryCard.tsx    # Single category card component
│   │   ├── CategoriesGrid.tsx  # Grid of 12 CategoryCards
│   │   ├── HowItWorks.tsx      # 3-step flow section
│   │   ├── PopularCities.tsx   # City pill/chip section
│   │   ├── Footer.tsx          # 4-column footer
│   │   ├── BlogHero.tsx        # Blog page hero banner
│   │   └── BlogCard.tsx        # Single blog card component
│   ├── data/
│   │   ├── cities.ts           # 500+ Indian cities grouped by state
│   │   ├── categories.ts       # 12 wedding category definitions
│   │   └── blogs.ts            # 8 placeholder blog articles
│   └── context/
│       └── CityContext.tsx     # React Context for selected city
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts          # (only if Tailwind 4 needs config beyond CSS)
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Initialize Next.js project**

Run:
```bash
cd ~/Desktop/shaadisetu
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --turbopack
```

Select defaults when prompted. This scaffolds the full project with Tailwind CSS 4 and App Router.

- [ ] **Step 2: Verify it runs**

Run:
```bash
cd ~/Desktop/shaadisetu && npm run dev
```

Open `http://localhost:3000` — should show the default Next.js page.

- [ ] **Step 3: Replace `src/app/globals.css` with custom theme**

Replace the entire file with:

```css
@import "tailwindcss";

@theme {
  --color-shaadi-red: #DC2626;
  --color-shaadi-rose: #F43F5E;
  --color-shaadi-pink: #FB7185;
  --color-shaadi-light: #FFE4E6;
  --color-shaadi-warm-gray: #F9FAFB;
  --color-shaadi-warm-gray-dark: #F3F4F6;
}
```

- [ ] **Step 4: Replace `src/app/layout.tsx` with minimal shell**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShaadiSetu — Your Perfect Wedding, One Click Away",
  description: "Discover the best wedding vendors, venues, and services across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-[family-name:var(--font-geist)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Replace `src/app/page.tsx` with placeholder**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
        ShaadiSetu
      </h1>
    </main>
  );
}
```

- [ ] **Step 6: Verify gradient text renders**

Run `npm run dev`, visit `http://localhost:3000`. Should see "ShaadiSetu" in red gradient text.

- [ ] **Step 7: Commit**

```bash
cd ~/Desktop/shaadisetu
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind CSS and red gradient theme"
```

---

### Task 2: City Data File

**Files:**
- Create: `src/data/cities.ts`

- [ ] **Step 1: Create `src/data/cities.ts`**

This file exports a flat array of city objects and a grouped-by-state structure. Include 500+ real Indian cities covering all 28 states and 8 UTs. Here is the structure and a representative sample — the full file must contain ALL cities listed below:

```ts
export interface City {
  name: string;
  state: string;
}

export const cities: City[] = [
  // Andhra Pradesh
  { name: "Visakhapatnam", state: "Andhra Pradesh" },
  { name: "Vijayawada", state: "Andhra Pradesh" },
  { name: "Guntur", state: "Andhra Pradesh" },
  { name: "Nellore", state: "Andhra Pradesh" },
  { name: "Kurnool", state: "Andhra Pradesh" },
  { name: "Rajahmundry", state: "Andhra Pradesh" },
  { name: "Tirupati", state: "Andhra Pradesh" },
  { name: "Kakinada", state: "Andhra Pradesh" },
  { name: "Kadapa", state: "Andhra Pradesh" },
  { name: "Anantapur", state: "Andhra Pradesh" },
  { name: "Eluru", state: "Andhra Pradesh" },
  { name: "Ongole", state: "Andhra Pradesh" },
  { name: "Srikakulam", state: "Andhra Pradesh" },
  { name: "Machilipatnam", state: "Andhra Pradesh" },
  { name: "Tenali", state: "Andhra Pradesh" },
  { name: "Proddatur", state: "Andhra Pradesh" },
  { name: "Chittoor", state: "Andhra Pradesh" },
  // Arunachal Pradesh
  { name: "Itanagar", state: "Arunachal Pradesh" },
  { name: "Naharlagun", state: "Arunachal Pradesh" },
  { name: "Pasighat", state: "Arunachal Pradesh" },
  { name: "Tawang", state: "Arunachal Pradesh" },
  // Assam
  { name: "Guwahati", state: "Assam" },
  { name: "Silchar", state: "Assam" },
  { name: "Dibrugarh", state: "Assam" },
  { name: "Jorhat", state: "Assam" },
  { name: "Nagaon", state: "Assam" },
  { name: "Tinsukia", state: "Assam" },
  { name: "Tezpur", state: "Assam" },
  { name: "Bongaigaon", state: "Assam" },
  // Bihar
  { name: "Patna", state: "Bihar" },
  { name: "Gaya", state: "Bihar" },
  { name: "Bhagalpur", state: "Bihar" },
  { name: "Muzaffarpur", state: "Bihar" },
  { name: "Darbhanga", state: "Bihar" },
  { name: "Purnia", state: "Bihar" },
  { name: "Ara", state: "Bihar" },
  { name: "Begusarai", state: "Bihar" },
  { name: "Katihar", state: "Bihar" },
  { name: "Munger", state: "Bihar" },
  { name: "Chapra", state: "Bihar" },
  { name: "Sasaram", state: "Bihar" },
  // Chhattisgarh
  { name: "Raipur", state: "Chhattisgarh" },
  { name: "Bhilai", state: "Chhattisgarh" },
  { name: "Bilaspur", state: "Chhattisgarh" },
  { name: "Korba", state: "Chhattisgarh" },
  { name: "Durg", state: "Chhattisgarh" },
  { name: "Rajnandgaon", state: "Chhattisgarh" },
  { name: "Raigarh", state: "Chhattisgarh" },
  { name: "Jagdalpur", state: "Chhattisgarh" },
  { name: "Ambikapur", state: "Chhattisgarh" },
  // Goa
  { name: "Panaji", state: "Goa" },
  { name: "Margao", state: "Goa" },
  { name: "Vasco da Gama", state: "Goa" },
  { name: "Mapusa", state: "Goa" },
  { name: "Ponda", state: "Goa" },
  // Gujarat
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Surat", state: "Gujarat" },
  { name: "Vadodara", state: "Gujarat" },
  { name: "Rajkot", state: "Gujarat" },
  { name: "Bhavnagar", state: "Gujarat" },
  { name: "Jamnagar", state: "Gujarat" },
  { name: "Junagadh", state: "Gujarat" },
  { name: "Gandhinagar", state: "Gujarat" },
  { name: "Anand", state: "Gujarat" },
  { name: "Nadiad", state: "Gujarat" },
  { name: "Morbi", state: "Gujarat" },
  { name: "Mehsana", state: "Gujarat" },
  { name: "Bharuch", state: "Gujarat" },
  { name: "Navsari", state: "Gujarat" },
  { name: "Valsad", state: "Gujarat" },
  { name: "Porbandar", state: "Gujarat" },
  { name: "Godhra", state: "Gujarat" },
  { name: "Veraval", state: "Gujarat" },
  { name: "Patan", state: "Gujarat" },
  { name: "Surendranagar", state: "Gujarat" },
  // Haryana
  { name: "Faridabad", state: "Haryana" },
  { name: "Gurgaon", state: "Haryana" },
  { name: "Panipat", state: "Haryana" },
  { name: "Ambala", state: "Haryana" },
  { name: "Yamunanagar", state: "Haryana" },
  { name: "Rohtak", state: "Haryana" },
  { name: "Hisar", state: "Haryana" },
  { name: "Karnal", state: "Haryana" },
  { name: "Sonipat", state: "Haryana" },
  { name: "Panchkula", state: "Haryana" },
  { name: "Bhiwani", state: "Haryana" },
  { name: "Sirsa", state: "Haryana" },
  { name: "Kurukshetra", state: "Haryana" },
  { name: "Rewari", state: "Haryana" },
  { name: "Jind", state: "Haryana" },
  // Himachal Pradesh
  { name: "Shimla", state: "Himachal Pradesh" },
  { name: "Manali", state: "Himachal Pradesh" },
  { name: "Dharamshala", state: "Himachal Pradesh" },
  { name: "Solan", state: "Himachal Pradesh" },
  { name: "Mandi", state: "Himachal Pradesh" },
  { name: "Kullu", state: "Himachal Pradesh" },
  { name: "Bilaspur", state: "Himachal Pradesh" },
  { name: "Hamirpur", state: "Himachal Pradesh" },
  { name: "Una", state: "Himachal Pradesh" },
  // Jharkhand
  { name: "Ranchi", state: "Jharkhand" },
  { name: "Jamshedpur", state: "Jharkhand" },
  { name: "Dhanbad", state: "Jharkhand" },
  { name: "Bokaro", state: "Jharkhand" },
  { name: "Deoghar", state: "Jharkhand" },
  { name: "Hazaribagh", state: "Jharkhand" },
  { name: "Giridih", state: "Jharkhand" },
  { name: "Ramgarh", state: "Jharkhand" },
  // Karnataka
  { name: "Bangalore", state: "Karnataka" },
  { name: "Mysore", state: "Karnataka" },
  { name: "Hubli", state: "Karnataka" },
  { name: "Mangalore", state: "Karnataka" },
  { name: "Belgaum", state: "Karnataka" },
  { name: "Gulbarga", state: "Karnataka" },
  { name: "Davangere", state: "Karnataka" },
  { name: "Bellary", state: "Karnataka" },
  { name: "Shimoga", state: "Karnataka" },
  { name: "Tumkur", state: "Karnataka" },
  { name: "Raichur", state: "Karnataka" },
  { name: "Bijapur", state: "Karnataka" },
  { name: "Udupi", state: "Karnataka" },
  { name: "Hassan", state: "Karnataka" },
  { name: "Chitradurga", state: "Karnataka" },
  // Kerala
  { name: "Thiruvananthapuram", state: "Kerala" },
  { name: "Kochi", state: "Kerala" },
  { name: "Kozhikode", state: "Kerala" },
  { name: "Thrissur", state: "Kerala" },
  { name: "Kollam", state: "Kerala" },
  { name: "Kannur", state: "Kerala" },
  { name: "Alappuzha", state: "Kerala" },
  { name: "Palakkad", state: "Kerala" },
  { name: "Kottayam", state: "Kerala" },
  { name: "Malappuram", state: "Kerala" },
  // Madhya Pradesh
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Jabalpur", state: "Madhya Pradesh" },
  { name: "Gwalior", state: "Madhya Pradesh" },
  { name: "Ujjain", state: "Madhya Pradesh" },
  { name: "Sagar", state: "Madhya Pradesh" },
  { name: "Dewas", state: "Madhya Pradesh" },
  { name: "Satna", state: "Madhya Pradesh" },
  { name: "Ratlam", state: "Madhya Pradesh" },
  { name: "Rewa", state: "Madhya Pradesh" },
  { name: "Murwara", state: "Madhya Pradesh" },
  { name: "Singrauli", state: "Madhya Pradesh" },
  { name: "Chhindwara", state: "Madhya Pradesh" },
  { name: "Burhanpur", state: "Madhya Pradesh" },
  { name: "Khandwa", state: "Madhya Pradesh" },
  { name: "Bhind", state: "Madhya Pradesh" },
  { name: "Morena", state: "Madhya Pradesh" },
  { name: "Mandsaur", state: "Madhya Pradesh" },
  { name: "Vidisha", state: "Madhya Pradesh" },
  { name: "Damoh", state: "Madhya Pradesh" },
  // Maharashtra
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Nagpur", state: "Maharashtra" },
  { name: "Thane", state: "Maharashtra" },
  { name: "Nashik", state: "Maharashtra" },
  { name: "Aurangabad", state: "Maharashtra" },
  { name: "Solapur", state: "Maharashtra" },
  { name: "Kolhapur", state: "Maharashtra" },
  { name: "Amravati", state: "Maharashtra" },
  { name: "Navi Mumbai", state: "Maharashtra" },
  { name: "Sangli", state: "Maharashtra" },
  { name: "Malegaon", state: "Maharashtra" },
  { name: "Jalgaon", state: "Maharashtra" },
  { name: "Akola", state: "Maharashtra" },
  { name: "Latur", state: "Maharashtra" },
  { name: "Dhule", state: "Maharashtra" },
  { name: "Ahmednagar", state: "Maharashtra" },
  { name: "Chandrapur", state: "Maharashtra" },
  { name: "Parbhani", state: "Maharashtra" },
  { name: "Satara", state: "Maharashtra" },
  // Manipur
  { name: "Imphal", state: "Manipur" },
  { name: "Thoubal", state: "Manipur" },
  { name: "Bishnupur", state: "Manipur" },
  // Meghalaya
  { name: "Shillong", state: "Meghalaya" },
  { name: "Tura", state: "Meghalaya" },
  { name: "Jowai", state: "Meghalaya" },
  // Mizoram
  { name: "Aizawl", state: "Mizoram" },
  { name: "Lunglei", state: "Mizoram" },
  // Nagaland
  { name: "Kohima", state: "Nagaland" },
  { name: "Dimapur", state: "Nagaland" },
  { name: "Mokokchung", state: "Nagaland" },
  // Odisha
  { name: "Bhubaneswar", state: "Odisha" },
  { name: "Cuttack", state: "Odisha" },
  { name: "Rourkela", state: "Odisha" },
  { name: "Brahmapur", state: "Odisha" },
  { name: "Sambalpur", state: "Odisha" },
  { name: "Puri", state: "Odisha" },
  { name: "Balasore", state: "Odisha" },
  { name: "Bhadrak", state: "Odisha" },
  { name: "Baripada", state: "Odisha" },
  // Punjab
  { name: "Ludhiana", state: "Punjab" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Jalandhar", state: "Punjab" },
  { name: "Patiala", state: "Punjab" },
  { name: "Bathinda", state: "Punjab" },
  { name: "Mohali", state: "Punjab" },
  { name: "Pathankot", state: "Punjab" },
  { name: "Hoshiarpur", state: "Punjab" },
  { name: "Moga", state: "Punjab" },
  { name: "Batala", state: "Punjab" },
  { name: "Abohar", state: "Punjab" },
  { name: "Firozpur", state: "Punjab" },
  // Rajasthan
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Kota", state: "Rajasthan" },
  { name: "Ajmer", state: "Rajasthan" },
  { name: "Bikaner", state: "Rajasthan" },
  { name: "Bhilwara", state: "Rajasthan" },
  { name: "Alwar", state: "Rajasthan" },
  { name: "Sikar", state: "Rajasthan" },
  { name: "Bharatpur", state: "Rajasthan" },
  { name: "Pali", state: "Rajasthan" },
  { name: "Sri Ganganagar", state: "Rajasthan" },
  { name: "Tonk", state: "Rajasthan" },
  { name: "Kishangarh", state: "Rajasthan" },
  { name: "Beawar", state: "Rajasthan" },
  { name: "Hanumangarh", state: "Rajasthan" },
  { name: "Banswara", state: "Rajasthan" },
  { name: "Barmer", state: "Rajasthan" },
  { name: "Jaisalmer", state: "Rajasthan" },
  { name: "Churu", state: "Rajasthan" },
  { name: "Jhunjhunu", state: "Rajasthan" },
  { name: "Nagaur", state: "Rajasthan" },
  { name: "Chittorgarh", state: "Rajasthan" },
  { name: "Bundi", state: "Rajasthan" },
  { name: "Sawai Madhopur", state: "Rajasthan" },
  // Sikkim
  { name: "Gangtok", state: "Sikkim" },
  { name: "Namchi", state: "Sikkim" },
  // Tamil Nadu
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Madurai", state: "Tamil Nadu" },
  { name: "Tiruchirappalli", state: "Tamil Nadu" },
  { name: "Salem", state: "Tamil Nadu" },
  { name: "Tirunelveli", state: "Tamil Nadu" },
  { name: "Tiruppur", state: "Tamil Nadu" },
  { name: "Erode", state: "Tamil Nadu" },
  { name: "Vellore", state: "Tamil Nadu" },
  { name: "Thoothukudi", state: "Tamil Nadu" },
  { name: "Thanjavur", state: "Tamil Nadu" },
  { name: "Dindigul", state: "Tamil Nadu" },
  { name: "Nagercoil", state: "Tamil Nadu" },
  { name: "Kanchipuram", state: "Tamil Nadu" },
  { name: "Hosur", state: "Tamil Nadu" },
  // Telangana
  { name: "Hyderabad", state: "Telangana" },
  { name: "Warangal", state: "Telangana" },
  { name: "Nizamabad", state: "Telangana" },
  { name: "Karimnagar", state: "Telangana" },
  { name: "Khammam", state: "Telangana" },
  { name: "Mahbubnagar", state: "Telangana" },
  { name: "Nalgonda", state: "Telangana" },
  { name: "Adilabad", state: "Telangana" },
  { name: "Suryapet", state: "Telangana" },
  { name: "Siddipet", state: "Telangana" },
  // Tripura
  { name: "Agartala", state: "Tripura" },
  { name: "Udaipur", state: "Tripura" },
  // Uttar Pradesh
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Kanpur", state: "Uttar Pradesh" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Meerut", state: "Uttar Pradesh" },
  { name: "Allahabad", state: "Uttar Pradesh" },
  { name: "Bareilly", state: "Uttar Pradesh" },
  { name: "Aligarh", state: "Uttar Pradesh" },
  { name: "Moradabad", state: "Uttar Pradesh" },
  { name: "Saharanpur", state: "Uttar Pradesh" },
  { name: "Gorakhpur", state: "Uttar Pradesh" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Firozabad", state: "Uttar Pradesh" },
  { name: "Jhansi", state: "Uttar Pradesh" },
  { name: "Muzaffarnagar", state: "Uttar Pradesh" },
  { name: "Mathura", state: "Uttar Pradesh" },
  { name: "Budaun", state: "Uttar Pradesh" },
  { name: "Rampur", state: "Uttar Pradesh" },
  { name: "Shahjahanpur", state: "Uttar Pradesh" },
  { name: "Farrukhabad", state: "Uttar Pradesh" },
  { name: "Mau", state: "Uttar Pradesh" },
  { name: "Hapur", state: "Uttar Pradesh" },
  { name: "Etawah", state: "Uttar Pradesh" },
  { name: "Mirzapur", state: "Uttar Pradesh" },
  { name: "Bulandshahr", state: "Uttar Pradesh" },
  { name: "Sambhal", state: "Uttar Pradesh" },
  { name: "Amroha", state: "Uttar Pradesh" },
  { name: "Hardoi", state: "Uttar Pradesh" },
  { name: "Fatehpur", state: "Uttar Pradesh" },
  { name: "Raebareli", state: "Uttar Pradesh" },
  { name: "Orai", state: "Uttar Pradesh" },
  { name: "Sitapur", state: "Uttar Pradesh" },
  { name: "Bahraich", state: "Uttar Pradesh" },
  { name: "Banda", state: "Uttar Pradesh" },
  { name: "Unnao", state: "Uttar Pradesh" },
  { name: "Sultanpur", state: "Uttar Pradesh" },
  { name: "Ghaziabad", state: "Uttar Pradesh" },
  { name: "Greater Noida", state: "Uttar Pradesh" },
  { name: "Ayodhya", state: "Uttar Pradesh" },
  // Uttarakhand
  { name: "Dehradun", state: "Uttarakhand" },
  { name: "Haridwar", state: "Uttarakhand" },
  { name: "Roorkee", state: "Uttarakhand" },
  { name: "Haldwani", state: "Uttarakhand" },
  { name: "Rishikesh", state: "Uttarakhand" },
  { name: "Kashipur", state: "Uttarakhand" },
  { name: "Rudrapur", state: "Uttarakhand" },
  { name: "Nainital", state: "Uttarakhand" },
  { name: "Mussoorie", state: "Uttarakhand" },
  // West Bengal
  { name: "Kolkata", state: "West Bengal" },
  { name: "Howrah", state: "West Bengal" },
  { name: "Durgapur", state: "West Bengal" },
  { name: "Asansol", state: "West Bengal" },
  { name: "Siliguri", state: "West Bengal" },
  { name: "Bardhaman", state: "West Bengal" },
  { name: "Malda", state: "West Bengal" },
  { name: "Baharampur", state: "West Bengal" },
  { name: "Habra", state: "West Bengal" },
  { name: "Kharagpur", state: "West Bengal" },
  { name: "Shantiniketan", state: "West Bengal" },
  { name: "Darjeeling", state: "West Bengal" },
  { name: "Jalpaiguri", state: "West Bengal" },
  { name: "Krishnanagar", state: "West Bengal" },
  // Union Territories
  { name: "New Delhi", state: "Delhi" },
  { name: "Dwarka", state: "Delhi" },
  { name: "Rohini", state: "Delhi" },
  { name: "Saket", state: "Delhi" },
  { name: "Chandigarh", state: "Chandigarh" },
  { name: "Port Blair", state: "Andaman and Nicobar Islands" },
  { name: "Silvassa", state: "Dadra and Nagar Haveli" },
  { name: "Daman", state: "Daman and Diu" },
  { name: "Diu", state: "Daman and Diu" },
  { name: "Kavaratti", state: "Lakshadweep" },
  { name: "Puducherry", state: "Puducherry" },
  { name: "Karaikal", state: "Puducherry" },
  { name: "Srinagar", state: "Jammu and Kashmir" },
  { name: "Jammu", state: "Jammu and Kashmir" },
  { name: "Anantnag", state: "Jammu and Kashmir" },
  { name: "Baramulla", state: "Jammu and Kashmir" },
  { name: "Sopore", state: "Jammu and Kashmir" },
  { name: "Leh", state: "Ladakh" },
  { name: "Kargil", state: "Ladakh" },
];

/** Get cities grouped by state, sorted alphabetically */
export function getCitiesByState(): Record<string, City[]> {
  const grouped: Record<string, City[]> = {};
  for (const city of cities) {
    if (!grouped[city.state]) grouped[city.state] = [];
    grouped[city.state].push(city);
  }
  // Sort states and cities within each state
  const sorted: Record<string, City[]> = {};
  for (const state of Object.keys(grouped).sort()) {
    sorted[state] = grouped[state].sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

/** Filter cities by search query (case-insensitive prefix match) */
export function searchCities(query: string): City[] {
  if (!query.trim()) return cities;
  const q = query.toLowerCase().trim();
  return cities
    .filter((c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q))
    .sort((a, b) => {
      // Prioritize starts-with matches
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.name.localeCompare(b.name);
    });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/cities.ts
git commit -m "feat: add 500+ Indian cities data with search and grouping utilities"
```

---

### Task 3: Category & Blog Data Files

**Files:**
- Create: `src/data/categories.ts`
- Create: `src/data/blogs.ts`

- [ ] **Step 1: Create `src/data/categories.ts`**

```ts
export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const categories: Category[] = [
  { id: "bridal-wear", name: "Bridal Wear", emoji: "\u{1F457}", description: "Lehengas, sarees, and designer bridal outfits" },
  { id: "groom-wear", name: "Groom Wear", emoji: "\u{1F935}", description: "Sherwanis, suits, and wedding day outfits for grooms" },
  { id: "venues", name: "Venues", emoji: "\u{1F3F0}", description: "Banquet halls, resorts, and destination wedding spots" },
  { id: "catering", name: "Catering", emoji: "\u{1F37D}️", description: "Multi-cuisine caterers and wedding food specialists" },
  { id: "mehendi", name: "Mehendi Artists", emoji: "\u{270B}", description: "Professional henna artists for bridal and guest mehendi" },
  { id: "photography", name: "Photography", emoji: "\u{1F4F7}", description: "Wedding photographers, pre-wedding shoots, and albums" },
  { id: "makeup", name: "Makeup Artists", emoji: "\u{1F484}", description: "Bridal makeup, hair styling, and beauty packages" },
  { id: "decorators", name: "Decorators", emoji: "\u{1F490}", description: "Mandap decoration, floral arrangements, and lighting" },
  { id: "invitations", name: "Wedding Invitations", emoji: "\u{1F48C}", description: "Designer cards, digital invites, and custom stationery" },
  { id: "music", name: "Music & DJ", emoji: "\u{1F3B6}", description: "DJs, live bands, dhol players, and sangeet choreographers" },
  { id: "pandits", name: "Wedding Pandits", emoji: "\u{1F64F}", description: "Experienced pandits for all wedding rituals and ceremonies" },
  { id: "jewellery", name: "Jewellery", emoji: "\u{1F48D}", description: "Bridal jewellery sets, gold, diamond, and artificial options" },
];
```

- [ ] **Step 2: Create `src/data/blogs.ts`**

```ts
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "ambani-style-wedding",
    title: "Inside the 500 Crore Ambani-Style Wedding That Broke the Internet",
    excerpt: "From Beyonce performing at the sangeet to a guest list that read like a who's who of global power — we break down what made this wedding the most talked-about celebration of the decade and what it means for Indian wedding culture.",
    date: "April 20, 2026",
    category: "Big Fat Weddings",
    readTime: "8 min read",
  },
  {
    id: "pastel-lehengas-out",
    title: "Pastel Lehengas Are Out: What Brides Are Choosing in 2026",
    excerpt: "The reign of millennial pink and powder blue is over. This season, brides are going bold with deep maroons, emerald greens, and classic reds. We spoke to 15 top designers to find out what's flying off the racks.",
    date: "April 15, 2026",
    category: "Trending",
    readTime: "6 min read",
  },
  {
    id: "rajasthan-palace-venues",
    title: "10 Palace Venues in Rajasthan That Will Make Your Wedding Royal",
    excerpt: "Imagine exchanging vows in a 400-year-old haveli with the Aravalli hills as your backdrop. From Udaipur's Lake Palace to Jodhpur's Umaid Bhawan, here are the most stunning royal wedding venues in Rajasthan.",
    date: "April 10, 2026",
    category: "Venue Ideas",
    readTime: "10 min read",
  },
  {
    id: "priya-arjun-udaipur",
    title: "Real Wedding: Priya & Arjun's Intimate Ceremony in Udaipur",
    excerpt: "With just 80 guests, zero stress, and a budget that didn't require a second mortgage — Priya and Arjun proved that intimate weddings can be just as magical. Here's their complete wedding story with all the details.",
    date: "April 5, 2026",
    category: "Real Weddings",
    readTime: "12 min read",
  },
  {
    id: "bridal-mehendi-guide",
    title: "The Ultimate Bridal Mehendi Guide: 50+ Designs That Are Trending",
    excerpt: "Arabic, Rajasthani, minimal, or full-hand — we've curated the most stunning bridal mehendi designs trending this wedding season. Plus, expert tips on making your mehendi darker and last longer.",
    date: "March 28, 2026",
    category: "Bridal Tips",
    readTime: "7 min read",
  },
  {
    id: "goa-destination-weddings",
    title: "Why Destination Weddings in Goa Are Surging This Season",
    excerpt: "Beach mandaps, sunset pheras, and three-day celebrations by the sea — Goa has become India's hottest wedding destination. We explore the best beach venues, costs, and logistics for planning your Goan dream wedding.",
    date: "March 20, 2026",
    category: "Trending",
    readTime: "9 min read",
  },
  {
    id: "north-indian-rituals",
    title: "From Haldi to Vidaai: A Complete Guide to North Indian Wedding Rituals",
    excerpt: "Every turmeric smear, every phera, every tear at the vidaai — North Indian weddings are a beautiful tapestry of rituals. Whether you're a bride-to-be or a curious guest, here's your complete guide to every ceremony.",
    date: "March 15, 2026",
    category: "Bridal Tips",
    readTime: "11 min read",
  },
  {
    id: "budget-vs-luxury",
    title: "Budget vs Luxury: What Indian Couples Are Really Spending on Weddings",
    excerpt: "The average Indian wedding costs between 10 lakhs to 2 crores — but where exactly does all that money go? We surveyed 500 couples across metros and tier-2 cities to bring you the real numbers behind Indian weddings.",
    date: "March 8, 2026",
    category: "Big Fat Weddings",
    readTime: "8 min read",
  },
];

export const blogCategories = ["All", "Big Fat Weddings", "Trending", "Bridal Tips", "Venue Ideas", "Real Weddings"] as const;
export type BlogCategory = (typeof blogCategories)[number];
```

- [ ] **Step 3: Commit**

```bash
git add src/data/categories.ts src/data/blogs.ts
git commit -m "feat: add wedding categories and blog placeholder data"
```

---

### Task 4: City Context Provider

**Files:**
- Create: `src/context/CityContext.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/context/CityContext.tsx`**

```tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { City } from "@/data/cities";

interface CityContextType {
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
}

const CityContext = createContext<CityContextType>({
  selectedCity: null,
  setSelectedCity: () => {},
});

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
```

- [ ] **Step 2: Wrap layout with CityProvider**

Update `src/app/layout.tsx` — add the import and wrap `{children}`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CityProvider } from "@/context/CityContext";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShaadiSetu — Your Perfect Wedding, One Click Away",
  description: "Discover the best wedding vendors, venues, and services across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-[family-name:var(--font-geist)] antialiased`}>
        <CityProvider>
          {children}
        </CityProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/context/CityContext.tsx src/app/layout.tsx
git commit -m "feat: add CityContext provider for city selection state"
```

---

### Task 5: CitySearch Component

**Files:**
- Create: `src/components/CitySearch.tsx`

- [ ] **Step 1: Create `src/components/CitySearch.tsx`**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { searchCities, getCitiesByState, City } from "@/data/cities";
import { useCity } from "@/context/CityContext";

export default function CitySearch() {
  const { selectedCity, setSelectedCity } = useCity();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCities = query ? searchCities(query) : [];
  const groupedCities = query ? null : getCitiesByState();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(city: City) {
    setSelectedCity(city);
    setQuery("");
    setIsOpen(false);
  }

  function handleClear() {
    setSelectedCity(null);
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <span className="pl-3 text-gray-400 text-sm">📍</span>
        {selectedCity ? (
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-sm font-medium text-slate-800">
              {selectedCity.name}, {selectedCity.state}
            </span>
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors text-xs"
              aria-label="Clear city selection"
            >
              ✕
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full px-3 py-2 text-sm text-slate-800 placeholder-gray-400 focus:outline-none bg-transparent"
            aria-label="Search for a city"
            aria-expanded={isOpen}
            role="combobox"
          />
        )}
      </div>

      {isOpen && !selectedCity && (
        <div className="absolute top-full left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          {query && filteredCities.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-500">No cities found for &quot;{query}&quot;</p>
          )}

          {query && filteredCities.length > 0 && (
            <ul role="listbox">
              {filteredCities.slice(0, 50).map((city) => (
                <li key={`${city.name}-${city.state}`}>
                  <button
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 transition-colors flex justify-between items-center"
                  >
                    <span className="font-medium text-slate-800">{city.name}</span>
                    <span className="text-xs text-gray-400">{city.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!query && groupedCities && (
            <ul role="listbox">
              {Object.entries(groupedCities).map(([state, stateCities]) => (
                <li key={state}>
                  <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    {state}
                  </p>
                  <ul>
                    {stateCities.map((city) => (
                      <li key={`${city.name}-${city.state}`}>
                        <button
                          onClick={() => handleSelect(city)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 transition-colors"
                        >
                          <span className="text-slate-800">{city.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CitySearch.tsx
git commit -m "feat: add searchable city dropdown component with 500+ Indian cities"
```

---

### Task 6: Navbar + MobileMenu

**Files:**
- Create: `src/components/Navbar.tsx`
- Create: `src/components/MobileMenu.tsx`

- [ ] **Step 1: Create `src/components/MobileMenu.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import CitySearch from "./CitySearch";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-700 hover:text-shaadi-red transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40 p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Select City</p>
            <CitySearch />
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-rose-50 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-rose-50 rounded-lg transition-colors"
            >
              Blog
            </Link>
          </nav>
          <button className="w-full py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity">
            List Your Business
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/Navbar.tsx`**

```tsx
import Link from "next/link";
import CitySearch from "./CitySearch";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
              ShaadiSetu
            </span>
          </Link>

          {/* Desktop: City Search */}
          <div className="hidden md:block w-64">
            <CitySearch />
          </div>

          {/* Desktop: Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-shaadi-red transition-colors"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-slate-700 hover:text-shaadi-red transition-colors"
            >
              Blog
            </Link>
            <button className="px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink hover:opacity-90 transition-opacity shadow-sm">
              List Your Business
            </button>
          </nav>

          {/* Mobile: Hamburger */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx src/components/MobileMenu.tsx
git commit -m "feat: add Navbar with desktop city search and mobile hamburger menu"
```

---

### Task 7: Footer Component

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create `src/components/Footer.tsx`**

```tsx
import Link from "next/link";

const footerLinks = {
  About: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Categories: [
    { label: "Bridal Wear", href: "#" },
    { label: "Venues", href: "#" },
    { label: "Photography", href: "#" },
    { label: "Catering", href: "#" },
    { label: "Makeup Artists", href: "#" },
    { label: "Decorators", href: "#" },
  ],
  "Popular Cities": [
    { label: "Delhi", href: "#" },
    { label: "Mumbai", href: "#" },
    { label: "Jaipur", href: "#" },
    { label: "Bangalore", href: "#" },
    { label: "Hyderabad", href: "#" },
    { label: "Kolkata", href: "#" },
  ],
  Connect: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Pinterest", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      {/* Red gradient top border */}
      <div className="h-1 bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section: logo + columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink bg-clip-text text-transparent">
              ShaadiSetu
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              India&apos;s most trusted wedding planning platform. Find the best vendors for your dream wedding.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-shaadi-pink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2026 ShaadiSetu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Footer with 4-column layout and gradient top border"
```

---

### Task 8: Wire Navbar + Footer into Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update `src/app/layout.tsx` to include Navbar and Footer**

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CityProvider } from "@/context/CityContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShaadiSetu — Your Perfect Wedding, One Click Away",
  description: "Discover the best wedding vendors, venues, and services across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-[family-name:var(--font-geist)] antialiased bg-white text-slate-900`}>
        <CityProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CityProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify Navbar and Footer render**

Run `npm run dev`, visit `http://localhost:3000`. Should see:
- Sticky navbar with ShaadiSetu logo, city search, Home/Blog links, CTA button
- Footer at the bottom with 4 columns and red gradient top border

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire Navbar and Footer into root layout"
```

---

### Task 9: Hero Section

**Files:**
- Create: `src/components/HeroSection.tsx`

- [ ] **Step 1: Create `src/components/HeroSection.tsx`**

```tsx
"use client";

import { useState } from "react";
import { categories } from "@/data/categories";
import { useCity } from "@/context/CityContext";
import CitySearch from "./CitySearch";

export default function HeroSection() {
  const { selectedCity } = useCity();
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-shaadi-red via-shaadi-rose to-shaadi-pink" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Your Perfect Wedding,
            <br />
            <span className="text-yellow-100">One Click Away</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-rose-100 max-w-2xl mx-auto">
            Discover the best wedding vendors, venues, and services across India.
            {selectedCity && (
              <span className="block mt-1 font-semibold text-white">
                Showing results for {selectedCity.name}, {selectedCity.state}
              </span>
            )}
          </p>

          {/* Inline search bar */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 min-w-0">
                <CitySearch />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 text-sm text-slate-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-shaadi-rose"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
              <button className="px-6 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-shaadi-red to-shaadi-rose hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap">
                Search Vendors
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">50,000+</p>
              <p className="text-sm text-rose-100">Verified Vendors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">500+</p>
              <p className="text-sm text-rose-100">Cities Covered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold">1,00,000+</p>
              <p className="text-sm text-rose-100">Happy Couples</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: add Hero section with gradient background and inline search"
```

---

### Task 10: Categories Grid

**Files:**
- Create: `src/components/CategoryCard.tsx`
- Create: `src/components/CategoriesGrid.tsx`

- [ ] **Step 1: Create `src/components/CategoryCard.tsx`**

```tsx
import { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <button className="group p-6 bg-white rounded-xl border border-gray-100 hover:border-shaadi-pink shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left w-full">
      <div className="text-4xl mb-3">{category.emoji}</div>
      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-shaadi-red transition-colors">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-gray-500 leading-relaxed">
        {category.description}
      </p>
    </button>
  );
}
```

- [ ] **Step 2: Create `src/components/CategoriesGrid.tsx`**

```tsx
import { categories } from "@/data/categories";
import CategoryCard from "./CategoryCard";

export default function CategoriesGrid() {
  return (
    <section className="py-16 md:py-20 bg-shaadi-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Wedding{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Everything you need to plan your dream wedding, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/CategoryCard.tsx src/components/CategoriesGrid.tsx
git commit -m "feat: add wedding categories grid with 12 category cards"
```

---

### Task 11: How It Works Section

**Files:**
- Create: `src/components/HowItWorks.tsx`

- [ ] **Step 1: Create `src/components/HowItWorks.tsx`**

```tsx
const steps = [
  {
    number: "1",
    title: "Choose Your City",
    description: "Select from 500+ cities across India to find local wedding vendors near you.",
  },
  {
    number: "2",
    title: "Browse Categories",
    description: "Explore 12+ categories — from bridal wear and venues to photographers and caterers.",
  },
  {
    number: "3",
    title: "Connect with Vendors",
    description: "View portfolios, compare prices, read reviews, and book your perfect wedding team.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            How It{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Plan your wedding in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-shaadi-red via-shaadi-rose to-shaadi-pink" />

          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              {/* Numbered circle */}
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-shaadi-red to-shaadi-pink flex items-center justify-center text-white text-2xl font-bold shadow-lg relative z-10">
                {step.number}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-800">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HowItWorks.tsx
git commit -m "feat: add How It Works 3-step section"
```

---

### Task 12: Popular Cities Section

**Files:**
- Create: `src/components/PopularCities.tsx`

- [ ] **Step 1: Create `src/components/PopularCities.tsx`**

```tsx
"use client";

import { useCity } from "@/context/CityContext";
import { City } from "@/data/cities";

const popularCities: City[] = [
  { name: "New Delhi", state: "Delhi" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Chandigarh", state: "Chandigarh" },
  { name: "Panaji", state: "Goa" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Kochi", state: "Kerala" },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Dehradun", state: "Uttarakhand" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Mysore", state: "Karnataka" },
  { name: "Shimla", state: "Himachal Pradesh" },
];

export default function PopularCities() {
  const { selectedCity, setSelectedCity } = useCity();

  return (
    <section className="py-16 md:py-20 bg-shaadi-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Popular Wedding{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              Destinations
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Explore wedding vendors in India&apos;s most popular wedding cities
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {popularCities.map((city) => {
            const isSelected =
              selectedCity?.name === city.name && selectedCity?.state === city.state;
            return (
              <button
                key={`${city.name}-${city.state}`}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? "bg-gradient-to-r from-shaadi-red to-shaadi-rose text-white border-transparent shadow-md"
                    : "bg-white text-slate-700 border-gray-200 hover:border-shaadi-pink hover:text-shaadi-red hover:shadow-sm"
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PopularCities.tsx
git commit -m "feat: add Popular Cities pill section with 24 cities"
```

---

### Task 13: Assemble Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import HeroSection from "@/components/HeroSection";
import CategoriesGrid from "@/components/CategoriesGrid";
import HowItWorks from "@/components/HowItWorks";
import PopularCities from "@/components/PopularCities";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesGrid />
      <HowItWorks />
      <PopularCities />
    </>
  );
}
```

- [ ] **Step 2: Verify the full home page renders**

Run `npm run dev`, visit `http://localhost:3000`. Should see all 4 sections stacked: Hero → Categories → How It Works → Popular Cities, with Navbar on top and Footer at bottom.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble home page with all sections"
```

---

### Task 14: Blog Page

**Files:**
- Create: `src/components/BlogHero.tsx`
- Create: `src/components/BlogCard.tsx`
- Create: `src/app/blog/page.tsx`

- [ ] **Step 1: Create `src/components/BlogHero.tsx`**

```tsx
export default function BlogHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-shaadi-rose via-shaadi-pink to-rose-300" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Wedding Diaries
        </h1>
        <p className="mt-4 text-lg text-rose-100 max-w-xl mx-auto">
          Stories, trends, and inspiration for your dream Indian wedding
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/BlogCard.tsx`**

```tsx
import { BlogPost } from "@/data/blogs";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-shaadi-pink shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Placeholder image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-4xl opacity-30">📸</span>
      </div>

      <div className="p-5">
        {/* Category tag */}
        <span className="inline-block px-3 py-1 text-xs font-semibold text-shaadi-red bg-shaadi-light rounded-full">
          {post.category}
        </span>

        <h3 className="mt-3 text-lg font-semibold text-slate-800 group-hover:text-shaadi-red transition-colors leading-snug line-clamp-2">
          {post.title}
        </h3>

        <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Create `src/app/blog/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import BlogHero from "@/components/BlogHero";
import BlogCard from "@/components/BlogCard";
import { blogPosts, blogCategories, BlogCategory } from "@/data/blogs";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

  const filteredPosts =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <>
      <BlogHero />

      <section className="py-12 md:py-16 bg-shaadi-warm-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {blogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-shaadi-red to-shaadi-rose text-white border-transparent shadow-md"
                    : "bg-white text-slate-700 border-gray-200 hover:border-shaadi-pink hover:text-shaadi-red"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No articles found in this category yet. Check back soon!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4: Verify blog page renders**

Visit `http://localhost:3000/blog`. Should see:
- Blog hero with "Wedding Diaries"
- Filter chips (All, Big Fat Weddings, etc.)
- 8 blog cards in a grid
- Clicking a filter chip narrows the results

- [ ] **Step 5: Commit**

```bash
git add src/components/BlogHero.tsx src/components/BlogCard.tsx src/app/blog/page.tsx
git commit -m "feat: add Blog page with hero, category filters, and 8 placeholder articles"
```

---

### Task 15: Final Polish & Verification

**Files:**
- Modify: Various (fixes only)

- [ ] **Step 1: Run the dev server and verify all pages**

```bash
cd ~/Desktop/shaadisetu && npm run dev
```

Checklist:
- Home page: Hero → Categories → How It Works → Popular Cities
- Blog page: Hero → Filters → Cards
- Navbar: Logo, city search, nav links, CTA
- Footer: 4 columns, gradient top border
- City search: type "Jai" → Jaipur appears, select it → shows in hero text
- Popular cities: click "Mumbai" → updates city selection
- Blog filters: click "Trending" → shows only trending posts
- Mobile: resize to 375px → hamburger menu works

- [ ] **Step 2: Run production build**

```bash
cd ~/Desktop/shaadisetu && npm run build
```

Should complete with no errors.

- [ ] **Step 3: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "chore: polish and verify all pages"
```
