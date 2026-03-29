import { getConfig, setConfig, verifyAdmin, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { request, env } = context;
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    try {
        const { auth, config } = await request.json();
        if (!verifyAdmin(auth, env)) {
            return new Response(JSON.stringify({ error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }

        // 合并现有配置，避免覆盖未管理的字段（如免责声明）
        const current = await getConfig(env.DATA_KV);
        const newConfig = { ...current, ...config };
        await setConfig(env.DATA_KV, newConfig);
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}