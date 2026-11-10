import Link from "next/link";
import { PRODUCTS_BASE } from "@/content/site";

export default function NotFound() {
  return (
    <section className="container-content flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink md:text-3xl">Page not found</h1>
      <p className="mt-3 max-w-md text-grey">
        The page you are looking for doesn’t exist or has moved. Let’s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Home
        </Link>
        <Link
          href={`${PRODUCTS_BASE}/`}
          className="rounded-md border border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-tint-pink"
        >
          Products
        </Link>
        <Link
          href="/ready-mix-concrete-contact-in-raipur/"
          className="rounded-md border border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-tint-cyan"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
