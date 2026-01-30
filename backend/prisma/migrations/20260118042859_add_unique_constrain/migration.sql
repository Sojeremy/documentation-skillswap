/*
  Warnings:

  - A unique constraint covering the columns `[evaluator_id,evaluated_id]` on the table `evaluation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[followed_id,follower_id]` on the table `follow` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "evaluation_evaluator_id_evaluated_id_key" ON "evaluation"("evaluator_id", "evaluated_id");

-- CreateIndex
CREATE UNIQUE INDEX "follow_followed_id_follower_id_key" ON "follow"("followed_id", "follower_id");
