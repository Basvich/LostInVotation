# Contexto para agentes

## estructura de carpetas para aplicación

``` ruby
src/
└── app/
    │
    ├── core/                               # Servicios globales, singletons, infraestructura
    │   │
    │   ├── api/                            # Cliente API (interfaces + impls mock/real)
    │   │   ├── auth/                       # Submódulo de autenticación
    │   │   │   ├── auth.service.ts         # Interfaz o clase abstracta
    │   │   │   ├── auth.service.mock.ts    # Mock
    │   │   │   ├── auth.service.http.ts    # Implementación real
    │   │   │   └── index.ts
    │   │   │
    │   │   ├── api.service.ts              # Gateway genérico (opcional)
    │   │   └── index.ts
    │   │
    │   ├── services/                       # Servicios globales
    │   │   ├── session.service.ts          # Manejo de sesión/token
    │   │   ├── config.service.ts
    │   │   └── storage.service.ts          # Wrapper para local/session storage
    │   │
    │   ├── interceptors/                   # HttpInterceptors
    │   │   ├── auth.interceptor.ts
    │   │   ├── error.interceptor.ts
    │   │   └── logging.interceptor.ts
    │   │
    │   ├── guards/                         # Route guards
    │   │   └── auth.guard.ts
    │   │
    │   ├── models/                         # Modelos globales (si los hubiera)
    │   │   └── api-error.model.ts
    │   │
    │   └── core.module.ts                  # Solo importado en AppModule
    │
    ├── shared/                             # Reutilizable, agnóstico al negocio
    │   ├── models/                         # Modelos compartidos
    │   │   ├── user.model.ts
    │   │   └── product.model.ts
    │   │
    │   ├── enums/                          # Enums globales
    │   │   └── roles.enum.ts
    │   │
    │   ├── utils/                          # Funciones puras
    │   │   ├── date.util.ts
    │   │   └── string.util.ts
    │   │
    │   ├── components/                     # Componentes UI genéricos
    │   │   ├── button/
    │   │   ├── modal/
    │   │   └── spinner/
    │   │
    │   └── shared.module.ts
    │
    ├── features/                           # Módulos de negocio
    │   │
    │   ├── users/                          # Feature Users
    │   │   ├── components/                 # Componentes internos
    │   │   │   ├── user-list/
    │   │   │   └── user-detail/
    │   │   │
    │   │   ├── pages/                      # Páginas enrutables
    │   │   │   ├── users-page/
    │   │   │   └── user-detail-page/
    │   │   │
    │   │   ├── services/                   # Servicios del feature
    │   │   │   └── users.service.ts
    │   │   │
    │   │   ├── models/                     # Modelos específicos del feature
    │   │   │   └── user-filter.model.ts
    │   │   │
    │   │   ├── users-routing.module.ts
    │   │   └── users.module.ts
    │   │
    │   └── products/                       # Feature Products
    │       ├── components/
    │       ├── pages/
    │       ├── services/
    │       ├── models/
    │       ├── products-routing.module.ts
    │       └── products.module.ts
    │
    ├── app-routing.module.ts
    └── app.module.ts


```

🔹 `core/`

- Todo lo singleton y global (solo se importa una vez en AppModule).

- Ejemplos:

  - AuthService, ApiService, ErrorInterceptor, AuthGuard.

  - Configuración inicial de la app.

🔹 `shared/`

- Todo lo agnóstico a Angular (o reutilizable en varios features).

- Ejemplos:

  - Modelos (User, Product, Order).

  - Enums (UserRole, OrderStatus).

  - Helpers (formatDate, calculateTax).

  - Componentes UI genéricos (ButtonComponent, ModalComponent).

🔹 `features/`

- Cada dominio funcional de la app tiene su propio módulo (users, products, orders).

- Dentro de cada feature:

  - `components/`: piezas de UI internas, no enrutables.

  - `pages/`: componentes enrutables (lo que el router carga como una "pantalla").

  - `services/`: servicios específicos del feature.

  - `models/`: si son modelos solo usados en este módulo (si son globales → shared/models).

