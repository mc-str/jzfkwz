import { getProducts, setProducts, verifyAdmin, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { request, params, env } = context;
    const { id } = params;
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    const { auth } = await request.json().catch(() => ({}));
    if (!verifyAdmin(auth, env)) {
        return new Response(JSON.stringify({ error: '未授权' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    const products = await getProducts(env.DATA_KV);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        return new Response(JSON.stringify({ error: '产品不存在' }), { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    if (request.method === 'PUT') {
        const { product } = await request.json();
        products[index] = { ...products[index], ...product, id };
        await setProducts(env.DATA_KV, products);
        return new Response(JSON.stringify({ success: true, product: products[index] }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
    if (request.method === 'DELETE') {
        products.splice(index, 1);
        await setProducts(env.DATA_KV, products);
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
    return new Response('Method Not Allowed', { status: 405 });
}