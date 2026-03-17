import Link from "next/link";
import { Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <Car className="mb-4 h-16 w-16 text-gray-300" />
      <h1 className="mb-2 text-2xl font-bold">Page Not Found</h1>
      <p className="mb-6 text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}
