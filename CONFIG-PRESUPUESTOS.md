# ⚙️ Configuración de Presupuestos en Panel Admin

## 🔧 Variable de Entorno Requerida

El Panel Admin necesita saber dónde está el servidor de Fuegos para llamar a las APIs de presupuestos.

### **Crear archivo `.env.local` en PanelAdmin**

Crea o edita `PanelAdmin/.env.local`:

```env
# Supabase (ya deberías tenerlas)
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase

# URL del servidor Fuegos (IMPORTANTE)
NEXT_PUBLIC_FUEGOS_API_URL=http://localhost:3000
```

**En producción:**
```env
NEXT_PUBLIC_FUEGOS_API_URL=https://fuegosdazur.com
```

---

## 🚀 Reiniciar Servidor

Después de crear/editar `.env.local`:

```bash
cd PanelAdmin

# Ctrl+C para detener si está corriendo

# Reiniciar
npm run dev
```

---

## ✅ Verificar que Funciona

1. Abre Panel Admin: http://localhost:3001
2. Ve a tab "Presupuestos"
3. Click en "Ver y Editar" en cualquier presupuesto
4. Click en "Vista Previa PDF"
5. Debería abrirse el PDF en nueva pestaña

---

## 🔍 Si Sigue Fallando

### **Verificar que Fuegos está corriendo:**

```bash
# En otra terminal
cd Fuegos
npm run dev

# Debe estar en: http://localhost:3000
```

### **Verificar la consola del navegador:**

Abre DevTools (F12) → Console

Deberías ver:
```
✅ PDF generado: https://...
```

Si ves errores, copia el mensaje completo.

---

## 📊 APIs que Usa el Panel Admin

El Panel Admin llama a estos endpoints en Fuegos:

- `POST /api/generate-budget-pdf` - Genera PDF
- `POST /api/update-budget` - Guarda cambios
- `POST /api/approve-budget` - Aprueba y envía

**Por eso necesita saber la URL del servidor Fuegos.**

---

## 🎯 Resumen

1. ✅ Crea `PanelAdmin/.env.local`
2. ✅ Agrega `NEXT_PUBLIC_FUEGOS_API_URL=http://localhost:3000`
3. ✅ Reinicia Panel Admin
4. ✅ Prueba generar PDF

---

*Creado: 25 de noviembre de 2025*

