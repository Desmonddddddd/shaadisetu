"use server";

import { db } from "@/lib/db";
import type { Vendor } from "@/types/vendor";
import { BUDGET_CATEGORIES } from "@/data/budgetCategories";
import { getBudgetTierById } from "@/data/budgetTiers";
import { getVendorsForBudgetTier } from "@/lib/queries/curation";

export interface ConciergeAnswers {
  guests: string;
  budget: string;
  cityId: string;
  events: string[];
  priority: string[];
  date: string;
}

export interface PriorityPick {
  category: typeof BUDGET_CATEGORIES[number];
  rupeeAllowance: number;
  vendors: Vendor[];
}

export interface ConciergePlan {
  cityName: string | null;
  budgetTotalLabel: string;
  budgetAllocationTotal: number;
  guestRange: string;
  recommendedEvents: string[];
  priorityPicks: PriorityPick[];
  fillerPicks: PriorityPick[];
  notes: string[];
}

const GUEST_LABELS: Record<string, string> = {
  intimate: "Under 100 guests",
  midsized: "100 to 250 guests",
  large: "250 to 500 guests",
  huge: "500+ guests",
};

export async function buildConciergePlan(
  answers: ConciergeAnswers,
): Promise<ConciergePlan> {
  const tier = getBudgetTierById(answers.budget) ?? getBudgetTierById("classic")!;

  const buckets = await getVendorsForBudgetTier(tier, 4);
  const cityRow = answers.cityId
    ? await db.city.findUnique({ where: { id: answers.cityId }, select: { name: true } })
    : null;

  // If a city is selected, prefer vendors in that city. We don't filter
  // strictly because some categories may not have city representation.
  const filterByCity = (vendors: Vendor[]) => {
    if (!answers.cityId) return vendors;
    const local = vendors.filter((v) => v.cityId === answers.cityId);
    return local.length > 0 ? local : vendors;
  };

  const prioritySet = new Set(answers.priority);
  const priorityPicks: PriorityPick[] = [];
  const fillerPicks: PriorityPick[] = [];

  for (const bucket of buckets) {
    const filtered = filterByCity(bucket.vendors).slice(0, 3);
    const entry: PriorityPick = {
      category: bucket.category,
      rupeeAllowance: bucket.perCategoryBudget,
      vendors: filtered,
    };
    if (prioritySet.has(bucket.category.id)) {
      priorityPicks.push(entry);
    } else {
      fillerPicks.push(entry);
    }
  }

  // Sort priority picks by user's pick order
  priorityPicks.sort((a, b) => answers.priority.indexOf(a.category.id) - answers.priority.indexOf(b.category.id));

  const notes: string[] = [];
  if (answers.guests === "huge" && answers.budget === "intimate") {
    notes.push(
      "A 500+ guest list with an under-₹20 Lakh budget is tight. Consider a community hall, a single live counter, and decor focused on the mandap only.",
    );
  }
  if (answers.events.length >= 5) {
    notes.push(
      "Five or more functions is ambitious. We'd suggest grouping haldi + mehendi into a single morning to protect everyone's energy.",
    );
  }
  if (!answers.priority.length) {
    notes.push(
      "You didn't pick a priority — we've defaulted to a balanced split. You can always weight a category later in the budget planner.",
    );
  }
  if (answers.budget === "royal") {
    notes.push(
      "At this budget, hire a planner before any individual vendor. The coordination cost is what breaks weddings, not the vendor cost.",
    );
  }

  return {
    cityName: cityRow?.name ?? null,
    budgetTotalLabel: tier.totalLabel,
    budgetAllocationTotal: tier.allocationTotal,
    guestRange: GUEST_LABELS[answers.guests] ?? answers.guests,
    recommendedEvents: answers.events,
    priorityPicks,
    fillerPicks,
    notes,
  };
}
