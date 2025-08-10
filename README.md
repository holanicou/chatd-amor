# Chat del Amor 💕

Un chat privado y romántico para parejas, construido con tecnologías modernas.

## Características ✨

- 💬 **Mensajes en tiempo real** - Chat instantáneo con tu pareja
- 🔒 **Totalmente privado** - Solo ustedes dos tienen acceso
- 📸 **Comparte fotos y archivos** - Envía imágenes y documentos
- 😍 **Reacciones con emojis** - Expresa tus sentimientos
- ✏️ **Edita y elimina mensajes** - Control total sobre tus mensajes
- 💡 **Indicador de escritura** - Saber cuando están escribiendo
- 🌙 **Modo oscuro/claro** - Interfaz cómoda para cualquier hora
- 📱 **Diseño responsivo** - Funciona en cualquier dispositivo

## Cómo registrarse y usar 🚀

### Paso 1: Iniciar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Paso 2: Registrarse (Tú)

1. Abre `http://localhost:3000` en tu navegador
2. Haz clic en "Crear Nuestro Chat"
3. Completa el formulario de registro:
   - **Nombre Completo**: Tu nombre real
   - **Usuario**: Un nombre de usuario único (ej: "mi_amor", "pareja_1")
   - **Email**: Opcional, puedes dejarlo en blanco
   - **Contraseña**: Una contraseña segura
   - **Confirmar Contraseña**: Repite la contraseña
4. Haz clic en "Crear Cuenta"

### Paso 3: Registrarse (Tu Pareja)

1. Comparte el enlace `http://localhost:3000` con tu pareja
2. Tu pareja debe hacer clic en "Crear Nuestro Chat"
3. Completa el formulario con sus datos:
   - **Nombre Completo**: Su nombre real
   - **Usuario**: Un nombre de usuario diferente al tuyo (ej: "mi_vida", "pareja_2")
   - **Email**: Opcional
   - **Contraseña**: Su contraseña
   - **Confirmar Contraseña**: Repite su contraseña
4. Haz clic en "Crear Cuenta"

### Paso 4: Iniciar sesión y chatear

1. Ambos pueden iniciar sesión en `http://localhost:3000/auth/login`
2. Usen sus nombres de usuario y contraseñas
3. ¡Listo! Ahora pueden chatear privadamente 💕

## Cómo desplegar la aplicación 🌐

### Opción 1: Vercel (Recomendado)

1. **Crea una cuenta en [Vercel](https://vercel.com)**
2. **Conecta tu repositorio de GitHub**
3. **Configura las variables de entorno** en Vercel:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=tu_secreto_muy_seguro_aqui
   NEXTAUTH_URL=https://tu-app.vercel.app
   ```
4. **Despliega** - Vercel lo hará automáticamente

### Opción 2: Railway

1. **Crea una cuenta en [Railway](https://railway.app)**
2. **Conecta tu repositorio de GitHub**
3. **Configura las variables de entorno**:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=tu_secreto_muy_seguro_aqui
   NEXTAUTH_URL=https://tu-app.railway.app
   ```
4. **Despliega** - Railway lo hará automáticamente

### Opción 3: Render

1. **Crea una cuenta en [Render](https://render.com)**
2. **Crea un nuevo Web Service**
3. **Conecta tu repositorio de GitHub**
4. **Configura las variables de entorno**:
   ```
   DATABASE_URL=file:./dev.db
   NEXTAUTH_SECRET=tu_secreto_muy_seguro_aqui
   NEXTAUTH_URL=https://tu-app.onrender.com
   ```
5. **Despliega** - Render lo hará automáticamente

## Variables de entorno necesarias 🔧

```env
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=tu_secreto_muy_seguro_aqui
NEXTAUTH_URL=http://localhost:3000  # Cambia esto por tu URL de producción
```

## Notas importantes 📝

- **Solo para 2 personas**: Este chat está diseñado para que solo tú y tu pareja puedan usarlo
- **Base de datos local**: Usa SQLite, que se almacena localmente
- **Seguridad**: Asegúrate de usar un `NEXTAUTH_SECRET` fuerte en producción
- **Privacidad**: Todos los mensajes y datos son privados y solo accesibles por ustedes dos

## Tecnologías utilizadas 🛠️

- **Frontend**: Next.js 15, React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Autenticación**: NextAuth.js
- **Base de datos**: Prisma ORM con SQLite
- **Tiempo real**: Socket.IO
- **Despliegue**: Vercel, Railway, Render

## Soporte 🆘

Si tienes algún problema o pregunta:
1. Revisa que hayas seguido todos los pasos correctamente
2. Asegúrate de que las variables de entorno estén configuradas
3. Verifica que ambos usuarios estén registrados correctamente

¡Disfruta de su chat privado! 💖