import { verifyAdmin, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { request, params, env } = context;
    const { id } = params;
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    const { auth } = await request.json().catch(() => ({}));
    if (!verifyAdmin(auth, env)) {
        return new Response(JSON.stringify({ error: '未授权' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
    
    try {
        if (request.method === 'PUT') {
            const { product } = await request.json();
            await env.DB.prepare(`
                UPDATE products SET 
                    name = ?, desc = ?, imageUrl = ?, downloadUrl = ?, 
                    version = ?, size = ?, isReleased = ?
                WHERE id = ?
            `).bind(
                product.name,
                product.desc || '',
                product.imageUrl || '',
                product.downloadUrl || '',
                product.version || '',
                product.size || '',
                product.isReleased ? 1 : 0,
                id
            ).run();
            
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
        
        if (request.method === 'DELETE') {
            await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
        
        return new Response('Method Not Allowed', { status: 405 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}