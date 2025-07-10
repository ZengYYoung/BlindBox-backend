const { sequelize, User } = require('./models');

async function testDatabase() {
    try {
        // 同步数据库
        await sequelize.sync({ force: false });
        console.log('✅ 数据库同步成功');
        
        // 测试User表
        const userCount = await User.count();
        console.log(`📊 当前用户数量: ${userCount}`);
        
        // 测试创建用户
        const testUser = await User.create({
            account: 'testuser',
            password: 'hashedpassword',
            balance: 1000
        });
        console.log('✅ 测试用户创建成功:', testUser.account);
        
        // 清理测试数据
        await testUser.destroy();
        console.log('🧹 测试数据清理完成');
        
        console.log('🎉 数据库测试通过！');
    } catch (error) {
        console.error('❌ 数据库测试失败:', error);
    } finally {
        await sequelize.close();
    }
}

testDatabase(); 