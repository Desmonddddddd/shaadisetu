import { getUserSessionOrRedirect } from "@/lib/auth/session";
import { getSiteByUserId } from "@/lib/queries/wedding-site";
import { SiteEditor } from "@/components/wedding-site/SiteEditor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wedding Microsite | ShaadiSetu Account",
};

export default async function WeddingMicrositePage() {
  const { userId } = await getUserSessionOrRedirect();
  const site = await getSiteByUserId(userId);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl text-ink mb-1">
          Wedding microsite
        </h1>
        <p className="text-sm text-ink-soft font-light">
          A shareable URL for your guests with event details, venues, and dress
          code. RSVP collection coming next.
        </p>
      </div>
      <SiteEditor
        initial={
          site
            ? {
                slug: site.slug,
                headline: site.headline,
                coupleNames: site.coupleNames,
                heroImage: site.heroImage,
                events: site.events,
                isPublic: site.isPublic,
              }
            : null
        }
      />
    </div>
  );
}
