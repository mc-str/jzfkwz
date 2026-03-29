import { verifyAdmin, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { request, env } = context;
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    try {
        const { auth, config } = await request.json();
        
        if (!verifyAdmin(auth, env)) {
            return new Response(JSON.stringify({ error: '未授权' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
        
        // 更新配置
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.site.title), 'site_title').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.site.subtitle), 'site_subtitle').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.contacts.groupLink), 'group_link').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.contacts.developerLink), 'developer_link').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.footer.icpLink), 'icp_link').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.footer.icpText), 'icp_text').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.footer.copyright), 'copyright').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.rewards.wechatLabel), 'wechat_label').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.rewards.wechatNote), 'wechat_note').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.rewards.alipayLabel), 'alipay_label').run();
        await env.DB.prepare('UPDATE config SET value = ? WHERE key = ?').bind(JSON.stringify(config.rewards.alipayNote), 'alipay_note').run();
        
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