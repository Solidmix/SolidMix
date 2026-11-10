"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menu, type MenuItem } from "@/content/site";

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DesktopNav() {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {menu.map((item) => (
          <li key={item.label} className="group relative">
            <Link
              href={item.href}
              className="flex items-center gap-1 rounded px-3 py-2 text-[16px] font-semibold text-primary transition-colors hover:text-secondary"
            >
              {item.label}
              {item.children && <Chevron />}
            </Link>
            {item.children && (
              <ul className="invisible absolute left-0 top-full z-50 min-w-[220px] translate-y-2 rounded-md border border-grey-line bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {item.children.map((child) => (
                  <li key={child.label}>
                    <Link
                      href={child.href}
                      className="block px-4 py-2 text-sm text-ink transition-colors hover:bg-tint-pink hover:text-primary"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = (label: string) =>
    setExpanded((cur) => (cur === label ? null : label));

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transition: "opacity 300ms ease, visibility 300ms ease", visibility: open ? "visible" : "hidden" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed right-0 top-0 z-50 h-full w-[85%] max-w-sm overflow-y-auto bg-white shadow-xl lg:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
        style={{
          transition: "transform 300ms ease, visibility 300ms ease",
          visibility: open ? "visible" : "hidden",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-grey-line px-4 py-4">
          <span className="font-semibold text-primary">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded text-ink"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className="divide-y divide-grey-line">
            {menu.map((item: MenuItem) => (
              <li key={item.label}>
                <div className="flex items-stretch">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex min-h-[48px] flex-1 items-center px-4 text-[15px] font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      onClick={() => toggle(item.label)}
                      aria-expanded={expanded === item.label}
                      aria-label={`Toggle ${item.label} submenu`}
                      className="flex min-h-[48px] w-12 items-center justify-center text-primary"
                    >
                      <Chevron open={expanded === item.label} />
                    </button>
                  )}
                </div>
                {item.children && expanded === item.label && (
                  <ul className="bg-tint-cyan-2/60 pb-2">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="flex min-h-[44px] items-center px-8 text-sm text-ink"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-grey-line bg-white">
      <div className="container-content flex h-[72px] items-center justify-between gap-4 lg:h-[92px] lg:justify-start lg:gap-[64px]">
        <Link href="/" aria-label="SolidMix RMC home" className="flex-shrink-0">
          <Image
            src="/images/solidmix-logo.webp"
            alt="SolidMix RMC — Ready Mix Concrete logo"
            width={180}
            height={72}
            priority
            className="h-[52px] w-auto lg:h-[64px]"
          />
        </Link>

        <DesktopNav />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded border border-grey-line text-ink lg:hidden"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
