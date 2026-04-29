import { db } from "@/lib/db";
import type { BudgetItemInput, BudgetItemUpdate, WeddingProfileInput } from "@/lib/validators";

const STARTER_ITEMS: Array<{
  ceremony: string;
  category: string;
  label: string;
  plannedAmount: number;
}> = [
  { ceremony: "wedding", category: "Venue", label: "Wedding venue / banquet hall", plannedAmount: 500000 },
  { ceremony: "wedding", category: "Photography", label: "Wedding photographer + video", plannedAmount: 200000 },
  { ceremony: "wedding", category: "Catering", label: "Wedding catering", plannedAmount: 350000 },
  { ceremony: "wedding", category: "Decor", label: "Mandap and floral", plannedAmount: 150000 },
  { ceremony: "wedding", category: "Bridal Wear", label: "Bridal lehenga + jewellery", plannedAmount: 250000 },
  { ceremony: "mehendi", category: "Decor", label: "Mehendi setup", plannedAmount: 50000 },
  { ceremony: "mehendi", category: "Catering", label: "Mehendi lunch / hi-tea", plannedAmount: 75000 },
  { ceremony: "sangeet", category: "Entertainment", label: "DJ / live band", plannedAmount: 120000 },
  { ceremony: "sangeet", category: "Catering", label: "Sangeet dinner", plannedAmount: 200000 },
  { ceremony: "haldi", category: "Decor", label: "Haldi setup + flowers", plannedAmount: 30000 },
  { ceremony: "reception", category: "Venue", label: "Reception venue", plannedAmount: 300000 },
  { ceremony: "reception", category: "Catering", label: "Reception dinner", plannedAmount: 250000 },
];

export async function getOrCreateProfile(userId: string) {
  let profile = await db.weddingProfile.findUnique({
    where: { userId },
    include: { budgetItems: { orderBy: [{ ceremony: "asc" }, { createdAt: "asc" }] } },
  });
  if (profile) return profile;
  profile = await db.weddingProfile.create({
    data: {
      userId,
      budgetItems: {
        create: STARTER_ITEMS.map((s) => ({
          ceremony: s.ceremony,
          category: s.category,
          label: s.label,
          plannedAmount: s.plannedAmount,
        })),
      },
    },
    include: { budgetItems: { orderBy: [{ ceremony: "asc" }, { createdAt: "asc" }] } },
  });
  return profile;
}

export async function updateProfile(userId: string, input: WeddingProfileInput) {
  const existing = await db.weddingProfile.findUnique({ where: { userId } });
  if (!existing) {
    return db.weddingProfile.create({
      data: { userId, ...input },
    });
  }
  return db.weddingProfile.update({
    where: { userId },
    data: input,
  });
}

export async function createBudgetItem(userId: string, input: BudgetItemInput) {
  const profile = await getOrCreateProfile(userId);
  return db.budgetItem.create({
    data: {
      profileId: profile.id,
      ceremony: input.ceremony,
      category: input.category,
      label: input.label,
      plannedAmount: input.plannedAmount,
      actualAmount: input.actualAmount ?? null,
      vendorId: input.vendorId ?? null,
      paid: input.paid ?? false,
      notes: input.notes ?? null,
    },
  });
}

export async function updateBudgetItem(
  userId: string,
  itemId: string,
  input: BudgetItemUpdate,
) {
  const profile = await db.weddingProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("No profile");
  const item = await db.budgetItem.findUnique({ where: { id: itemId } });
  if (!item || item.profileId !== profile.id) throw new Error("Not found");
  return db.budgetItem.update({
    where: { id: itemId },
    data: input,
  });
}

export async function deleteBudgetItem(userId: string, itemId: string) {
  const profile = await db.weddingProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("No profile");
  const item = await db.budgetItem.findUnique({ where: { id: itemId } });
  if (!item || item.profileId !== profile.id) throw new Error("Not found");
  await db.budgetItem.delete({ where: { id: itemId } });
}
