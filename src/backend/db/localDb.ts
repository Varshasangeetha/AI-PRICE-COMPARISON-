/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { seedProductsData } from './seedData';
import { 
  User, 
  Product, 
  SearchHistory, 
  Wishlist, 
  PriceAlert, 
  UserActivity 
} from '../../types';

const DB_PATH = path.join(process.cwd(), 'db.json');
const SQLITE_DB_PATH = path.join(process.cwd(), 'database.sqlite');

interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> bcrypt hash
  searchHistories: SearchHistory[];
  wishlists: Wishlist[];
  priceAlerts: PriceAlert[];
  userActivities: UserActivity[];
}

const initialDb: DatabaseSchema = {
  users: [],
  passwords: {},
  searchHistories: [],
  wishlists: [],
  priceAlerts: [],
  userActivities: []
};

class LocalDatabase {
  private data: DatabaseSchema = initialDb;
  private sqlite: Database.Database;

  constructor() {
    this.load();
    // Initialize SQLite
    this.sqlite = new Database(SQLITE_DB_PATH);
    this.initSqlite();
  }

  private load() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Error loading database, resetting...', e);
      this.data = { ...initialDb };
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving database:', e);
    }
  }

  private initSqlite() {
    // Create products table exactly matching user specifications
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT,
        brand TEXT,
        category TEXT,
        ram TEXT,
        storage TEXT,
        processor TEXT,
        price REAL,
        rating REAL,
        seller TEXT,
        website TEXT,
        delivery_days INTEGER,
        warranty TEXT,
        image_url TEXT
      )
    `);

    // Check if the table is empty and seed if necessary
    const countRow = this.sqlite.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    if (countRow.count === 0) {
      console.log('[SQLite DB] Table is empty. Seeding with 40+ realistic products...');
      this.seedSqliteProducts();
    } else {
      this.incrementalSeedSqliteProducts();
    }
  }

  private incrementalSeedSqliteProducts() {
    try {
      const existingRows = this.sqlite.prepare('SELECT DISTINCT product_name FROM products').all() as { product_name: string }[];
      const existingNames = new Set(existingRows.map(r => r.product_name.toLowerCase()));

      const stmt = this.sqlite.prepare(`
        INSERT INTO products (
          product_name, brand, category, ram, storage, processor,
          price, rating, seller, website, delivery_days, warranty, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let addedCount = 0;
      this.sqlite.transaction(() => {
        for (const prod of seedProductsData) {
          if (!existingNames.has(prod.name.toLowerCase())) {
            addedCount++;
            for (const listing of prod.listings) {
              stmt.run(
                prod.name,
                prod.brand,
                prod.category,
                prod.ram,
                prod.storage,
                prod.processor,
                listing.price,
                listing.rating,
                listing.seller,
                listing.website,
                listing.deliveryDays,
                listing.warranty,
                prod.image_url
              );
            }
          }
        }
      })();
      if (addedCount > 0) {
        console.log(`[SQLite DB] Successfully incrementally seeded ${addedCount} new product categories!`);
      }
    } catch (err) {
      console.error('[SQLite DB] Error in incremental seeding:', err);
    }
  }

  private seedSqliteProducts() {
    const stmt = this.sqlite.prepare(`
      INSERT INTO products (
        product_name, brand, category, ram, storage, processor,
        price, rating, seller, website, delivery_days, warranty, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    this.sqlite.transaction(() => {
      for (const prod of seedProductsData) {
        for (const listing of prod.listings) {
          stmt.run(
            prod.name,
            prod.brand,
            prod.category,
            prod.ram,
            prod.storage,
            prod.processor,
            listing.price,
            listing.rating,
            listing.seller,
            listing.website,
            listing.deliveryDays,
            listing.warranty,
            prod.image_url
          );
        }
      }
    })();
    console.log('[SQLite DB] Successfully seeded SQLite database with 40+ items!');
  }

  // ================= USER METHODS =================
  public getUsers() { return this.data.users; }
  public findUserById(id: string) { return this.data.users.find(u => u.id === id); }
  public findUserByEmail(email: string) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  
  public async createUser(user: Omit<User, 'id' | 'createdAt'>, passwordPlain: string): Promise<User> {
    const id = Math.random().toString(36).substring(2, 11);
    const createdAt = new Date().toISOString();
    const newUser: User = { ...user, id, createdAt };
    
    const hash = await bcrypt.hash(passwordPlain, 10);
    
    this.data.users.push(newUser);
    this.data.passwords[id] = hash;
    this.save();
    return newUser;
  }

  public async verifyPassword(userId: string, passwordPlain: string): Promise<boolean> {
    const hash = this.data.passwords[userId];
    if (!hash) return false;
    return bcrypt.compare(passwordPlain, hash);
  }

  public async updateUserPassword(userId: string, passwordPlain: string) {
    const hash = await bcrypt.hash(passwordPlain, 10);
    this.data.passwords[userId] = hash;
    this.save();
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  public deleteUser(id: string) {
    this.data.users = this.data.users.filter(u => u.id !== id);
    delete this.data.passwords[id];
    this.save();
  }

  // ================= SQLITE PRODUCT METHODS =================
  private mapRowsToProducts(rows: any[]): Product[] {
    const grouped: Record<string, any[]> = {};
    for (const row of rows) {
      const name = row.product_name;
      if (!grouped[name]) {
        grouped[name] = [];
      }
      grouped[name].push(row);
    }

    const products: Product[] = [];
    for (const [name, listings] of Object.entries(grouped)) {
      const first = listings[0];
      const id = 'prod_' + Buffer.from(name).toString('hex').substring(0, 10);
      
      const prices = listings.map(listing => {
        const plat = listing.website.toLowerCase();
        const isUS = ['bestbuy', 'ebay', 'walmart'].includes(plat);
        const currency = isUS ? 'USD' : 'INR';
        return {
          platform: plat,
          price: listing.price,
          currency,
          url: `https://www.${plat.replace(/\s+/g, '')}.com/search?q=${encodeURIComponent(name)}`,
          discount: Math.round(Math.random() * 15),
          sellerRating: listing.rating || 4.5,
          deliveryTime: listing.delivery_days === 1 ? 'Tomorrow' : `${listing.delivery_days} Days`,
          returnPolicy: plat === 'flipkart' ? '7 Days Replacement' : '30 Days Return',
          warranty: listing.warranty || '1 Year Brand Warranty',
          shippingCost: 0,
          inStock: true,
          lastUpdated: new Date().toISOString()
        };
      });

      products.push({
        id,
        name: first.product_name,
        brand: first.brand,
        description: `Premium comparative deal sheet for the ${first.product_name}. Powered by AI Price Comparison Agent with real-time merchant listing updates.`,
        category: first.category,
        specifications: {
          ram: first.ram || undefined,
          storage: first.storage || undefined,
          processor: first.processor || undefined,
        },
        prices,
        averageRating: Number((listings.reduce((sum, item) => sum + item.rating, 0) / listings.length).toFixed(1)),
        totalReviews: Math.round(50 + listings.length * 30),
        images: first.image_url ? [first.image_url] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return products;
  }

  public getProducts(): Product[] {
    try {
      const rows = this.sqlite.prepare('SELECT * FROM products').all() as any[];
      return this.mapRowsToProducts(rows);
    } catch (e) {
      console.error('[SQLite DB] Error fetching products:', e);
      return [];
    }
  }

  public findProductById(id: string): Product | undefined {
    try {
      const all = this.getProducts();
      return all.find(p => p.id === id);
    } catch (e) {
      console.error('[SQLite DB] Error finding product by id:', e);
      return undefined;
    }
  }
  
  public findProducts(filter: (p: Product) => boolean): Product[] {
    return this.getProducts().filter(filter);
  }

  public searchProducts(q: string, category?: string, brand?: string): Product[] {
    try {
      let sql = 'SELECT * FROM products WHERE 1=1';
      const params: any[] = [];
      
      if (q) {
        sql += ' AND (product_name LIKE ? OR brand LIKE ? OR category LIKE ? OR processor LIKE ?)';
        const queryParam = `%${q}%`;
        params.push(queryParam, queryParam, queryParam, queryParam);
      }
      if (category) {
        sql += ' AND category LIKE ?';
        params.push(`%${category}%`);
      }
      if (brand) {
        sql += ' AND brand LIKE ?';
        params.push(`%${brand}%`);
      }
      
      const rows = this.sqlite.prepare(sql).all(params) as any[];
      return this.mapRowsToProducts(rows);
    } catch (e) {
      console.error('[SQLite DB] Error searching products from SQLite:', e);
      return [];
    }
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const stmt = this.sqlite.prepare(`
      INSERT INTO products (
        product_name, brand, category, ram, storage, processor,
        price, rating, seller, website, delivery_days, warranty, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const ram = product.specifications?.ram || '';
    const storage = product.specifications?.storage || '';
    const processor = product.specifications?.processor || '';
    const rating = product.averageRating || 4.5;
    const image_url = product.images?.[0] || '';

    if (product.prices && product.prices.length > 0) {
      for (const priceObj of product.prices) {
        stmt.run(
          product.name,
          product.brand,
          product.category,
          ram,
          storage,
          processor,
          priceObj.price,
          priceObj.sellerRating || rating,
          priceObj.platform === 'amazon' ? 'Appario' : 'Retailer',
          priceObj.platform, // website
          priceObj.deliveryTime.toLowerCase().includes('tomorrow') ? 1 : 3,
          priceObj.warranty || '1 Year Brand Warranty',
          image_url
        );
      }
    } else {
      stmt.run(
        product.name,
        product.brand,
        product.category,
        ram,
        storage,
        processor,
        45000,
        rating,
        'Direct Seller',
        'Amazon',
        2,
        '1 Year Warranty',
        image_url
      );
    }

    const rows = this.sqlite.prepare('SELECT * FROM products WHERE product_name = ?').all(product.name) as any[];
    const mapped = this.mapRowsToProducts(rows);
    return mapped[0];
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const prod = this.findProductById(id);
    if (!prod) return null;

    if (updates.prices) {
      this.sqlite.prepare('DELETE FROM products WHERE product_name = ?').run(prod.name);
      
      const stmt = this.sqlite.prepare(`
        INSERT INTO products (
          product_name, brand, category, ram, storage, processor,
          price, rating, seller, website, delivery_days, warranty, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const ram = prod.specifications?.ram || '';
      const storage = prod.specifications?.storage || '';
      const processor = prod.specifications?.processor || '';
      const rating = prod.averageRating || 4.5;
      const image_url = prod.images?.[0] || '';

      for (const priceObj of updates.prices) {
        stmt.run(
          prod.name,
          prod.brand,
          prod.category,
          ram,
          storage,
          processor,
          priceObj.price,
          priceObj.sellerRating || rating,
          priceObj.platform === 'amazon' ? 'Appario' : 'Retailer',
          priceObj.platform, // website
          priceObj.deliveryTime.toLowerCase().includes('tomorrow') ? 1 : 3,
          priceObj.warranty || '1 Year Brand Warranty',
          image_url
        );
      }
    }

    return this.findProductById(id);
  }

  public deleteProduct(id: string) {
    const prod = this.findProductById(id);
    if (prod) {
      this.sqlite.prepare('DELETE FROM products WHERE product_name = ?').run(prod.name);
    }
  }

  // ================= SEARCH HISTORY =================
  public getSearchHistory(userId?: string) {
    if (userId) {
      return this.data.searchHistories
        .filter(sh => sh.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return this.data.searchHistories;
  }

  public createSearchHistory(sh: Omit<SearchHistory, 'id' | 'timestamp'>): SearchHistory {
    const id = 'sh_' + Math.random().toString(36).substring(2, 11);
    const timestamp = new Date().toISOString();
    const newSh: SearchHistory = { ...sh, id, timestamp };
    this.data.searchHistories.push(newSh);
    this.save();
    return newSh;
  }

  public deleteSearchHistoryItem(id: string, userId: string) {
    this.data.searchHistories = this.data.searchHistories.filter(sh => !(sh.id === id && sh.userId === userId));
    this.save();
  }

  // ================= WISHLIST METHODS =================
  public getWishlistByUserId(userId: string): Wishlist {
    let wl = this.data.wishlists.find(w => w.userId === userId);
    if (!wl) {
      const id = 'wl_' + Math.random().toString(36).substring(2, 11);
      const now = new Date().toISOString();
      wl = { id, userId, products: [], createdAt: now, updatedAt: now };
      this.data.wishlists.push(wl);
      this.save();
    }
    return wl;
  }

  public addToWishlist(userId: string, productId: string, notes?: string): Wishlist {
    const wl = this.getWishlistByUserId(userId);
    const existing = wl.products.find(p => p.productId === productId);
    if (!existing) {
      wl.products.push({ productId, addedAt: new Date().toISOString(), notes });
      wl.updatedAt = new Date().toISOString();
      this.save();
    }
    return wl;
  }

  public removeFromWishlist(userId: string, productId: string): Wishlist {
    const wl = this.getWishlistByUserId(userId);
    wl.products = wl.products.filter(p => p.productId !== productId);
    wl.updatedAt = new Date().toISOString();
    this.save();
    return wl;
  }

  // ================= PRICE ALERTS =================
  public getPriceAlerts(userId?: string) {
    if (userId) {
      return this.data.priceAlerts.filter(pa => pa.userId === userId);
    }
    return this.data.priceAlerts;
  }

  public createPriceAlert(pa: Omit<PriceAlert, 'id' | 'status' | 'notified' | 'createdAt'>): PriceAlert {
    const id = 'pa_' + Math.random().toString(36).substring(2, 11);
    const newPa: PriceAlert = {
      ...pa,
      id,
      status: 'active',
      notified: false,
      createdAt: new Date().toISOString()
    };
    this.data.priceAlerts.push(newPa);
    this.save();
    return newPa;
  }

  public updatePriceAlert(id: string, updates: Partial<PriceAlert>): PriceAlert | null {
    const idx = this.data.priceAlerts.findIndex(pa => pa.id === id);
    if (idx === -1) return null;
    this.data.priceAlerts[idx] = { ...this.data.priceAlerts[idx], ...updates };
    this.save();
    return this.data.priceAlerts[idx];
  }

  public deletePriceAlert(id: string) {
    this.data.priceAlerts = this.data.priceAlerts.filter(pa => pa.id !== id);
    this.save();
  }

  // ================= USER ACTIVITIES =================
  public logActivity(userId: string, action: UserActivity['action'], details: Record<string, any>) {
    const id = 'act_' + Math.random().toString(36).substring(2, 11);
    const newAct: UserActivity = {
      id,
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    this.data.userActivities.push(newAct);
    this.save();
    return newAct;
  }

  public getActivities() {
    return this.data.userActivities;
  }
}

export const db = new LocalDatabase();
