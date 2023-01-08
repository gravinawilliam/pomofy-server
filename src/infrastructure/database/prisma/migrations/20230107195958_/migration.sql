-- CreateTable
CREATE TABLE "tasks" (
    "user_id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tasks_user_id_key" ON "tasks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_id_key" ON "tasks"("id");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
