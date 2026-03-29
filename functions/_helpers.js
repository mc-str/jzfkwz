// KV 键名
const PRODUCTS_KEY = 'products';
const STATS_KEY = 'stats';
const CONFIG_KEY = 'config';

// 产品操作
export async function getProducts(kv) {
    const data = await kv.get(PRODUCTS_KEY, 'json');
    return data || [];
}
export async function setProducts(kv, products) {
    await kv.put(PRODUCTS_KEY, JSON.stringify(products));
}

// 统计操作
export async function getStats(kv) {
    const data = await kv.get(STATS_KEY, 'json');
    return data || { totalViews: 0, daily: {} };
}
export async function setStats(kv, stats) {
    await kv.put(STATS_KEY, JSON.stringify(stats));
}

// 配置操作
export async function getConfig(kv) {
    const data = await kv.get(CONFIG_KEY, 'json');
    if (data) return data;
    // 默认配置（免责声明已固定，不再管理）
    return {
        site: { title: "矩阵方块", subtitle: "解锁创意方块 · 掌握美好艺术" },
        contacts: {
            groupLink: "https://qun.qq.com/universal-share/share?ac=1&authKey=0Fr6H805IgI3EAI4NnsxS3V%2B8UDXsUbhJ0JDTkNWHA%2FdZyG74QCyGKXTKPTkqFBT",
            developerLink: "https://qm.qq.com/q/sI7UfqUJFu"
        },
        footer: {
            icpLink: "https://icp.gov.moe/?keyword=20268983",
            icpText: "萌ICP备20268983号",
            copyright: "© 2026 #MCCBCOOM73"
        },
        rewards: {
            wechatQr: "./wechat_qr.png",
            alipayQr: "./alipay_qr.png",
            wechatLabel: "微信赞赏",
            alipayLabel: "支付宝赞赏",
            wechatNote: "微信扫码支持",
            alipayNote: "支付宝扫码支持"
        }
    };
}
export async function setConfig(kv, config) {
    await kv.put(CONFIG_KEY, JSON.stringify(config));
}

// 工具函数
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
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'admin123';
    return auth === ADMIN_PASSWORD;
}
export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};