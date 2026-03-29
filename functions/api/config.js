import { corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    
    try {
        const config = {};
        const { results } = await env.DB.prepare('SELECT key, value FROM config').all();
        
        for (const row of results) {
            config[row.key] = JSON.parse(row.value);
        }
        
        return new Response(JSON.stringify({
            site: { title: config.site_title || '矩阵方块', subtitle: config.site_subtitle || '解锁创意方块 · 掌握美好艺术' },
            contacts: { groupLink: config.group_link || '', developerLink: config.developer_link || '' },
            footer: { icpLink: config.icp_link || '', icpText: config.icp_text || '', copyright: config.copyright || '' },
            rewards: { wechatLabel: config.wechat_label || '微信赞赏', wechatNote: config.wechat_note || '微信扫码支持', alipayLabel: config.alipay_label || '支付宝赞赏', alipayNote: config.alipay_note || '支付宝扫码支持' }
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}