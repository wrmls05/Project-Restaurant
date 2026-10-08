import * as SQLite from 'expo-sqlite';
import { Tables } from './tablesdata';
import { CATEGORIES, MENU_ITEMS } from './menuData';

export async function openRestaurantDatabase() {
  const db = await SQLite.openDatabaseAsync('restaurant.db');

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      is_active INTEGER NOT NULL CHECK (is_active IN (0, 1))
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      menu_item_id INTEGER PRIMARY KEY NOT NULL,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0),
      is_available INTEGER NOT NULL CHECK (is_available IN (0, 1)),
      FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS restaurant_tables (
      table_id INTEGER PRIMARY KEY NOT NULL,
      table_number INTEGER NOT NULL UNIQUE,
      is_active INTEGER NOT NULL CHECK (is_active IN (0, 1))
    );

    CREATE TABLE IF NOT EXISTS bills (
      bill_id INTEGER PRIMARY KEY NOT NULL,
      table_id INTEGER NOT NULL,
      opened_at TEXT NOT NULL,
      closed_at TEXT,
      status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
      FOREIGN KEY (table_id) REFERENCES restaurant_tables(table_id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS order_rounds (
      round_id INTEGER PRIMARY KEY NOT NULL,
      bill_id INTEGER NOT NULL,
      round_number INTEGER NOT NULL CHECK (round_number > 0),
      ordered_at TEXT NOT NULL,
      UNIQUE (bill_id, round_number),
      FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_item_id INTEGER PRIMARY KEY NOT NULL,
      round_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
      note TEXT,
      status TEXT NOT NULL CHECK (status IN ('waiting', 'cooking', 'served', 'cancelled')),
      cancelled_at TEXT,
      FOREIGN KEY (round_id) REFERENCES order_rounds(round_id) ON DELETE RESTRICT,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id) ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_order_items_round_id ON order_items(round_id);
    CREATE INDEX IF NOT EXISTS idx_order_rounds_bill_id ON order_rounds(bill_id);
  `);

  for (const category of CATEGORIES) {
    await db.runAsync(
      'INSERT OR IGNORE INTO categories (category_id, name, is_active) VALUES (?, ?, ?)',
      category.category_id,
      category.name,
      Number(category.is_active)
    );
  }

  for (const item of MENU_ITEMS) {
    await db.runAsync(
      `INSERT INTO menu_items (menu_item_id, category_id, name, price, is_available)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(menu_item_id) DO UPDATE SET price = excluded.price, name = excluded.name`,
      item.menu_item_id,
      item.category_id,
      item.name,
      item.price,
      Number(item.is_available)
    );
  }

  for (const table of Tables) {
    await db.runAsync(
      'INSERT OR IGNORE INTO restaurant_tables (table_id, table_number, is_active) VALUES (?, ?, 1)',
      Number(table.id),
      Number(table.id)
    );
  }

  return db;
}

export async function saveOrder(db, tableId, items) {
  if (!Number.isInteger(Number(tableId))) {
    throw new Error('ไม่พบหมายเลขโต๊ะ');
  }

  for (const item of items) {
    if (
      !Number.isInteger(Number(item.menu_item_id)) ||
      !Number.isInteger(Number(item.quantity)) ||
      Number(item.quantity) < 1 ||
      !Number.isFinite(Number(item.unit_price)) ||
      Number(item.unit_price) < 0
    ) {
      throw new Error(`ข้อมูลรายการอาหารไม่ถูกต้อง: ${item.name || 'ไม่ทราบชื่อเมนู'}`);
    }
  }

  await db.withExclusiveTransactionAsync(async (transaction) => {
    let bill = await transaction.getFirstAsync(
      "SELECT bill_id FROM bills WHERE table_id = ? AND status = 'open' ORDER BY bill_id DESC LIMIT 1",
      Number(tableId)
    );

    if (!bill) {
      const result = await transaction.runAsync(
        "INSERT INTO bills (table_id, opened_at, status) VALUES (?, ?, 'open')",
        Number(tableId),
        new Date().toISOString()
      );
      bill = { bill_id: result.lastInsertRowId };
    }

    const lastRound = await transaction.getFirstAsync(
      'SELECT COALESCE(MAX(round_number), 0) AS number FROM order_rounds WHERE bill_id = ?',
      bill.bill_id
    );
    const nextRoundNumber = lastRound.number + 1;
    const newRound = await transaction.runAsync(
      'INSERT INTO order_rounds (bill_id, round_number, ordered_at) VALUES (?, ?, ?)',
      bill.bill_id,
      nextRoundNumber,
      new Date().toISOString()
    );

    for (const item of items) {
      await transaction.runAsync(
        "INSERT INTO order_items (round_id, menu_item_id, quantity, unit_price, note, status) VALUES (?, ?, ?, ?, ?, 'waiting')",
        newRound.lastInsertRowId,
        Number(item.menu_item_id),
        Number(item.quantity),
        Number(item.unit_price),
        item.note || null
      );
    }
  });
}

export async function cancelOrderItem(db, itemId) {
  await db.runAsync(
    "UPDATE order_items SET status = 'cancelled', cancelled_at = ? WHERE order_item_id = ? AND status = 'waiting'",
    new Date().toISOString(),
    Number(itemId)
  );
}

export async function changeOrderStatus(db, itemId, status) {
  await db.runAsync(
    "UPDATE order_items SET status = ? WHERE order_item_id = ? AND status IN ('waiting', 'cooking')",
    status,
    Number(itemId)
  );
}

export async function closeBill(db, billId) {
  const pending = await db.getFirstAsync(
    "SELECT COUNT(*) AS count FROM order_items i JOIN order_rounds r ON r.round_id = i.round_id WHERE r.bill_id = ? AND i.status IN ('waiting', 'cooking')",
    Number(billId)
  );

  if (pending.count > 0) return false;

  await db.runAsync(
    "UPDATE bills SET status = 'closed', closed_at = ? WHERE bill_id = ? AND status = 'open'",
    new Date().toISOString(),
    Number(billId)
  );
  return true;
}
