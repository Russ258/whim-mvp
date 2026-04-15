-- CreateTable
CREATE TABLE "SalonApplication" (
    "id" SERIAL NOT NULL,
    "salonName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chairs" TEXT,
    "bookingSoftware" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalonApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalonAccount" (
    "id" SERIAL NOT NULL,
    "salonId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "loginToken" TEXT NOT NULL,
    "tokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalonAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalonAccount_salonId_key" ON "SalonAccount"("salonId");

-- CreateIndex
CREATE UNIQUE INDEX "SalonAccount_email_key" ON "SalonAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SalonAccount_loginToken_key" ON "SalonAccount"("loginToken");

-- AddForeignKey
ALTER TABLE "SalonAccount" ADD CONSTRAINT "SalonAccount_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
