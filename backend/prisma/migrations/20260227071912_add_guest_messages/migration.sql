-- CreateTable
CREATE TABLE "guest_messages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "reply_to_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guest_messages" ADD CONSTRAINT "guest_messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "guest_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
