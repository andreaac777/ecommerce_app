# Cambio: Rutas de Productos Públicas

**Fecha:** 2026-02-24
**Solicitado por:** Jair (Web Frontend)
**Pendiente revisión de:** Andrea (Backend)

---

## ¿Qué se cambió?

En `backend/src/routes/product.routes.js` se quitó `protectRoute` de los dos endpoints GET de productos:

```js
// ANTES (requería autenticación):
router.get("/", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProductById);

// DESPUÉS (acceso público):
router.get("/", getAllProducts);
router.get("/:id", getProductById);
```

El cambio se aplicó en:
- `D:\1_donpalitojr\ecommerce_app\backend\src\routes\product.routes.js` ← repo de Andrea
- `D:\1_donpalitojr\donpalitojrweb\backend\src\routes\product.routes.js` ← repo de Jair (ya estaba así)

---

## ¿Por qué?

La web (`donpalitojrweb`) permite explorar el catálogo y ver detalle de productos sin necesidad de estar logueado (experiencia de vitrina pública). Con `protectRoute` activo, los usuarios no logueados recibían un **401 Unauthorized** y el catálogo no cargaba.

Mobile no se ve afectado porque su flujo de app requiere login antes de acceder a cualquier pantalla — la restricción la maneja la app, no la API.

---

## Impacto

| Cliente | Comportamiento anterior | Comportamiento nuevo |
|---------|------------------------|----------------------|
| Web (sin login) | 401 → catálogo vacío | ✅ Carga productos normalmente |
| Web (con login) | Cargaba normal | ✅ Sin cambios |
| Mobile | Siempre logueado | ✅ Sin cambios |
| Admin | Usa rutas admin separadas | ✅ Sin cambios |

---

## Lo que SÍ sigue requiriendo autenticación

Todas las demás operaciones siguen protegidas con `protectRoute`:
- Carrito (GET/POST/PUT/DELETE `/api/cart`)
- Órdenes (GET `/api/orders`)
- Wishlist (GET/POST/DELETE `/api/users/wishlist`)
- Direcciones (GET/POST/PUT/DELETE `/api/users/addresses`)
- Perfil de usuario (GET/PUT `/api/users/profile`)
- Cupones (POST `/api/coupons/validate`)
- Pagos (POST `/api/payment/*`)

---

## Para revertir (si se decide mantener auth en productos)

Si en producción se quiere requerir login para ver productos:

```js
router.get("/", protectRoute, getAllProducts);
router.get("/:id", protectRoute, getProductById);
```

Y en el web, mostrar un "teaser" con login gate antes de mostrar precios/detalles.