>✅ Regla de oro  
>`pages/` → enrutables (router)  
>`components/`  → piezas reutilizables dentro del feature  
>`shared/components/` → componentes genéricos multi-feature

---

## Estructura de carpetas para una librería de componentes visuales (ej: bag-uicomponents)

```ruby
ui-lib/
│
├── src/
│   ├── lib/
│   │   ├── components/                # Los componentes de UI
│   │   │   ├── button/
│   │   │   │   ├── button.component.ts
│   │   │   │   ├── button.component.html
│   │   │   │   ├── button.component.scss
│   │   │   │   └── index.ts
│   │   │   ├── modal/
│   │   │   └── card/
│   │   │
│   │   ├── directives/                # Directivas reutilizables
│   │   │   └── autofocus.directive.ts
│   │   │
│   │   ├── pipes/                     # Pipes reutilizables
│   │   │   └── truncate.pipe.ts
│   │   │
│   │   ├── services/                  # Servicios (solo si son UI helpers)
│   │   │   └── theme.service.ts
│   │   │
│   │   ├── styles/                    # Estilos globales, mixins SCSS, variables
│   │   │   ├── _variables.scss
│   │   │   └── _mixins.scss
│   │   │
│   │   ├── utils/                     # Helpers puros (no dependientes de Angular)
│   │   │   └── color.util.ts
│   │   │
│   │   └── ui-lib.module.ts           # Módulo raíz de la librería
│   │
│   ├── public-api.ts                  # Barrel principal, lo que se expone a apps
│   └── test.ts                        # Config de tests de la lib
│
├── package.json
└── README.md

```

🔹 `components/`

- Cada componente en su propia carpeta, con sus archivos `.ts`, `.html`, `.scss` y un `index.ts` para facilitar los imports.

🔹 `directives/`, `pipes/`

- Para directivas y pipes reutilizables en la librería.

🔹 `models/`

- Interfaces y tipos compartidos entre componentes.

🔹 `styles/`

- Variables SCSS, mixins, temas globales de la librería.

🔹 `utils/`

- Funciones auxiliares internas, no expuestas públicamente.

🔹 `public-api.ts`

- Punto de entrada público: solo lo que se exporta aquí estará disponible para los consumidores de la librería.

>✅ Regla de oro  
>`components/` → cada componente visual en su carpeta  
>`public-api.ts` → solo exporta lo que quieres que sea público  
>`styles/` → estilos globales y compartidos

---

📌 Principios clave de una librería de componentes

- Dominio independiente:
  - No debe tener modelos de negocio (User, Order) → eso pertenece a la app.
  - Solo componentes UI genéricos (Button, Modal, Card, Tabs, Table, etc.).
- Public API clara:
  - Todo lo que quieras exponer se centraliza en `public-api.ts`.
Ejemplo:

```ts
export * from './lib/components/button';
export * from './lib/components/modal';
export * from './lib/pipes/truncate.pipe';
export * from './lib/ui-lib.module';```
```

- Barrel files por carpeta:
  - Cada componente/directiva/pipe tiene su index.ts que exporta lo necesario.
  - Ejemplo en button/index.ts:

```ts
export * from './button.component';
```

- Estilos y theming:
  - Conviene centralizar variables de colores, tipografías, etc. en styles/.
  - Así todas las apps que usen la librería mantienen coherencia visual.
- Reutilización en apps:
  - En la app, importas con algo así:
En la app, importas con algo así:

```ts
import { ButtonComponent } from '@my-org/ui-lib';
```

---

📌 Diferencia clave con shared/ de una app

- shared/ en la app → contiene cosas del dominio que se usan dentro de esa app y sus features.
- ui-lib/ como librería → contiene cosas neutrales, que cualquier app debería poder usar sin saber de su negocio.

---

✅ Resumen:

- App Angular → `core/`, `features/`, `shared/` (orientado a negocio).
- Librería de componentes → `components/`, `directives/`, `pipes/`, `styles/`, `utils/` (orientado a UI).
- Todo lo que expone la librería → `public-api.ts`.
