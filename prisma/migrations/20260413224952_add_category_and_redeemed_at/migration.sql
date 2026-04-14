-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "redeemedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Salon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.7,
    "distanceKm" REAL NOT NULL,
    "heroImage" TEXT,
    "category" TEXT NOT NULL DEFAULT 'HAIR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Salon" ("address", "city", "createdAt", "description", "distanceKm", "heroImage", "id", "name", "rating") SELECT "address", "city", "createdAt", "description", "distanceKm", "heroImage", "id", "name", "rating" FROM "Salon";
DROP TABLE "Salon";
ALTER TABLE "new_Salon" RENAME TO "Salon";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
