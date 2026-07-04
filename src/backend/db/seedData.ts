/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SeedProduct {
  name: string;
  brand: string;
  category: string;
  ram: string;
  storage: string;
  processor: string;
  image_url: string;
  listings: {
    website: string;
    price: number;
    rating: number;
    seller: string;
    deliveryDays: number;
    warranty: string;
  }[];
}

export const seedProductsData: SeedProduct[] = [
  // ================= LAPTOPS =================
  {
    name: "HP Spectre x360 14",
    brand: "HP",
    category: "Laptops",
    ram: "16 GB",
    storage: "1 TB SSD",
    processor: "Intel Core Ultra 7",
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80",
    listings: [
      { website: "Amazon", price: 149999, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 152999, rating: 4.6, seller: "OmniTechRetail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 147999, rating: 4.5, seller: "Reliance Retail", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 148900, rating: 4.5, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "HP Pavilion 15",
    brand: "HP",
    category: "Laptops",
    ram: "8 GB",
    storage: "512 GB SSD",
    processor: "AMD Ryzen 5 5500U",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    listings: [
      { website: "Amazon", price: 49999, rating: 4.3, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 48999, rating: 4.2, seller: "Flashtech", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 51999, rating: 4.4, seller: "Reliance Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 49500, rating: 4.3, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "HP Victus 16 Gaming",
    brand: "HP",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i5-13500H",
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
    listings: [
      { website: "Amazon", price: 68999, rating: 4.4, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 67499, rating: 4.3, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 69999, rating: 4.2, seller: "Reliance Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 68500, rating: 4.3, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "HP Envy x360",
    brand: "HP",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i7-1355U",
    image_url: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=500&q=80",
    listings: [
      { website: "Amazon", price: 79999, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 78499, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 81999, rating: 4.5, seller: "Reliance Retail", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 79500, rating: 4.4, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "HP Chromebook 14",
    brand: "HP",
    category: "Laptops",
    ram: "4 GB",
    storage: "64 GB eMMC",
    processor: "Intel Celeron N4500",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    listings: [
      { website: "Amazon", price: 23999, rating: 4.1, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 22999, rating: 4.0, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 24999, rating: 4.2, seller: "Reliance Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 23500, rating: 4.1, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i7-1360P",
    image_url: "https://images.unsplash.com/photo-1593642702821-c8da6396462b?w=500&q=80",
    listings: [
      { website: "Amazon", price: 114999, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "2 Years Warranty" },
      { website: "Flipkart", price: 117999, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "2 Years Warranty" },
      { website: "Reliance Digital", price: 112999, rating: 4.6, seller: "Reliance Retail", deliveryDays: 3, warranty: "2 Years Warranty" },
      { website: "Croma", price: 113500, rating: 4.5, seller: "Croma Retail", deliveryDays: 2, warranty: "2 Years Warranty" }
    ]
  },
  {
    name: "Dell XPS 15",
    brand: "Dell",
    category: "Laptops",
    ram: "32 GB",
    storage: "1 TB SSD",
    processor: "Intel Core i9-13900H",
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80",
    listings: [
      { website: "Amazon", price: 219999, rating: 4.6, seller: "Appario Retail", deliveryDays: 2, warranty: "2 Years Warranty" },
      { website: "Flipkart", price: 224999, rating: 4.5, seller: "SellersOnline", deliveryDays: 3, warranty: "2 Years Warranty" },
      { website: "Croma", price: 218500, rating: 4.6, seller: "Croma Retail", deliveryDays: 2, warranty: "2 Years Warranty" }
    ]
  },
  {
    name: "Dell Inspiron 15",
    brand: "Dell",
    category: "Laptops",
    ram: "8 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i3-1215U",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    listings: [
      { website: "Amazon", price: 37999, rating: 4.2, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 36999, rating: 4.1, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Reliance Digital", price: 38999, rating: 4.3, seller: "Reliance Retail", deliveryDays: 3, warranty: "1 Year Warranty" },
      { website: "Croma", price: 37500, rating: 4.2, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Dell G15 Gaming",
    brand: "Dell",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "AMD Ryzen 7 7840HS",
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
    listings: [
      { website: "Amazon", price: 79999, rating: 4.4, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 78499, rating: 4.3, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Warranty" },
      { website: "Reliance Digital", price: 82999, rating: 4.5, seller: "Reliance Retail", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Croma", price: 79500, rating: 4.4, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Apple MacBook Air M2",
    brand: "Apple",
    category: "Laptops",
    ram: "8 GB",
    storage: "256 GB SSD",
    processor: "Apple M2",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    listings: [
      { website: "Amazon", price: 84900, rating: 4.8, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 82999, rating: 4.7, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 83900, rating: 4.8, seller: "Reliance Retail", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 83900, rating: 4.8, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple MacBook Pro 14 M3",
    brand: "Apple",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Apple M3",
    image_url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&q=80",
    listings: [
      { website: "Amazon", price: 154900, rating: 4.9, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 152900, rating: 4.8, seller: "SuperComNet", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 153900, rating: 4.9, seller: "Reliance Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 153900, rating: 4.9, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Lenovo ThinkPad T14",
    brand: "Lenovo",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i5-1335U",
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80",
    listings: [
      { website: "Amazon", price: 92999, rating: 4.6, seller: "Appario Retail", deliveryDays: 2, warranty: "3 Years Warranty" },
      { website: "Flipkart", price: 94999, rating: 4.5, seller: "SellersOnline", deliveryDays: 3, warranty: "3 Years Warranty" },
      { website: "Croma", price: 91900, rating: 4.6, seller: "Croma Retail", deliveryDays: 2, warranty: "3 Years Warranty" }
    ]
  },
  {
    name: "Lenovo Yoga 7i",
    brand: "Lenovo",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i7-1360P",
    image_url: "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=500&q=80",
    listings: [
      { website: "Amazon", price: 84999, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 83499, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Reliance Digital", price: 86999, rating: 4.5, seller: "Reliance Retail", deliveryDays: 3, warranty: "1 Year Warranty" },
      { website: "Croma", price: 84500, rating: 4.4, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Asus ROG Zephyrus G14",
    brand: "Asus",
    category: "Laptops",
    ram: "16 GB",
    storage: "1 TB SSD",
    processor: "AMD Ryzen 9 7940HS",
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
    listings: [
      { website: "Amazon", price: 139999, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 137499, rating: 4.6, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Croma", price: 138500, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Asus Zenbook 14",
    brand: "Asus",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i5-1340P",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    listings: [
      { website: "Amazon", price: 72999, rating: 4.4, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 71499, rating: 4.3, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Warranty" },
      { website: "Reliance Digital", price: 74999, rating: 4.4, seller: "Reliance Retail", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Croma", price: 72500, rating: 4.3, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Acer Predator Helios 16",
    brand: "Acer",
    category: "Laptops",
    ram: "16 GB",
    storage: "1 TB SSD",
    processor: "Intel Core i7-13700HX",
    image_url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
    listings: [
      { website: "Amazon", price: 144999, rating: 4.6, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 142499, rating: 4.5, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Warranty" },
      { website: "Croma", price: 143500, rating: 4.6, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Acer Aspire 5",
    brand: "Acer",
    category: "Laptops",
    ram: "8 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i5-1235U",
    image_url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80",
    listings: [
      { website: "Amazon", price: 44999, rating: 4.2, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 43999, rating: 4.1, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Reliance Digital", price: 46999, rating: 4.3, seller: "Reliance Retail", deliveryDays: 3, warranty: "1 Year Warranty" },
      { website: "Croma", price: 44500, rating: 4.2, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Samsung Galaxy Book 4",
    brand: "Samsung",
    category: "Laptops",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "Intel Core i5-1335U",
    image_url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80",
    listings: [
      { website: "Amazon", price: 69999, rating: 4.4, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 68499, rating: 4.3, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 71999, rating: 4.5, seller: "Reliance Retail", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 69500, rating: 4.4, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" }
    ]
  },

  // ================= MOBILE PHONES =================
  {
    name: "Apple iPhone 15 Pro",
    brand: "Apple",
    category: "Mobile Phones",
    ram: "8 GB",
    storage: "128 GB",
    processor: "A17 Pro",
    image_url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
    listings: [
      { website: "Amazon", price: 124900, rating: 4.8, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 122999, rating: 4.7, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 123900, rating: 4.8, seller: "Reliance Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 124500, rating: 4.8, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple iPhone 15",
    brand: "Apple",
    category: "Mobile Phones",
    ram: "6 GB",
    storage: "128 GB",
    processor: "A16 Bionic",
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80",
    listings: [
      { website: "Amazon", price: 71900, rating: 4.6, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 69999, rating: 4.5, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 70900, rating: 4.6, seller: "Reliance Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 71500, rating: 4.6, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple iPhone 15 Plus",
    brand: "Apple",
    category: "Mobile Phones",
    ram: "6 GB",
    storage: "128 GB",
    processor: "A16 Bionic",
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80",
    listings: [
      { website: "Amazon", price: 81900, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 79999, rating: 4.6, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 80900, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple iPhone 14",
    brand: "Apple",
    category: "Mobile Phones",
    ram: "6 GB",
    storage: "128 GB",
    processor: "A15 Bionic",
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80",
    listings: [
      { website: "Amazon", price: 61900, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 59999, rating: 4.4, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 60900, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "Mobile Phones",
    ram: "12 GB",
    storage: "256 GB",
    processor: "Snapdragon 8 Gen 3",
    image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    listings: [
      { website: "Amazon", price: 129999, rating: 4.8, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 124999, rating: 4.7, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 126999, rating: 4.8, seller: "Reliance Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 127900, rating: 4.8, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Mobile Phones",
    ram: "8 GB",
    storage: "128 GB",
    processor: "Exynos 2400",
    image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80",
    listings: [
      { website: "Amazon", price: 74999, rating: 4.5, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 72999, rating: 4.4, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 73999, rating: 4.5, seller: "Reliance Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 74500, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    category: "Mobile Phones",
    ram: "12 GB",
    storage: "256 GB",
    processor: "Snapdragon 8 Gen 2",
    image_url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    listings: [
      { website: "Amazon", price: 104999, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 99999, rating: 4.6, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 102900, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Samsung Galaxy A55",
    brand: "Samsung",
    category: "Mobile Phones",
    ram: "8 GB",
    storage: "128 GB",
    processor: "Exynos 1480",
    image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80",
    listings: [
      { website: "Amazon", price: 39999, rating: 4.3, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 38999, rating: 4.2, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 40999, rating: 4.4, seller: "Reliance Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 39500, rating: 4.3, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Google Pixel 8 Pro",
    brand: "Google",
    category: "Mobile Phones",
    ram: "12 GB",
    storage: "128 GB",
    processor: "Google Tensor G3",
    image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80",
    listings: [
      { website: "Amazon", price: 97999, rating: 4.5, seller: "Darshita Electronics", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 93999, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 95900, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "Mobile Phones",
    ram: "12 GB",
    storage: "256 GB",
    processor: "Snapdragon 8 Gen 3",
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80",
    listings: [
      { website: "Amazon", price: 64999, rating: 4.6, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 63999, rating: 4.5, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Croma", price: 64500, rating: 4.6, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "OnePlus 12R",
    brand: "OnePlus",
    category: "Mobile Phones",
    ram: "8 GB",
    storage: "128 GB",
    processor: "Snapdragon 8 Gen 2",
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80",
    listings: [
      { website: "Amazon", price: 39999, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 38999, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Croma", price: 39500, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Warranty" }
    ]
  },
  {
    name: "Nothing Phone 2",
    brand: "Nothing",
    category: "Mobile Phones",
    ram: "12 GB",
    storage: "256 GB",
    processor: "Snapdragon 8+ Gen 1",
    image_url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80",
    listings: [
      { website: "Amazon", price: 37999, rating: 4.4, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 35999, rating: 4.3, seller: "SellersOnline", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Croma", price: 36900, rating: 4.4, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Warranty" }
    ]
  },

  // ================= AUDIO / HEADPHONES =================
  {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio / Headphones",
    ram: "N/A",
    storage: "N/A",
    processor: "Sony V1",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    listings: [
      { website: "Amazon", price: 29990, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 28999, rating: 4.6, seller: "SoundWorld", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 29500, rating: 4.6, seller: "Reliance Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 29900, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Sony WF-1000XM5",
    brand: "Sony",
    category: "Audio / Headphones",
    ram: "N/A",
    storage: "N/A",
    processor: "Sony V2",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    listings: [
      { website: "Amazon", price: 19990, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 18999, rating: 4.4, seller: "SoundWorld", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 19500, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Bose QuietComfort Ultra",
    brand: "Bose",
    category: "Audio / Headphones",
    ram: "N/A",
    storage: "N/A",
    processor: "Custom ANC",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    listings: [
      { website: "Amazon", price: 35900, rating: 4.6, seller: "Bose India", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 34999, rating: 4.5, seller: "StereoHub", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 35500, rating: 4.6, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple AirPods Pro 2",
    brand: "Apple",
    category: "Audio / Headphones",
    ram: "N/A",
    storage: "N/A",
    processor: "H2 Chip",
    image_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    listings: [
      { website: "Amazon", price: 24900, rating: 4.8, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 23999, rating: 4.7, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 24500, rating: 4.8, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Sennheiser Momentum 4",
    brand: "Sennheiser",
    category: "Audio / Headphones",
    ram: "N/A",
    storage: "N/A",
    processor: "Sennheiser Custom",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    listings: [
      { website: "Amazon", price: 29990, rating: 4.6, seller: "Appario Retail", deliveryDays: 2, warranty: "2 Years Warranty" },
      { website: "Flipkart", price: 28999, rating: 4.5, seller: "SellersOnline", deliveryDays: 3, warranty: "2 Years Warranty" },
      { website: "Croma", price: 29500, rating: 4.6, seller: "Croma Retail", deliveryDays: 1, warranty: "2 Years Warranty" }
    ]
  },

  // ================= TABLETS =================
  {
    name: "Apple iPad Pro M4",
    brand: "Apple",
    category: "Tablets",
    ram: "8 GB",
    storage: "256 GB",
    processor: "Apple M4",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    listings: [
      { website: "Amazon", price: 99900, rating: 4.9, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 97900, rating: 4.8, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 98900, rating: 4.9, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple iPad Air M2",
    brand: "Apple",
    category: "Tablets",
    ram: "8 GB",
    storage: "128 GB",
    processor: "Apple M2",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    listings: [
      { website: "Amazon", price: 59900, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 57900, rating: 4.6, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 58900, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    category: "Tablets",
    ram: "12 GB",
    storage: "256 GB",
    processor: "Snapdragon 8 Gen 2",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    listings: [
      { website: "Amazon", price: 72999, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 71499, rating: 4.6, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 72500, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "OnePlus Pad",
    brand: "OnePlus",
    category: "Tablets",
    ram: "8 GB",
    storage: "128 GB",
    processor: "Dimensity 9000",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    listings: [
      { website: "Amazon", price: 37999, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 36999, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Croma", price: 37500, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Warranty" }
    ]
  },

  // ================= GAMING / CONSOLES =================
  {
    name: "Nintendo Switch OLED",
    brand: "Nintendo",
    category: "Gaming / Consoles",
    ram: "4 GB",
    storage: "64 GB",
    processor: "NVIDIA Custom",
    image_url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&q=80",
    listings: [
      { website: "Amazon", price: 31999, rating: 4.7, seller: "Importer Hub", deliveryDays: 2, warranty: "1 Year Seller Warranty" },
      { website: "Flipkart", price: 29999, rating: 4.6, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Seller Warranty" },
      { website: "eBay", price: 349, rating: 4.8, seller: "DirectShop", deliveryDays: 5, warranty: "No Warranty" }
    ]
  },
  {
    name: "Sony PlayStation 5 Slim",
    brand: "Sony",
    category: "Gaming / Consoles",
    ram: "16 GB GDDR6",
    storage: "1 TB SSD",
    processor: "AMD Zen 2 Custom",
    image_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    listings: [
      { website: "Amazon", price: 44990, rating: 4.8, seller: "Sony India", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 43999, rating: 4.7, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Reliance Digital", price: 44500, rating: 4.8, seller: "Reliance Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 44900, rating: 4.8, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Microsoft Xbox Series X",
    brand: "Microsoft",
    category: "Gaming / Consoles",
    ram: "16 GB GDDR6",
    storage: "1 TB SSD",
    processor: "AMD Zen 2 Custom",
    image_url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    listings: [
      { website: "Amazon", price: 52990, rating: 4.7, seller: "Appario Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 51999, rating: 4.6, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 52500, rating: 4.7, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "ASUS ROG Ally",
    brand: "ASUS",
    category: "Gaming / Consoles",
    ram: "16 GB",
    storage: "512 GB SSD",
    processor: "AMD Ryzen Z1 Extreme",
    image_url: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&q=80",
    listings: [
      { website: "Amazon", price: 59999, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 58999, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 59500, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },

  // ================= SMARTWATCHES =================
  {
    name: "Apple Watch Series 9",
    brand: "Apple",
    category: "Smartwatches",
    ram: "1 GB",
    storage: "64 GB",
    processor: "S9 SiP",
    image_url: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80",
    listings: [
      { website: "Amazon", price: 41900, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 39999, rating: 4.6, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 41500, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "Smartwatches",
    ram: "2 GB",
    storage: "16 GB",
    processor: "Exynos W930",
    image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
    listings: [
      { website: "Amazon", price: 29999, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 28499, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 29500, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Garmin Epix Gen 2",
    brand: "Garmin",
    category: "Smartwatches",
    ram: "N/A",
    storage: "32 GB",
    processor: "Garmin Custom",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    listings: [
      { website: "Amazon", price: 89990, rating: 4.8, seller: "Garmin India", deliveryDays: 2, warranty: "2 Years Brand Warranty" },
      { website: "Flipkart", price: 87999, rating: 4.6, seller: "SellersOnline", deliveryDays: 3, warranty: "2 Years Brand Warranty" },
      { website: "Croma", price: 88500, rating: 4.7, seller: "Croma Retail", deliveryDays: 2, warranty: "2 Years Brand Warranty" }
    ]
  },
  {
    name: "Fitbit Charge 6",
    brand: "Fitbit",
    category: "Smartwatches",
    ram: "N/A",
    storage: "N/A",
    processor: "Fitbit Custom",
    image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80",
    listings: [
      { website: "Amazon", price: 14999, rating: 4.3, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Warranty" },
      { website: "Flipkart", price: 13999, rating: 4.2, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Warranty" },
      { website: "Croma", price: 14500, rating: 4.3, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Warranty" }
    ]
  },

  // ================= SMART HOME =================
  {
    name: "Google Nest Hub Max",
    brand: "Google",
    category: "Smart Home / Speakers",
    ram: "N/A",
    storage: "N/A",
    processor: "Google Custom",
    image_url: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=500&q=80",
    listings: [
      { website: "Amazon", price: 18999, rating: 4.6, seller: "Darshita Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 17999, rating: 4.5, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 18500, rating: 4.6, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Amazon Echo Dot 5th Gen",
    brand: "Amazon",
    category: "Smart Home / Speakers",
    ram: "N/A",
    storage: "N/A",
    processor: "AZ2 Neural Edge",
    image_url: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80",
    listings: [
      { website: "Amazon", price: 5499, rating: 4.5, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 4999, rating: 4.4, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 5299, rating: 4.5, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple HomePod 2nd Gen",
    brand: "Apple",
    category: "Smart Home / Speakers",
    ram: "N/A",
    storage: "N/A",
    processor: "Apple S7",
    image_url: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&q=80",
    listings: [
      { website: "Amazon", price: 32900, rating: 4.7, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 31999, rating: 4.6, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 32500, rating: 4.7, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },

  // ================= CAMERAS & DRONES =================
  {
    name: "DJI Mini 4 Pro",
    brand: "DJI",
    category: "Cameras & Drones",
    ram: "N/A",
    storage: "N/A",
    processor: "DJI Flight Processor",
    image_url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&q=80",
    listings: [
      { website: "Amazon", price: 95000, rating: 4.8, seller: "Importer Hub", deliveryDays: 2, warranty: "1 Year Seller Warranty" },
      { website: "Flipkart", price: 92999, rating: 4.7, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Seller Warranty" },
      { website: "Croma", price: 94000, rating: 4.8, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "GoPro HERO12 Black",
    brand: "GoPro",
    category: "Cameras & Drones",
    ram: "N/A",
    storage: "N/A",
    processor: "GP2 Processor",
    image_url: "https://images.unsplash.com/photo-1565538810844-1e1192116767?w=500&q=80",
    listings: [
      { website: "Amazon", price: 37990, rating: 4.6, seller: "Appario Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" },
      { website: "Flipkart", price: 36499, rating: 4.5, seller: "SellersOnline", deliveryDays: 2, warranty: "1 Year Brand Warranty" },
      { website: "Croma", price: 37500, rating: 4.6, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Sony Alpha 7 IV Camera",
    brand: "Sony",
    category: "Cameras & Drones",
    ram: "N/A",
    storage: "Dual Slots",
    processor: "BIONZ XR",
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80",
    listings: [
      { website: "Amazon", price: 218990, rating: 4.9, seller: "Sony India", deliveryDays: 1, warranty: "2 Years Brand Warranty" },
      { website: "Flipkart", price: 215499, rating: 4.8, seller: "SellersOnline", deliveryDays: 2, warranty: "2 Years Brand Warranty" },
      { website: "Croma", price: 217900, rating: 4.9, seller: "Croma Retail", deliveryDays: 1, warranty: "2 Years Brand Warranty" }
    ]
  },

  // ================= VR & AR HEADSETS =================
  {
    name: "Meta Quest 3 VR Headset",
    brand: "Meta",
    category: "VR & AR Headsets",
    ram: "8 GB",
    storage: "128 GB",
    processor: "Snapdragon XR2 Gen 2",
    image_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&q=80",
    listings: [
      { website: "Amazon", price: 49999, rating: 4.7, seller: "Importer Hub", deliveryDays: 2, warranty: "1 Year Seller Warranty" },
      { website: "Flipkart", price: 48499, rating: 4.6, seller: "SellersOnline", deliveryDays: 3, warranty: "1 Year Seller Warranty" },
      { website: "Croma", price: 49500, rating: 4.7, seller: "Croma Retail", deliveryDays: 2, warranty: "1 Year Brand Warranty" }
    ]
  },
  {
    name: "Apple Vision Pro",
    brand: "Apple",
    category: "VR & AR Headsets",
    ram: "16 GB",
    storage: "256 GB",
    processor: "Apple M2 & R1",
    image_url: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&q=80",
    listings: [
      { website: "Amazon", price: 349900, rating: 4.9, seller: "Importer Hub", deliveryDays: 1, warranty: "1 Year Seller Warranty" },
      { website: "Flipkart", price: 345000, rating: 4.8, seller: "SuperComNet", deliveryDays: 2, warranty: "1 Year Seller Warranty" },
      { website: "Croma", price: 348900, rating: 4.9, seller: "Croma Retail", deliveryDays: 1, warranty: "1 Year Brand Warranty" }
    ]
  }
];
