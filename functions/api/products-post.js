import { getProducts, setProducts, verifyAdmin, corsHeaders } from '../_helpers';

export async function onRequest(context) {
    const { request, env } = context;
    
    // 处理 OPTIONS 预检请求
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }
    
    try {
        // 解析请求体
        const body = await request.json();
        const { auth, product } = body;
        
        // 验证管理员权限
        if (!verifyAdmin(auth, env)) {
            return new Response(JSON.stringify({ error: '未授权，密码错误' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
        
        // 验证产品数据
        if (!product || !product.name) {
            return new Response(JSON.stringify({ error: '产品名称不能为空' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
        
        // 获取现有产品列表
        let products = await getProducts(env.DATA_KV);
        
        // 确保 products 是数组
        if (!Array.isArray(products)) {
            products = [];
        }
        
        // 生成新 ID（使用时间戳）
        const newId = Date.now().toString();
        
        // 创建新产品对象
        const newProduct = {
            id: newId,
            name: product.name,
            desc: product.desc || '',
            imageUrl: product.imageUrl || '',
            downloadUrl: product.downloadUrl || '',
            version: product.version || 'v1.0',
            size: product.size || '1.00 MB',
            isReleased: product.isReleased !== undefined ? product.isReleased : true
        };
        
        // 添加到列表
        products.push(newProduct);
        
        // 保存到 KV
        await setProducts(env.DATA_KV, products);
        
        // 返回成功响应
        return new Response(JSON.stringify({ 
            success: true, 
            product: newProduct,
            message: '保存成功',
            totalCount: products.length
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
        
    } catch (err) {
        console.error('products-post error:', err);
        return new Response(JSON.stringify({ 
            error: '服务器错误: ' + err.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
    }
}