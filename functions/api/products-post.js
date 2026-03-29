import { verifyAdmin, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { request, env } = context;
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    try {
        const { auth, product } = await request.json();
        
        if (!verifyAdmin(auth, env)) {
            return new Response(JSON.stringify({ error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
        
        const newId = Date.now().toString();
        
        await env.DB.prepare(`
            INSERT INTO products (id, name, desc, imageUrl, downloadUrl, version, size, isReleased)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            newId,
            product.name,
            product.desc || '',
            product.imageUrl || '',
            product.downloadUrl || '',
            product.version || 'v1.0',
            product.size || '1.00 MB',
            product.isReleased ? 1 : 0
        ).run();
        
        return new Response(JSON.stringify({ success: true, product: { ...product, id: newId } }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}