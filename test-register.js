const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testRegister() {
    try {
        console.log('🧪 测试注册功能...\n');
        
        // 测试1: 正常注册
        console.log('1️⃣ 测试正常注册...');
        const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
            account: 'testuser123',
            password: '123456'
        });
        console.log('✅ 注册成功:', registerResponse.data);
        
        // 测试2: 重复注册
        console.log('\n2️⃣ 测试重复注册...');
        try {
            await axios.post(`${API_BASE}/auth/register`, {
                account: 'testuser123',
                password: '123456'
            });
        } catch (error) {
            console.log('✅ 重复注册被正确拒绝:', error.response.data);
        }
        
        // 测试3: 登录测试
        console.log('\n3️⃣ 测试登录...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            account: 'testuser123',
            password: '123456'
        });
        console.log('✅ 登录成功:', loginResponse.data);
        
        console.log('\n🎉 所有测试通过！');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.response?.data || error.message);
    }
}

// 等待服务器启动
setTimeout(testRegister, 2000); 