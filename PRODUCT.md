# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuarios principales: los jugadores (deportistas) del equipo de voleibol. Consultan a diario,
mayoritariamente en móvil, el calendario de partidos/entrenamientos y las rutinas de gimnasio.
Secundarios: personal técnico (admin/entrenador), que además edita eventos, rutinas y cuentas.

## Product Purpose

Plataforma web cerrada del equipo: calendario mensual de eventos + sección de rutinas de gimnasio,
con acceso exclusivo para integrantes mediante cuentas creadas por el staff. El éxito es que cada
jugador sepa cuándo/dónde es cada actividad y qué rutina seguir, con cero fricción desde el móvil.

## Positioning

A diferencia de calendarios genéricos o chats de grupo, es el espacio privado y único del equipo:
fechas + lugar + rutina en un solo sitio, en español, con contenido curado por el staff.

## Operating Context

Uso diario, móvil primero. Los jugadores leen: próximos eventos, mes completo, detalle de evento y
rutinas con ejercicios. El staff gestiona (crear/editar/eliminar eventos, rutinas y ejercicios,
crear cuentas y roles). Interfaz íntegramente en español; la semana del calendario empieza en lunes.

## Capabilities and Constraints

- Roles: admin, entrenador y deportista. Staff = admin + entrenador (mismas capacidades).
- Deportista: solo lectura de calendario y rutinas, sin botones de escritura.
- CRUD de eventos, rutinas y ejercicios, y gestión de cuentas/roles solo staff.
- Backend Supabase (Postgres + Auth + RLS); mutaciones vía Server Actions con `revalidatePath`.
- Despliegue en Vercel. Sin RSVP, sin correos automáticos, sin fotos/videos en rutinas.
- No está definido aún qué mejora visual se hará (pendiente de decidir el alcance).

## Brand Commitments

- Nombre: **AreaFit**. Marca deportiva.
- Tipografía: **DM Sans**.
- Paleta: blanco `#FFFFFF`, negro `#000000`, rojo `#E31B23`.
- Logo: imagen en formato cuadrado o 3:1. El archivo no está en el repo — se espera que el usuario lo aporte.

## Evidence on Hand

- Spec funcional aprobado: `docs/superpowers/specs/2026-08-29-areafit-design.md`.
- Plan de implementación completo (funcionalidades ya construidas): `docs/superpowers/plans/2026-08-29-areafit.md`.
- Páginas existentes: login, calendario, rutinas, usuarios + shell con sidebar.
- Logo real del club: pendiente de entrega (no fabricar).

## Product Principles

1. Mobile-first: la lectura primaria ocurre en el móvil; cada vista debe funcionar y leerse bien en pantalla pequeña.
2. El jugador es la audiencia; el staff edita en segundo plano. La UI de lectura es limpia; la de gestión, eficiente.
3. La marca manda: DM Sans + blanco/negro/rojo son vínculos, no sugerencias.
4. Español en toda la interfaz; estados vacíos y errores en español.
5. Privacidad por diseño: acceso exclusivo, cuentas creadas por staff, permisos por rol.

## Accessibility & Inclusion

Sin requisito específico confirmado; aplicar buenas prácticas estándar (contraste, foco visible,
etiquetas de formulario) sin un nivel WCAG obligatorio.