-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_walletId_fkey";

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "WalletSetting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
