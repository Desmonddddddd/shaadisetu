import { getUserSessionOrRedirect } from "@/lib/auth/session";
import { getOrCreateProfile } from "@/lib/queries/budget";
import { BudgetDashboard } from "@/components/budget/BudgetDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Budget Tracker | ShaadiSetu Account",
};

export default async function BudgetPage() {
  const { userId } = await getUserSessionOrRedirect();
  const profile = await getOrCreateProfile(userId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl text-ink mb-1">Budget</h1>
        <p className="text-sm text-ink-soft font-light">
          Plan and track every line item by ceremony. Mark items paid as you go.
        </p>
      </div>

      <BudgetDashboard
        initialItems={profile.budgetItems.map((b) => ({
          id: b.id,
          ceremony: b.ceremony,
          category: b.category,
          label: b.label,
          plannedAmount: b.plannedAmount,
          actualAmount: b.actualAmount,
          vendorId: b.vendorId,
          paid: b.paid,
          notes: b.notes,
        }))}
      />
    </div>
  );
}
