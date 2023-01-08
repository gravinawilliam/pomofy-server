-- CreateTable
CREATE TABLE "users" (
    "email" VARCHAR NOT NULL,
    "username" VARCHAR NOT NULL,
    "facebook_account_id" VARCHAR,
    "google_account_id" VARCHAR,
    "password" VARCHAR NOT NULL,
    "is_email_validated" BOOLEAN NOT NULL DEFAULT false,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_validation_tokens" (
    "user_id" VARCHAR NOT NULL,
    "token" VARCHAR NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "email_validation_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_facebook_account_id_key" ON "users"("facebook_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_account_id_key" ON "users"("google_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "email_validation_tokens_user_id_key" ON "email_validation_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_validation_tokens_id_key" ON "email_validation_tokens"("id");

-- AddForeignKey
ALTER TABLE "email_validation_tokens" ADD CONSTRAINT "email_validation_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
