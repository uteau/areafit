import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AreaFit",
  description: "Plataforma del equipo de voleibol",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {/*
        THESIS: cada pantalla es la tablilla electrónica del pabellón: los jugadores la leen sin despegarse del banco. Se niega la caja gris genérica del CRUD; la cabina negra es el fondo y el rojo E31B23 la única lámpara viva.
        OWN-WORLD: fondo hall #0b0c0e, paneles cabina #121316 con seam #26282d; texto lit #f5f5f1; la lámpara roja solo se enciende en lo que importa (hoy, partido, acción primaria). Tipografía DM Sans (variable, 100–1000) como letra de marcador: números tabulares, títulos condensados con tracking apretado.
        STORY: al abrir, el jugador ve el mes como tablilla: el día de hoy es un segmento rojo encendido y el próximo partido brilla. Cada tipo de evento tiene su lámpara (partido roja, entrenamiento blanca encendida, evento apagada). El staff enciende lámparas con formularios de cabina.
        FIRST VIEWPORT: cabecera de cabina con el mes en lectura (‹ › ‹‹ ››), rejilla de celdas-cabina con números tabulares y hasta dos lámparas/evento, celda de hoy roja encendida; debajo «Próximos eventos» como columna de salidas con hora y lámpara por tipo. La acción primaria (Nuevo evento) es un botón rojo encendido.
        FORM: marcador del pabellón, posición 1 de 7 de la lista propia del modelo (pick IMPECCABLE'S PICK); seed 8b347230.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
        */}
        {children}
      </body>
    </html>
  );
}