import { corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    
    try {
        const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY id').all();
        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}