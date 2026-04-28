import type {
  Vendor as PrismaVendor,
  Package as PrismaPackage,
  PortfolioImage as PrismaPortfolioImage,
  Review as PrismaReview,
  VendorStats as PrismaVendorStats,
  City as PrismaCity,
  Category as PrismaCategory,
  Subcategory as PrismaSubcategory,
  Enquiry as PrismaEnquiry,
} from "@/generated/prisma";

/**
 * Application-shaped types. The DB stores `tags` and `features` as
 * JSON-encoded strings (SQLite limitation); UI consumers always see
 * decoded arrays. The query layer decodes; the seed layer encodes.
 */
export type Vendor = Omit<PrismaVendor, "tags"> & {
  tags: string[];
  city: { name: string };
};
export type Package = Omit<PrismaPackage, "features"> & { features: string[] };
export type PortfolioImage = PrismaPortfolioImage;
export type Review = PrismaReview;
export type VendorStats = PrismaVendorStats;
export type City = PrismaCity;
export type Category = PrismaCategory;
export type Subcategory = PrismaSubcategory;
export type Enquiry = PrismaEnquiry;

/** A Vendor with its full nested profile data (UI-decoded). */
export type VendorWithProfile = Vendor & {
  packages: Package[];
  portfolio: PortfolioImage[];
  reviews: Review[];
  bookedDates: { date: string }[];
  stats: VendorStats | null;
};

/** A vendor preview stored client-side in CompareContext. */
export interface VendorPreview {
  id: string;
  name: string;
}
