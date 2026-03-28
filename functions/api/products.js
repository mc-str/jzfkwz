import { getProducts, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    const products = await getProducts(env.DATA_KV);
    return new Response(JSON.stringify(products), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}