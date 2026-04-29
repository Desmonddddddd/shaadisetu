-- CreateTable
CREATE TABLE "AstroLead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "dob1" TEXT NOT NULL,
    "place1" TEXT NOT NULL,
    "tob1" TEXT,
    "gender1" TEXT,
    "dob2" TEXT,
    "place2" TEXT,
    "tob2" TEXT,
    "gender2" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AstroLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weddingDate" TEXT,
    "totalBudget" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetItem" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "ceremony" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "plannedAmount" INTEGER NOT NULL,
    "actualAmount" INTEGER,
    "vendorId" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingSite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "coupleNames" TEXT NOT NULL,
    "heroImage" TEXT,
    "events" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "invitedTo" TEXT NOT NULL,
    "rsvpStatus" TEXT NOT NULL DEFAULT 'pending',
    "plusOnes" INTEGER NOT NULL DEFAULT 0,
    "dietary" TEXT,
    "notes" TEXT,
    "rsvpToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AstroLead_email_idx" ON "AstroLead"("email");

-- CreateIndex
CREATE INDEX "AstroLead_source_createdAt_idx" ON "AstroLead"("source", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingProfile_userId_key" ON "WeddingProfile"("userId");

-- CreateIndex
CREATE INDEX "BudgetItem_profileId_ceremony_idx" ON "BudgetItem"("profileId", "ceremony");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingSite_userId_key" ON "WeddingSite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingSite_slug_key" ON "WeddingSite"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_rsvpToken_key" ON "Guest"("rsvpToken");

-- CreateIndex
CREATE INDEX "Guest_siteId_rsvpStatus_idx" ON "Guest"("siteId", "rsvpStatus");

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "WeddingProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "WeddingSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
