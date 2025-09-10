-- CreateTable
CREATE TABLE "public"."Device" (
    "id" TEXT NOT NULL,
    "ieeeAddress" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "powerSource" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "removed" BOOLEAN NOT NULL DEFAULT false,
    "hubId" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_hubId_fkey" FOREIGN KEY ("hubId") REFERENCES "public"."Hub"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
