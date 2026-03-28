import { getStats, setStats, getTodayStr, getYesterdayStr, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { env } = context;
    const stats = await getStats(env.DATA_KV);
    const today = getTodayStr();
    stats.totalViews = (stats.totalViews || 0) + 1;
    stats.daily[today] = (stats.daily[today] || 0) + 1;
    // 清理7天前的数据
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    for (const date in stats.daily) {
        if (new Date(date) < sevenDaysAgo) delete stats.daily[date];
    }
    await setStats(env.DATA_KV, stats);
    return new Response(JSON.stringify({
        totalViews: stats.totalViews,
        todayViews: stats.daily[today],
        yesterdayViews: stats.daily[getYesterdayStr()] || 0
    }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
}