import { getStats, getTodayStr, getYesterdayStr, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    const stats = await getStats(env.DATA_KV);
    const today = getTodayStr();
    return new Response(JSON.stringify({
        totalViews: stats.totalViews,
        todayViews: stats.daily[today] || 0,
        yesterdayViews: stats.daily[getYesterdayStr()] || 0
    }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}