-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT E'off',

    PRIMARY KEY ("id")
);
