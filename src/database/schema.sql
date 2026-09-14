CREATE TABLE "categories"(
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" INTEGER NOT NULL CHECK(is_active IN(0, 1)),
);
ALTER TABLE
    "categories" ADD PRIMARY KEY("category_id");
CREATE TABLE "menu_items"(
    "menu_item_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL CHECK(price >= 0),
    "is_available" INTEGER NOT NULL CHECK(is_available IN(0, 1)),
);
ALTER TABLE
    "menu_items" ADD PRIMARY KEY("menu_item_id");
CREATE TABLE "restaurant_tables"(
    "table_id" INTEGER NOT NULL,
    "table_number" INTEGER NOT NULL,
    "is_active" INTEGER NOT NULL CHECK(is_active IN(0, 1)),
);
ALTER TABLE
    "restaurant_tables" ADD PRIMARY KEY("table_id");
CREATE TABLE "bills"(
    "bill_id" INTEGER NOT NULL,
    "table_id" INTEGER NOT NULL,
    "opened_at" TEXT NOT NULL,
    "closed_at" TEXT,
    "status" TEXT NOT NULL CHECK(status IN('open', 'closed')),
);
ALTER TABLE
    "bills" ADD PRIMARY KEY("bill_id");
CREATE TABLE "order_rounds"(
    "round_id" INTEGER NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "round_number" INTEGER NOT NULL,
    "ordered_at" TEXT NOT NULL,
);
ALTER TABLE
    "order_rounds" ADD PRIMARY KEY("round_id");
CREATE TABLE "order_items"(
    "order_item_id" INTEGER NOT NULL,
    "round_id" INTEGER NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL CHECK (quantity > 0),
    "unit_price" INTEGER NOT NULL CHECK (unit_price >= 0),
    "note" TEXT,
    "status" TEXT NOT NULL CHECK(status IN ('waiting', 'cooking', 'served', 'cancelled')),
    "cancelled_at" TEXT,
);
ALTER TABLE
    "order_items" ADD PRIMARY KEY("order_item_id");
    
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_menu_item_id_foreign" FOREIGN KEY("menu_item_id") REFERENCES "menu_items"("menu_item_id");
ALTER TABLE
    "bills" ADD CONSTRAINT "bills_table_id_foreign" FOREIGN KEY("table_id") REFERENCES "restaurant_tables"("table_id");
ALTER TABLE
    "menu_items" ADD CONSTRAINT "menu_items_category_id_foreign" FOREIGN KEY("category_id") REFERENCES "categories"("category_id");
ALTER TABLE
    "order_rounds" ADD CONSTRAINT "order_rounds_bill_id_foreign" FOREIGN KEY("bill_id") REFERENCES "bills"("bill_id");
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_round_id_foreign" FOREIGN KEY("round_id") REFERENCES "order_rounds"("round_id");