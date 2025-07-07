const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// 确保数据库目录存在
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// 数据库文件路径
const dbPath = path.join(dbDir, 'mystbox.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database');

        // 初始化数据库表
        initTables();
    }
});

// 初始化数据库表结构
function initTables() {
    // 用户表
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        }
    });

    // 盲盒表
    db.run(`
    CREATE TABLE IF NOT EXISTS blind_boxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      series TEXT NOT NULL,
      cover_url TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      stock INTEGER NOT NULL DEFAULT 0
    )
  `, (err) => {
        if (err) {
            console.error('Error creating blind_boxes table:', err.message);
        }
    });

    // 订单表
    db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      box_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('unopened', 'opened', 'canceled')) DEFAULT 'unopened',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (box_id) REFERENCES blind_boxes(id)
    )
  `, (err) => {
        if (err) {
            console.error('Error creating orders table:', err.message);
        }
    });

    // 玩家秀表
    db.run(`
    CREATE TABLE IF NOT EXISTS player_shows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
        if (err) {
            console.error('Error creating player_shows table:', err.message);
        }
    });
}

module.exports = db;
