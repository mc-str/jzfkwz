import { getTodayStr, getYesterdayStr, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    
    try {
        const today = getTodayStr();
        const yesterday = getYesterdayStr();
        
        const totalResult = await env.DB.prepare('SELECT SUM(views) as total FROM stats').first();
        const todayResult = await env.DB.prepare('SELECT views FROM stats WHERE date = ?').bind(today).first();
        const yesterdayResult = await env.DB.prepare('SELECT views FROM stats WHERE date = ?').bind(yesterday).first();
        
        return new Response(JSON.stringify({
            totalViews: totalResult?.total || 0,
            todayViews: todayResult?.views || 0,
            yesterdayViews: yesterdayResult?.views || 0
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