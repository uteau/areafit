---
name: AreaFit
description: Espacio privado del equipo de voleibol — calendario y rutinas leídos como la tablilla del pabellón.
colors:
  hall: "#0b0c0e"
  cabinet: "#121316"
  plate: "#1a1c20"
  seam: "#26282d"
  seam-bright: "#363940"
  lamp: "#e31b23"
  lamp-hot: "#ff2e37"
  lit: "#f5f5f1"
typography:
  display:
    fontFamily: '"DM Sans Variable", ui-sans-serif, system-ui, sans-serif'
    fontWeight: 800
    letterSpacing: "-0.02em"
    lineHeight: 1.05
  body:
    fontFamily: '"DM Sans Variable", ui-sans-serif, system-ui, sans-serif'
    fontWeight: 400
  label:
    fontFamily: '"DM Sans Variable", ui-sans-serif, system-ui, sans-serif'
    fontWeight: 700
    letterSpacing: "0.16em"
    lineHeight: 1
    textTransform: uppercase
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.lamp}"
    textColor: "#ffffff"
    typography:
      fontFamily: "{typography.body.fontFamily}"
      fontWeight: 700
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.lit}"
    typography:
      fontFamily: "{typography.body.fontFamily}"
      fontWeight: 700
    rounded: "{rounded.md}"
    padding: "8px 14px"
  button-danger:
    backgroundColor: "transparent"
    textColor: "#ff8b90"
    typography:
      fontFamily: "{typography.body.fontFamily}"
      fontWeight: 700
    rounded: "{rounded.md}"
    padding: "8px 14px"
  field:
    backgroundColor: "{colors.cabinet}"
    textColor: "{colors.lit}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
  panel:
    backgroundColor: "{colors.cabinet}"
    rounded: "{rounded.xl}"
    padding: "16px"
  pill:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.lit}"
    typography:
      fontFamily: "{typography.body.fontFamily}"
      fontWeight: 700
      letterSpacing: "0.06em"
      lineHeight: 1
      textTransform: "uppercase"
    rounded: "9999px"
    padding: "0 10px"
    height: "24px"
---

# Design System: AreaFit

## Overview

**Creative North Star: "La Tablilla del Pabellón"**

Cada pantalla es la tablilla electrónica del pabellón: los jugadores la leen sin despegarse del banco. La cabina negra es el fondo y el rojo `E31B23` la única lámpara viva. El calendario es un marcador: el día de hoy es un segmento rojo encendido, el próximo partido brilla, y cada tipo de evento tiene su propia lámpara (partido roja, entrenamiento blanca encendida, evento apagada). El staff enciende lámparas desde formularios de cabina.

El sistema es denso, nocturno y discreto: superficies de cabina apiladas sobre el fondo `hall`, bordes de costura de 1 px, texto `lit` tintado por opacidad. La gravedad visual vive en el contraste del rojo lámpara sobre el negro, no en brillos, gradientes ni sombras decorativas. Números tabulares y DM Sans en peso 800 forman la voz de marcador; su letra condensada y el tracking apretado `-0.02em` distinguen los títulos de lectura del cuerpo de la interfaz.

La única referencia visual confirmada que se rechaza es la caja gris genérica del CRUD convencional: paneles blancos, azules por defecto de sistema y fondos claros. Ese mundo no entra; si una vista nueva llega con esa estética, se re-traduce a la cabina.

**Key Characteristics:**
- Un solo acento: el rojo lámpara `#E31B23`, usado con moderación.
- Superficies siempre oscuras y tonales; nunca blanco puro.
- Sonido de marcador: títulos `readout` (peso 800), horas y conteos tabulares.
- Bordes de 1 px en `seam`/`seam-bright`; profundidad por capas tonales, no por sombras.
- Interfaz íntegra en español; estados vacíos y errores en el idioma del jugador.

## Colors

Paleta bicolor de noche: escala de negros de la cabina y un único acento incandescente rojo.

### Primary

- **La Lámpara** (`#e31b23`): el rojo eléctrico que solo se enciende en lo que importa — celda de hoy, tipo de evento partido, acción primaria, foco, puntero de navegación activa. Variante encendida/`:hover`: **Lámpara al Rojo Vivo** (`#ff2e37`).

### Neutral

- **Pabellón** (`#0b0c0e`): fondo de aplicación; también las celdas vacías del calendario.
- **Cabina** (`#121316`): superficie de paneles, tarjetas, tablas, sidebar y campos de formulario.
- **Placa** (`#1a1c20`): fondo de chips y píldoras sobre la cabina.
- **Costura** (`#26282d`): borde estándar de separación (1 px).
- **Costura Encendida** (`#363940`): borde de hover y el anillo de la lámpara "evento apagada".
- **Iluminado** (`#f5f5f1`): texto y elementos de lectura; sus tintes se hacen por opacidad (`lit/45`, `lit/55`, `lit/60`, `lit/80`), nunca con grises de otro matiz.

