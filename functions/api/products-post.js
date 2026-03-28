import { getProducts, setProducts, verifyAdmin, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { request, env } = context;
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    try {
        const { auth, product } = await request.json();
        if (!verifyAdmin(auth, env)) {
            return new Response(JSON.stringify({ error: '未授权' }), { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
        const products = await getProducts(env.DATA_KV);
        const newId = Date.now().toString();
        const newProduct = { id: newId, ...product, isReleased: product.isReleased !== undefined ? product.isReleased : true };
        products.push(newProduct);
        await setProducts(env.DATA_KV, products);
        return new Response(JSON.stringify({ success: true, product: newProduct }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
}