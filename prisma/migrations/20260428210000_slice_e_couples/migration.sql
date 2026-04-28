-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateTable
CREATE TABLE "SavedVendor" (
    "userId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedVendor_pkey" PRIMARY KEY ("userId", "vendorId")
);

CREATE INDEX "SavedVendor_userId_createdAt_idx" ON "SavedVendor"("userId", "createdAt");

ALTER TABLE "SavedVendor" ADD CONSTRAINT "SavedVendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedVendor" ADD CONSTRAINT "SavedVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN "userId" TEXT;
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
