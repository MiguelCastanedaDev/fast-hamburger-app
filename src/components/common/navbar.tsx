import { Link } from "@tanstack/react-router"

const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Menú', href: '/menu' },
    { name: 'Nuestra Historia', href: '/our-story' },
]

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-[#58151d] text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <img
                            src="/images/logo-main.webp"
                            alt="Logo"
                            className="size-14 w-auto object-contain transition-transform hover:scale-105"
                        />
                    </Link>

                    {/* Menú de Navegación corrido */}
                    <ul className="flex items-center gap-6 sm:gap-8">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.href}
                                    className="text-gray-200 hover:text-white font-medium text-sm sm:text-base transition-colors duration-200 [&.active]:text-amber-400 [&.active]:font-bold"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Botones de Autenticación corridos */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link
                            to="/login"
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:text-amber-300 transition-colors"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            to="/register"
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-full shadow transition-all duration-200"
                        >
                            Registrarse
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    )
}