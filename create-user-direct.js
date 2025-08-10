const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDirectUser() {
  try {
    console.log('🔥 Creando usuario de ejemplo...');
    
    // Datos del usuario - puedes modificar estos valores
    const userData = {
      name: 'Usuario Principal',
      username: 'mi_amor_' + Date.now(),
      email: 'amor' + Date.now() + '@example.com',
      password: 'chat123'
    };
    
    console.log('📋 Datos del usuario a crear:');
    console.log(`   Nombre: ${userData.name}`);
    console.log(`   Usuario: ${userData.username}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Contraseña: ${userData.password}`);
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });
    
    if (existingUser) {
      console.log('❌ El usuario ya existe, intentando con otro username...');
      userData.username = 'mi_amor_' + Date.now() + '_2';
      userData.email = 'amor' + Date.now() + '_2@example.com';
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        name: userData.name,
        email: userData.email,
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
    
    console.log('\n🎉 ¡Usuario creado exitosamente!');
    console.log('📋 Datos para iniciar sesión:');
    console.log(`   👤 Usuario: ${user.username}`);
    console.log(`   🔑 Contraseña: ${userData.password}`);
    console.log(`   📝 Nombre: ${user.name}`);
    console.log(`   🆔 ID: ${user.id}`);
    
    console.log('\n💡 Ahora puedes:');
    console.log('   1. Iniciar sesión en http://localhost:3000/auth/login');
    console.log('   2. Usar los datos de arriba para entrar');
    console.log('   3. Crear otro usuario para tu pareja');
    
    // Crear segundo usuario para la pareja
    console.log('\n🔥 Creando segundo usuario para tu pareja...');
    
    const partnerData = {
      name: 'Mi Pareja',
      username: 'mi_pareja_' + Date.now(),
      email: 'pareja' + Date.now() + '@example.com',
      password: 'chat456'
    };
    
    const partnerPasswordHash = await bcrypt.hash(partnerData.password, 12);
    
    const partner = await prisma.user.create({
      data: {
        username: partnerData.username,
        name: partnerData.name,
        email: partnerData.email,
        passwordHash: partnerPasswordHash,
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
    
    console.log('\n🎉 ¡Usuario de pareja creado exitosamente!');
    console.log('📋 Datos para que tu pareja inicie sesión:');
    console.log(`   👤 Usuario: ${partner.username}`);
    console.log(`   🔑 Contraseña: ${partnerData.password}`);
    console.log(`   📝 Nombre: ${partner.name}`);
    console.log(`   🆔 ID: ${partner.id}`);
    
    console.log('\n💖 ¡Listo! Ahora ambos pueden chatear.');
    console.log('   Usa: http://localhost:3000/auth/login');
    console.log('   Ingresa con tus datos respectivos 💕');
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDirectUser();