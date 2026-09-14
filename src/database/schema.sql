PRAGMA foreign_keys = ON;

CREATE TABLE "categories"(
    "category_id" INTEGER PRIMARY KEY NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" INTEGER NOT NULL CHECK(is_active IN(0, 1))
);
CREATE TABLE "menu_items"(
    "menu_item_id" INTEGER PRIMARY KEY NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL CHECK(price >= 0),
    "is_available" INTEGER NOT NULL CHECK(is_available IN(0, 1)),

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
);
CREATE TABLE "restaurant_tables"(
    "table_id" INTEGER PRIMARY KEY NOT NULL,
    "table_number" INTEGER NOT NULL UNIQUE,
    "is_active" INTEGER NOT NULL CHECK(is_active IN(0, 1))
);
CREATE TABLE "bills"(
    "bill_id" INTEGER PRIMARY KEY NOT NULL,
    "table_id" INTEGER NOT NULL,
    "opened_at" TEXT NOT NULL,
    "closed_at" TEXT,
    "status" TEXT NOT NULL CHECK(status IN('open', 'closed')),

    FOREIGN KEY (table_id)
        REFERENCES restaurant_tables(table_id)
        ON DELETE RESTRICT
);
CREATE TABLE "order_rounds"(
    "round_id" INTEGER PRIMARY KEY NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "round_number" INTEGER NOT NULL,
    "ordered_at" TEXT NOT NULL,

    FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE RESTRICT
);
CREATE TABLE "order_items"(
    "order_item_id" INTEGER PRIMARY KEY NOT NULL,
    "round_id" INTEGER NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL CHECK (quantity > 0),
    "unit_price" INTEGER NOT NULL CHECK (unit_price >= 0),
    "note" TEXT,
    "status" TEXT NOT NULL CHECK(status IN ('waiting', 'cooking', 'served', 'cancelled')),
    "cancelled_at" TEXT,

    FOREIGN KEY (round_id)
        REFERENCES order_rounds(round_id)
        ON DELETE RESTRICT,

    FOREIGN KEY (menu_item_id)
        REFERENCES menu_items(menu_item_id)
        ON DELETE RESTRICT
);