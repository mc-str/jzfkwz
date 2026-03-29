import { getTodayStr, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    
    try {
        const today = getTodayStr();
        
        // 增加今日访问量
        await env.DB.prepare(`
            INSERT INTO stats (date, views) VALUES (?, 1)
            ON CONFLICT(date) DO UPDATE SET views = views + 1
        `).bind(today).run();
        
        // 获取最新统计
        const totalResult = await env.DB.prepare('SELECT SUM(views) as total FROM stats').first();
        const todayResult = await env.DB.prepare('SELECT views FROM stats WHERE date = ?').bind(today).first();
        
        return new Response(JSON.stringify({
            totalViews: totalResult?.total || 0,
            todayViews: todayResult?.views || 0,
            yesterdayViews: 0
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