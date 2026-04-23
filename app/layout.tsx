import './globals.css'; // <--- Importante para cargar los estilos

export const metadata = {
  title: 'Sistema de Inventario',
  description: 'Gestión de activos de cómputo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}