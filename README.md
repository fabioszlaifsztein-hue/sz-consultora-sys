# SGI Platform — SZ Consultora

Sistema Integrado de Gestión | ISO 9001 · 14001 · 45001 · 50001 · 55001 · 39001

## Estructura del proyecto

```
sgi-netlify/
├── index.html          ← Entry point (requerido por Vite/Netlify)
├── vite.config.js      ← Configuración de Vite
├── package.json        ← Dependencias
├── netlify.toml        ← Configuración de Netlify (build + redirects)
├── public/
│   └── favicon.svg     ← Ícono de la app
└── src/
    ├── main.jsx        ← Punto de entrada React
    ├── index.css       ← Estilos globales
    └── App.jsx         ← Aplicación completa (toda la lógica)
```

## Desplegar en Netlify

### Opción A — Desde GitHub (recomendada)
1. Subí esta carpeta a un repositorio de GitHub
2. En Netlify → "Add new site" → "Import an existing project"
3. Conectá el repositorio
4. Netlify detecta el `netlify.toml` automáticamente
5. Click en "Deploy site"

### Opción B — Drag & Drop directo
1. En tu computadora, abrí una terminal dentro de esta carpeta
2. Ejecutá: `npm install && npm run build`
3. Esto genera la carpeta `dist/`
4. En Netlify → "Add new site" → "Deploy manually"
5. Arrastrá la carpeta `dist/` al área de drop

## Ejecutar localmente (desarrollo)

```bash
npm install
npm run dev
```
Abrí http://localhost:5173

## Credenciales de acceso (demo)

- **Email:** admin@empresa.com
- **Contraseña:** admin123
- **Perfil:** Administrador

Podés crear más usuarios desde el módulo "Usuarios y Accesos".

## Instalar como app en el celular (PWA)

Una vez desplegada en Netlify:
- **Android (Chrome):** Menú → "Agregar a pantalla de inicio"
- **iPhone (Safari):** Botón compartir → "Agregar a inicio"

## Personalización por cliente

Accedé a **Administración → Configuración / Marca** para cambiar:
- Nombre de la empresa
- Logo (cargá imagen)
- Color primario y secundario

Todos los cambios se guardan automáticamente en el navegador del cliente.
