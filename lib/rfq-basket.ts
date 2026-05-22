'use client';

/**
 * Lightweight RFQ basket — persists in localStorage so the customer can
 * collect parts across the catalog and submit them as a single RFQ.
 *
 * Stored shape: BasketItem[]. We deliberately don't keep any pricing,
 * any user identifier, or any session token — just the parts the user
 * has flagged for quote. Cleared after a successful submission.
 */

export type BasketItem = {
  id: string;
  slug?: string;
  name: string;
  brand?: string;
  partNumber?: string;
  image?: string;
  quantity: number;
  addedAt: number;
};

const KEY = 'lm_rfq_basket_v1';
const EVENT = 'lm:basket-changed';

function read(): BasketItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: BasketItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore quota errors */
  }
}

export function getBasket(): BasketItem[] {
  return read();
}

export function addToBasket(item: Omit<BasketItem, 'addedAt'>): BasketItem[] {
  const items = read();
  const existing = items.findIndex((it) => it.id === item.id);
  if (existing >= 0) {
    items[existing] = { ...items[existing], quantity: items[existing].quantity + item.quantity };
  } else {
    items.push({ ...item, addedAt: Date.now() });
  }
  write(items);
  return items;
}

export function updateQuantity(id: string, quantity: number): BasketItem[] {
  const items = read();
  const i = items.findIndex((it) => it.id === id);
  if (i >= 0) {
    if (quantity <= 0) items.splice(i, 1);
    else items[i] = { ...items[i], quantity };
  }
  write(items);
  return items;
}

export function removeFromBasket(id: string): BasketItem[] {
  const items = read().filter((it) => it.id !== id);
  write(items);
  return items;
}

export function clearBasket() {
  write([]);
}

export function onBasketChange(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}
