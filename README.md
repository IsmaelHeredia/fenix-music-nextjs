## Fenix Music

Fenix Music es una aplicación web full-stack pensada para gestionar tu biblioteca multimedia local. Está construida con **Next.js 14** y estructurada bajo una arquitectura **Domain-Driven Design (DDD)**, lo que permite mantener el código ordenado y escalable a medida que el proyecto crece.

## Funcionalidades principales

* **Reproductor multimedia avanzado**: Barra de control persistente para audio. Incluye visualización de ondas (*waveform*) para canciones, soporte para reproducción de videos locales, estaciones de radio, videos de YouTube y transmisiones de YouTube en vivo.
* **Listas personalizadas**: Creación, edición y gestión completa de tus propias listas de reproducción.
* **Escaner inteligente**: Sistema integrado para indexar automáticamente tu biblioteca local de música y videos, manteniendo todo organizado.
* **Biblioteca centralizada**: Acceso rápido a todo tu contenido, con búsqueda ágil por artista o título.

## Stack Tecnológico

| Capa | Tecnología |
| --- | --- |
| **Frontend** | Next.js 14, Tailwind CSS, Context API |
| **Arquitectura** | Domain-Driven Design (DDD) |
| **Persistencia** | SQLite con Drizzle ORM |
| **Estado Global** | React Context (PlaybackContext) |

## Estructura del proyecto

Para mantener todo bajo control, se dividió la lógica en módulos dentro de `src/modules/`. Es una estructura clara donde cada pieza tiene su lugar:

```text
src/modules/[modulo]/
├── application/     # Casos de uso (la lógica de la app)
├── domain/          # Entidades y reglas de negocio
└── infrastructure/  # Implementación técnica (Drizzle + SQLite)

```

## Capturas de pantalla

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

![screenshot]()

## Desarrollo local

### 1. Requisitos

* Node.js 18+

### 2. Instalación

Clona el repositorio, instala las dependencias y prepara las variables de entorno:

```bash
git clone https://github.com/IsmaelHeredia/fenix-music-nextjs.git
cd fenix-music-nextjs
npm install
cp .env.example .env.local
```

### 3. Configuración de la base de datos

Prepara la base de datos SQLite y ejecuta las migraciones necesarias:

```bash
npm run db:setup
```

### 4. Ejecución

Ejecuta la aplicación en modo desarrollo:

```bash
npm run dev
```

El proyecto va a estar disponible en `http://localhost:3000`.