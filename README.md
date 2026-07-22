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

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhowTHqA6F5Q-iaQhwKdNCKyInsyJtJjfwFXIylSgJCMeur_RrZVhcDXRhi1ynfTBZ6GzwlWuJL3OqTCYx18hjVrAlq59OwE7ENGg9pcDEqcGZ0DNKyYSz0CKmoS-SHE0-LdGt3QrsPMleVig_p7y3q9rMAMZvY54yWMgjqIJxT9WJI0g7Dcpma2hDDBUk/s1854/1.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWrifca__ToYGPBYcLUIpS4YgIr9XvCnXnpgObI-z3NH4LfYNr7p5w_DHm2MYEfa1hLOdxntv9GMd0PDYwZ7z64vw0d5p2MkIBDo5-6MO8VuuFZpp_pXO7gfOntgO3e6FdJ3JREGPLgZEw5m5OBswoQJwm8Ri4DTlVPpCBpYWUkNIi3sQfZqIG7wwXVKQ/s1852/2.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2fCGfPBbVtyjS8apB_Y9phGOPE6vrp9K-6K1Y9on5Qci9WGIW74Bsba48SDZ4gd8UPQpj4BahW9OjsRqT603LcYrhMjBxcRzg7W56CRLHI656aCO_q3m1FvTOXRFuDmQD59NPucb5_S9OqUc1HC-88GO2DFtES8Dqwpl-sPkeKk1cN1SVDagK2XDjjc0/s1852/3.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6Gp6NAWFqE7ofWeo0AWMWNKUhYYp41_Dw1Ky_0QUWlTO3FduCTgn5RiRb4ufYIbQ8kkRahyAo_5cWkOgBmLc8JeqkHlTMCR6KzHlhYIOc8Cl3aBU_WAu3vzJAEYEIpl_bhAK4i5MeYNylst5KCKBKZN9FyLE7NDM8nLuIjHCWaNVX5zI6wSpwUqygL0E/s1854/4.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgh_KvnskG9ZubEl1xvlZ4_b1Bd6232M1hxoJqUnhs9qGHmR0BwHDFKA5QkSmHO_ULXQKYLz2K4cWWxRiRV2KR9u0Dys7T9-_Q4HNknU6Crf3XOy35ujePaCkiiqmJyVjnhgWU7rJLB6RxiXKyi-QPcbnO0xB6brthvLkp9pM757C_125q4EgZ-laJB8Ms/s1852/5.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEheT9t6MsIulGzJwTn6yYz_pVIhcZOgrzC2D0-3DQCwFlY3aXpl0cujlw0Pukmnt_bNJJZUmdJsht_d9raR1YZfOrdjZOdfcfxIvpRM-OTAK2n8wYwEfV8zZLrXuaCOwb1Zyx_3e3fsnHhOjFc8_8ezxMGzQAKwGv2RonmzmbDy1MoGjs5f3o9oPq7f0sE/s1852/6.png)

![screenshot](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpJ3e0LIKh3tCw-AnW9DtouoiWsguaZ52Y72neN5wSzGyM8jjejLAIdkkK4VcILhPDNax7_xQect-xJe1u4_tJJ0PTDkjtUOMOo13xCk3Mw_y9wFXRDgRjIfoHPeDUz19pivTjlwFuEpQU4ZMkPmc8N7eX_huy1TI-uRmuxU_dwe9OJydJFlLJ9Js4hGw/s1850/7.png)

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