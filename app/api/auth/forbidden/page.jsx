export default function ForbiddenPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-3">Access Denied</h1>
        <p className="text-gray-700 mb-4">
          You do not have permission to access this page.
        </p>
        <a
          href="/auth/login"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
