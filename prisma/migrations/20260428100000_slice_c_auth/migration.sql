-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN "email" TEXT;
ALTER TABLE "Vendor" ADD COLUMN "moderationState" TEXT NOT NULL DEFAULT 'live';

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN "readAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "VendorAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "vendorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VendorAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_email_key" ON "Vendor"("email");
CREATE UNIQUE INDEX "VendorAccount_email_key" ON "VendorAccount"("email");
CREATE UNIQUE INDEX "VendorAccount_vendorId_key" ON "VendorAccount"("vendorId");

-- AddForeignKey
ALTER TABLE "VendorAccount" ADD CONSTRAINT "VendorAccount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
