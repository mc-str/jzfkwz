import { getConfig, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    const config = await getConfig(env.DATA_KV);
    return new Response(JSON.stringify(config), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}