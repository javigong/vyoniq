export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vyoniq-blue mx-auto"></div>
        <p className="mt-4 text-lg">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
