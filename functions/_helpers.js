// KV 键名
const PRODUCTS_KEY = 'products';
const STATS_KEY = 'stats';

export async function getProducts(kv) {
    const data = await kv.get(PRODUCTS_KEY, 'json');
    return data || [];
}

export async function setProducts(kv, products) {
    await kv.put(PRODUCTS_KEY, JSON.stringify(products));
}

export async function getStats(kv) {
    const data = await kv.get(STATS_KEY, 'json');
    return data || { totalViews: 0, daily: {} };
}

export async function setStats(kv, stats) {
    await kv.put(STATS_KEY, JSON.stringify(stats));
}

export function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function verifyAdmin(auth, env) {
    // 默认密码 admin123，可通过环境变量 ADMIN_PASSWORD 覆盖
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'admin123';
    return auth === ADMIN_PASSWORD;
}

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};