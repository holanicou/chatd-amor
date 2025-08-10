const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRegistration() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Check if we can connect to the database
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test 2: Try to create a test user
    console.log('🔍 Creating test user...');
    
    const passwordHash = await bcrypt.hash('test123', 12);
    
    const user = await prisma.user.create({
      data: {
        username: 'test_user_' + Date.now(),
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        passwordHash,
        isOnline: false,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });
    
    console.log('✅ Test user created successfully:', user);
    
    // Test 3: Check if user exists
    console.log('🔍 Checking if user exists...');
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      }
    });
    
    console.log('✅ User found:', foundUser);
    
    // Clean up
    await prisma.user.delete({
      where: { id: user.id }
    });
    
    console.log('✅ Test user deleted');
    console.log('🎉 All tests passed! Registration should work.');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();