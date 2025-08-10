const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Creación de usuario para Chat del Amor 💕');
console.log('=====================================\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function createUser() {
  try {
    console.log('Por favor, ingresa tus datos:\n');
    
    const name = await askQuestion('📝 Nombre completo: ');
    const username = await askQuestion('👤 Usuario (debe ser único): ');
    const email = await askQuestion('📧 Email (opcional, presiona Enter para omitir): ');
    const password = await askQuestion('🔒 Contraseña: ');
    
    // Validar campos requeridos
    if (!name || !username || !password) {
      console.log('❌ Error: Nombre, usuario y contraseña son obligatorios');
      return;
    }
    
    console.log('\n🔍 Verificando si el usuario ya existe...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: email || undefined }
        ]
      }
    });
    
    if (existingUser) {
      console.log('❌ Error: El usuario o email ya existe');
      return;
    }
    
    console.log('🔐 Cifrando contraseña...');
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    console.log('💾 Creando usuario en la base de datos...');
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email: email || null,
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
    console.log('📋 Datos del usuario:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Usuario: ${user.username}`);
    console.log(`   Email: ${user.email || 'No proporcionado'}`);
    console.log(`   Creado: ${user.createdAt}`);
    
    console.log('\n💡 Ahora puedes:');
    console.log('   1. Iniciar sesión en http://localhost:3000/auth/login');
    console.log('   2. Compartir este enlace con tu pareja para que se registre');
    console.log('   3. ¡Comenzar a chatear! 💕');
    
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
    console.error('Detalles:', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createUser();