**La Regla de la Lámpara Única.** El rojo lámpara se enciende solo en lo que importa: hoy, partidos, acción primaria y foco. Su rareza es la señal. Más de un elemento rojo dominante por tarjeta es ruido.

**La Regla de la Cabina.** Toda superficie es `cabinet` alzándose sobre `hall`. Las cajas claras, el blanco y los azules de sistema no pertenecen a este mundo.

## Typography

**Display Font:** DM Sans Variable (fontsource variable, peso 100–1000) — la letra del marcador.
**Body Font:** DM Sans Variable, `ui-sans-serif`, `system-ui`, `sans-serif`.
**Label Font:** DM Sans Variable, versión en mayúsculas compactas con tracking amplio.

**Character:** DM Sans parece una letra neutral de gimnasio, pero en peso 800 con tracking apretado y números tabulares se vuelve letra de tablilla: ancha, firme, de una sola mirada.

### Hierarchy

- **Display** (800, `clamp` según contexto, line-height 1.05, tracking `-0.02em`): la clase `.readout`. Títulos de página, del evento y del mes, y cualquier número protagonista. Vocal, condensada, sin versalitas.
- **Headline / Title** (700–800, 14–16px): títulos de tarjeta (rutina, evento) y datos destacados de cabina.
- **Body** (400–500, 14–15px, line-height relajado ~1.5): párrafos, descripciones y metadata. En textos largos se usa `lit/80`.
- **Label** (700, 11px, tracking `0.14–0.16em`, mayúsculas): la clase `.eyebrow` para etiquetas de sección ("Próximos eventos") y encabezados de columna.
- **Números** (700–800, `tabular-nums`): horas, series × reps, fechas y conteos. Siempre tabulares para que alineen como en un marcador.

**La Regla del Marcador.** Los números miden; no se decoran. El tracking nunca baja de `-0.04em`, y el título de lectura manda con peso, no con tamaño gigante — en el pabellón el texto más grande del *view* es su encabezado `readout`.

## Layout

Fondo `hall` desde el shell (`app/(app)/layout.tsx`): sidebar de cabina a la izquierda en `lg`, cabecera y consola inferior en móvil. La zona de contenido usa `px-5 pt-6 pb-28` en móvil (colchón para la consola fija) y `lg:px-10 lg:py-10` en escritorio.

- **Calendario:** rejilla `lg:grid-cols-[1fr_300px]`; el mes vive en un `.panel` con `p-3`/`sm:p-4`, y «Próximos eventos» a la derecha.
- **Rutinas:** lista `md:grid-cols-2` de tarjetas `p-5`; el detalle en `max-w-2xl`.
- **Equipo:** `lg:grid-cols-[380px_1fr]` (formulario de alta + tabla).
- **Ritmo:** grupos apretados en `space-y-4`; separación de secciones `mt-6`; más aire sobre un encabezado que debajo de él (`mb-6` en cabeceras).

Toda página interior arranca con el patrón de cabecera: `eyebrow` ("Área Fit · Voleibol"), luego el título `readout` y la acción primaria a la derecha; las sub-páginas abren con el enlace de retroceso compartido `BackLink` (`lit/60`, flecha `IconArrowLeft`).

## Elevation & Depth

Superficies planas a base de **capas tonales**: `cabinet` alzándose sobre `hall` y `plate` sobre `cabinet`. La profundidad se lee por valor tonal y por borde de costura, no por sombra.

La única excepción es el **brillo de la lámpara**: un halo rojo difuso reservado a lo que está encendido. No hay sombras ambientales generalizadas; un panel fuera del foco no lleva sombra.

### Shadow Vocabulary

- **Lámpara corta** (`0 0 10px rgb(227 27 35 / 0.55)`): dot de marca, lámpara de partido, halo de hoy.
- **Lámpara larga** (`0 0 18px rgb(227 27 35 / 0.45)`): `:hover` de la acción primaria.
- **Chip de hoy** (`0 0 14px rgb(227 27 35 / 0.5)`): segmento rojo del día actual.
- **(Solo login)** **Sombra de banquillo** (`0 24px 60px -20px rgb(0 0 0 / 0.6)`): da asiento al panel de acceso sobre el fondo.

**La Regla de Foco por Lámpara.** El foco de teclado es un anillo de 2 px en `lamp` con offset 2 px sobre el elemento activo — nada de anillos azules de sistema.

## Shapes

Lenguaje de forme redondeada pero cuadrada en el ánimo: el radio nace del contenido, no de un sistema deblob.

