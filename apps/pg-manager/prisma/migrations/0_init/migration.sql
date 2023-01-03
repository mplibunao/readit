-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female', 'prefer_not_to_say');

-- CreateTable
CREATE TABLE "kysely_migration" (
    "name" VARCHAR(255) NOT NULL,
    "timestamp" VARCHAR(255) NOT NULL,

    CONSTRAINT "kysely_migration_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "kysely_migration_lock" (
    "id" VARCHAR(255) NOT NULL,
    "is_locked" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "kysely_migration_lock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivated_at" TIMESTAMPTZ(6),
    "gender" "gender",

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

