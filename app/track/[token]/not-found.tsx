export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">Delivery Not Found</h1>
        <p className="text-gray-500">
          This tracking link is invalid or has expired.
        </p>
      </div>
    </div>
  );
}