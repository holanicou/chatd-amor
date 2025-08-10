#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Script de despliegue para Chat del Amor 💕');
console.log('=====================================\n');

// Función para generar un secreto aleatorio
function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Función para actualizar el archivo .env
function updateEnvFile(url) {
  const envContent = `DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=${generateSecret()}
NEXTAUTH_URL=${url}
`;
  
  fs.writeFileSync('.env', envContent);
  console.log('✅ Archivo .env actualizado');
}

// Función para crear package.json scripts
function updatePackageJson() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  // Agregar scripts útiles
  packageJson.scripts['deploy:vercel'] = 'vercel --prod';
  packageJson.scripts['deploy:railway'] = 'railway up';
  packageJson.scripts['setup'] = 'npm install && npm run db:push';
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ Scripts de despliegue agregados a package.json');
}

async function main() {
  console.log('Elige tu plataforma de despliegue:');
  console.log('1. Vercel (Recomendado)');
  console.log('2. Railway');
  console.log('3. Render');
  console.log('4. Salir\n');
  
  rl.question('Opción (1-4): ', async (answer) => {
    switch(answer) {
      case '1':
        console.log('\n📋 Instrucciones para Vercel:');
        console.log('1. Crea una cuenta en https://vercel.com');
        console.log('2. Conecta tu repositorio de GitHub');
        console.log('3. Configura estas variables de entorno en Vercel:');
        console.log('   - DATABASE_URL: file:./dev.db');
        console.log('   - NEXTAUTH_SECRET: ' + generateSecret());
        console.log('   - NEXTAUTH_URL: https://tu-app.vercel.app');
        console.log('4. Despliega automáticamente\n');
        
        rl.question('¿Quieres actualizar tu .env para desarrollo local? (s/n): ', (response) => {
          if (response.toLowerCase() === 's') {
            updateEnvFile('http://localhost:3000');
            updatePackageJson();
          }
          rl.close();
        });
        break;
        
      case '2':
        console.log('\n📋 Instrucciones para Railway:');
        console.log('1. Crea una cuenta en https://railway.app');
        console.log('2. Instala Railway CLI: npm install -g @railway/cli');
        console.log('3. Conecta tu repositorio: railway login');
        console.log('4. Inicializa proyecto: railway init');
        console.log('5. Configura variables de entorno:');
        console.log('   - DATABASE_URL: file:./dev.db');
        console.log('   - NEXTAUTH_SECRET: ' + generateSecret());
        console.log('   - NEXTAUTH_URL: https://tu-app.railway.app');
        console.log('6. Despliega: railway up\n');
        
        rl.question('¿Quieres actualizar tu .env para desarrollo local? (s/n): ', (response) => {
          if (response.toLowerCase() === 's') {
            updateEnvFile('http://localhost:3000');
            updatePackageJson();
          }
          rl.close();
        });
        break;
        
      case '3':
        console.log('\n📋 Instrucciones para Render:');
        console.log('1. Crea una cuenta en https://render.com');
        console.log('2. Crea un nuevo Web Service');
        console.log('3. Conecta tu repositorio de GitHub');
        console.log('4. Configura variables de entorno:');
        console.log('   - DATABASE_URL: file:./dev.db');
        console.log('   - NEXTAUTH_SECRET: ' + generateSecret());
        console.log('   - NEXTAUTH_URL: https://tu-app.onrender.com');
        console.log('5. Build Command: npm run build');
        console.log('6. Start Command: npm start');
        console.log('7. Despliega automáticamente\n');
        
        rl.question('¿Quieres actualizar tu .env para desarrollo local? (s/n): ', (response) => {
          if (response.toLowerCase() === 's') {
            updateEnvFile('http://localhost:3000');
            updatePackageJson();
          }
          rl.close();
        });
        break;
        
      case '4':
        console.log('\n¡Hasta luego! 💕');
        rl.close();
        break;
        
      default:
        console.log('\n❌ Opción no válida. Por favor elige 1-4.');
        rl.close();
    }
  });
}

main();