- **Paneles y tarjetas:** 14 px (`rounded.xl`), secciones de detalle 12 px (`rounded.lg`) para sub-tarjetas.
- **Botones, campos y celdas de consola:** 8 px (`rounded.md`).
- **Celda de hoy (chip):** 6 px (`rounded.sm`) — el segmento pequeño y preciso del marcador.
- **Píldoras y puntos de lámpara:** circular (`9999px`), sin excepción.
- **Bordes:** siempre 1 px, `seam` en reposo y `seam-bright` en hover. Las tarjetas encima de paneles usan `border-dashed seam-bright` solo para la zona «Añadir ejercicio».

## Components

### Buttons
- **Shape:** radio 8 px, relleno `8px 14px`, peso 700, ícono opcional de 16 px a la izquierda.
- **Primary:** fondo **La Lámpara** `#e31b23`, texto blanco. Hover: `#ff2e37` con `box-shadow 0 0 18px rgb(227 27 35 / .45)`. Es la única voz de acción principal de la pantalla.
- **Ghost:** borde `seam-bright`, fondo transparente, texto `lit`. Hover: borde blanco 30% y fondo `lit/5`. Para navegación y acciones secundarias.
- **Danger:** borde `lamp` al 50%, texto `#ff8b90`, fondo transparente. Hover: fondo `lamp/12` y borde `lamp`. Para eliminar y desactivar.
- **Transiciones:** fondo y color 140 ms; `box-shadow` 180 ms.

### Chips
- **Style:** píldora cilíndrica de 24 px, fondo **Placa** `#1a1c20`, borde `seam-bright`, texto `lit` en mayúsculas de 11 px con tracking `0.06em`. Para roles ("Admin", "Deportista").

### Cards / Containers
- **Corner:** 14 px.
- **Background:** **Cabina** `#121316` sobre `hall`.
- **Border:** 1 px `seam`; en hover, `seam-bright` (solo en tarjetas enlazables).
- **Padding:** `16–20 px` (`p-4`/`p-5`), hasta 32 px en el detalle (`p-6 sm:p-8`).
- **Shadow Strategy:** planas; sin sombra en reposo.

### Inputs
- **Style:** fondo **Cabina**, borde `seam`, radio 8 px, padding `9px 12px`, caret rojo lámpara.
- **Focus:** borde `lamp` con anillo `0 0 0 3px rgb(227 27 35 / .22)`, sin `outline` de sistema.
- **Placeholder:** `lit/45`. `<select>` nativo hereda la apariencia oscura por `color-scheme: dark`.

### Navigation
- **Sidebar (lg):** columna de `256px` en `cabinet`, borde derecho `seam`. Ítem: `.console-link`, 14 px peso 600, icono 18 px; hover `lit/4`; activo con fondo `lamp/14` y texto blanco.
- **Móvil:** cabecera pegajosa en `cabinet/95` con blur, y consola inferior fija con ítem categoría en columna (icono 20 px + etiqueta de 11 px, activo `lit`, inactivo `lit/50`) y una barra de 2 px `lamp` sobre el ítem activo.

### La Lámpara (componente distintivo)
Marcador de tipo de evento de 8 px con forma de punto:
- **Partido:** `lamp` con halo (`box-shadow 0 0 10px rgb(227 27 35 / .55)`).
- **Entrenamiento:** `lit`, blanca encendida.
- **Evento:** apagada, anillo interior de 1.5 px `seam-bright`.

También es el **segmento rojo del día de hoy** en el calendario (chip `lamp` de 28 px, texto blanco, halo) y el **Brand Dot** de 10 px del logotipo. Hasta que llegue el logo real del club, la marca es `brand-dot` + tipo `readout` en mayúsculas.

## Do's and Don'ts

### Do:
- **Do** construir toda superficie sobre `cabinet`/`plate` y el fondo sobre `hall`; `lit` para texto y sus opacidades para los secundarios.
- **Do** encender la lámpara solo en lo que importa: hoy, partidos, acción primaria, foco.
- **Do** usar `readout` (800, tracking `-0.02em`) para títulos protagonistas y `tabular-nums` para horas, fechas y conteos.
- **Do** mantener España: bordes de 1 px `seam`, radio 8–14 px, estados vacíos y errores en español.
- **Do** reservar el `eyebrow` "Área Fit · Voleibol" para las páginas raíz; las sub-páginas abren con `BackLink` y título `readout` propio.

### Don't:
- **Don't** usar cajas claras, blanco puro, `slate*` o azules de sistema en ninguna superficie.
- **Don't** colocar más de una acción `btn-primary` por complemento de vista.
- **Don't** aplicar brillo rojo donde no hay una lámpara encendida.
- **Don't** usar gradientes de texto, sombras duras de offset o `border-left` de color para avisos.
- **Don't** cambiar la semana del calendario a domingo; la semana empieza en lunes.