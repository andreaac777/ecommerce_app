import { useClerk } from '@clerk/clerk-react';

export default function UnauthorizedPage() {
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        await signOut({ redirectUrl: '/login' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                        className="w-12 h-12 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Acceso Denegado
                </h1>
                <p className="text-gray-600 mb-8">
                    Esta área es solo para personal autorizado.
                </p>
                <button
                    onClick={handleSignOut}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}