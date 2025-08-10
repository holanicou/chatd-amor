# Instrucciones Rápidas - Chat del Amor 💕

## ¡Para usar AHORA mismo! 🚀

### 1. Inicia la aplicación
```bash
npm run dev
```

### 2. Regístrate (Tú)
- Ve a: http://localhost:3000
- Haz clic en "Crear Nuestro Chat"
- Llena tus datos:
  - Nombre: Tu nombre
  - Usuario: algo único (ej: "mi_amor")
  - Contraseña: una segura
- Haz clic en "Crear Cuenta"

### 3. Regístra a tu pareja
- Comparte http://localhost:3000 con tu pareja
- Ella debe hacer clic en "Crear Nuestro Chat"
- Llena sus datos:
  - Nombre: Su nombre
  - Usuario: algo diferente al tuyo (ej: "mi_vida")
  - Contraseña: su contraseña
- Haz clic en "Crear Cuenta"

### 4. ¡A chatear! 💕
- Ambos pueden entrar en http://localhost:3000/auth/login
- Usen sus usuarios y contraseñas
- ¡Listo! Ya pueden chatear privadamente

## Para desplegar en internet 🌐

### Opción más fácil: Vercel
1. Entra a https://vercel.com
2. Conecta tu cuenta de GitHub
3. Sube este proyecto a GitHub
4. En Vercel, importa tu repositorio
5. En Settings > Environment Variables, agrega:
   - `DATABASE_URL`: `file:./dev.db`
   - `NEXTAUTH_SECRET`: `cualquier-texto-seguro-aqui`
   - `NEXTAUTH_URL`: `https://tu-app.vercel.app`
6. Haz clic en Deploy

### Otra opción: Railway
1. Entra a https://railway.app
2. Conecta tu cuenta de GitHub
3. Sube este proyecto a GitHub
4. En Railway, crea nuevo proyecto y conecta tu repo
5. En Variables, agrega las mismas variables de entorno
6. Haz clic en Deploy

## ¿Necesitas ayuda? 🆘

- Si no puedes registrarte: asegúrate de que el usuario sea único
- Si no puedes entrar: verifica tu usuario y contraseña
- Si la página no carga: ejecuta `npm run dev` nuevamente

## Importante 📝

- Este chat es SOLO para 2 personas
- Todo es privado y seguro
- Pueden compartir fotos, archivos y mensajes
- Tiene reacciones con emojis 💖

¡Disfruta su chat privado! 💕