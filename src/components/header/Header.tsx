'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cta, nav, site } from '@/data/navigation';
import { pushEvent } from '@/lib/track';

/*
 * SolidMix RMC header: desktop menu (with a wide menu for products) + mobile drawer.
 * Structure, data and keyboard/aria behaviour from seo-kit/menu; visual style
 * (colours, sizes, spacing) matches the old src/components/Header.tsx exactly
 * where an equivalent existed there — see docs/BUILD-LOG.md Phase 1 for the
 * old -> new property table. Elements with no old equivalent (the "overview"
 * link, group headings, the wide mega-menu columns, the drawer's bottom
 * Call/WhatsApp/Book Us block) use the same primary/secondary/white palette
 * the old dropdown already used, never a new colour.
 *  - Every link is a real <a href> and is present in the server-rendered HTML, so Google and AI
 *    crawlers read the whole menu without running JavaScript.
 *  - The parent label is itself a link (overview page). A separate small chevron button opens the submenu,
 *    so touch and keyboard users can reach both (the old header had no separate chevron button; this one
 *    exists so the submenu can be opened without a mouse hover, same colours as the old caret).
 *  - Keyboard: Tab through links, Enter on chevron opens, Esc closes. Screen readers get aria-expanded/current.
 *  - Mobile drawer: locks page scroll, traps focus, closes on Esc and on page change.
 */

const trim = (p: string) => p.replace(/\/$/, '') || '/';

function linkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return trim(pathname) === trim(href) || pathname.startsWith(trim(href) + '/');
}

// Old header had no third "current page" colour (always primary, hover
// secondary); linkActive is kept only to set aria-current for
// accessibility/SEO, never to change colour.

function Chevron({ open, size = 16 }: { open: boolean; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [openDesktop, setOpenDesktop] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpenDesktop(null);
    setMobileOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const f = drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const visible = Array.from(f).filter((el) => el.offsetParent !== null);
      if (!visible.length) return;
      const first = visible[0];
      const last = visible[visible.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const onDesktopKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpenDesktop(null);
  }, []);

  const enter = (i: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenDesktop(i);
  };
  const leave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenDesktop(null), 120);
  };

  return (
    <header data-track-location="header" className="sticky top-0 z-30 border-b border-grey-line bg-white">
      <div className="relative mx-auto flex h-[72px] w-full max-w-[1360px] items-center justify-between gap-4 px-4 lg:h-[76px] lg:max-w-none lg:justify-start lg:gap-[64px] lg:px-[60px]">
        <Link href="/" aria-label="SolidMix RMC home" className="flex-shrink-0">
          <Image
            src="/images/solidmix-logo-v2-header.webp"
            alt="SolidMix RMC — Ready Mix Concrete logo"
            width={388}
            height={128}
            priority
            unoptimized
            className="h-[52px]! w-auto lg:h-[64px]!"
          />
        </Link>

        {/* ---------- Desktop ---------- */}
        <nav aria-label="Primary" className="hidden lg:block" onKeyDown={onDesktopKey}>
          <ul className="flex items-center">
            {nav.map((item, i) => {
              const hasSub = !!item.groups?.length;
              const wide = (item.groups?.length ?? 0) >= 2;
              const open = openDesktop === i;
              const panelId = `submenu-${i}`;
              return (
                <li
                  key={item.href}
                  className={wide ? '' : 'relative'}
                  onMouseEnter={hasSub ? () => enter(i) : undefined}
                  onMouseLeave={hasSub ? leave : undefined}
                  onBlur={
                    hasSub
                      ? (e) => {
                          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenDesktop(null);
                        }
                      : undefined
                  }
                >
                  {/* Ma'am 2026-11-23: a top-level item with a submenu is not a
                      link — only the submenu's own links navigate. The label
                      becomes the toggle button (click/Enter/hover open it,
                      Esc closes via onDesktopKey on the parent <nav>). Home
                      has no submenu, so it stays a real <Link>. */}
                  {hasSub ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenDesktop(open ? null : i)}
                      className="flex items-center whitespace-nowrap rounded px-[20px] py-[13px] text-[16px] font-semibold text-primary transition-colors hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
                    >
                      {item.label}
                      <span className="ml-1.5 flex items-center">
                        <Chevron open={open} size={14} />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={linkActive(pathname, item.href) ? 'page' : undefined}
                      className="flex items-center whitespace-nowrap rounded px-[20px] py-[13px] text-[16px] font-semibold text-primary transition-colors hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary"
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasSub && (
                    <div
                      id={panelId}
                      className={`absolute top-full z-50 bg-primary text-white shadow-xl transition-all duration-150 ${
                        wide ? 'inset-x-0' : 'left-0 w-max min-w-[130px]'
                      } ${open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}`}
                    >
                      <div className={wide ? 'mx-auto max-w-[1100px] px-6 py-6' : 'py-2'}>
                        {item.overview && (
                          <Link
                            href={item.overview.href}
                            tabIndex={open ? 0 : -1}
                            className={`block font-semibold text-white hover:text-white/80 ${
                              wide ? 'mb-4 border-b border-white/20 pb-3 text-[16px]' : 'px-5 py-2.5 text-[14px]'
                            }`}
                          >
                            {item.overview.label} <span aria-hidden="true">&rarr;</span>
                          </Link>
                        )}
                        <div
                          className={wide ? 'grid gap-x-8 gap-y-6' : ''}
                          style={wide ? { gridTemplateColumns: `repeat(${item.groups!.length}, minmax(0, 1fr))` } : undefined}
                        >
                          {item.groups!.map((g, gi) => (
                            <div key={gi}>
                              {g.heading && (
                                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/70">{g.heading}</p>
                              )}
                              <ul>
                                {g.links.map((l) => (
                                  <li key={l.href}>
                                    <Link
                                      href={l.href}
                                      tabIndex={open ? 0 : -1}
                                      aria-current={linkActive(pathname, l.href) ? 'page' : undefined}
                                      className={`block whitespace-nowrap text-[14px] leading-5 text-white transition-colors hover:bg-[#3f444b] focus-visible:bg-[#3f444b] ${
                                        wide ? 'rounded px-3 py-[10px]' : 'px-[20px] py-[13px]'
                                      }`}
                                    >
                                      {l.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href={cta.href}
          onClick={() => pushEvent('book_us_click', { location: 'header' })}
          className="ml-auto hidden flex-shrink-0 whitespace-nowrap rounded-md bg-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary lg:block xl:px-6 xl:text-[15px]"
        >
          {cta.label}
        </Link>

        {/* ---------- Mobile ---------- */}
        <button
          ref={burgerRef}
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded border border-grey-line text-ink lg:hidden"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'visible translate-x-0' : 'pointer-events-none invisible translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-grey-line px-4 py-4">
          <span className="font-semibold text-primary">Menu</span>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={() => {
              setMobileOpen(false);
              burgerRef.current?.focus();
            }}
            className="flex h-11 w-11 items-center justify-center rounded text-ink"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain">
          <ul className="divide-y divide-grey-line">
            {nav.map((item, i) => {
              const hasSub = !!item.groups?.length;
              const isOpen = expanded === i;
              return (
                <li key={item.href}>
                  {/* Ma'am 2026-11-23: same rule as desktop — a row with a
                      submenu is one button that only expands/collapses it,
                      no navigation. A row with no submenu (Home) stays a
                      real <Link>. */}
                  {hasSub ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`m-sub-${i}`}
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className="flex min-h-[48px] w-full items-center justify-between px-4 text-[15px] font-medium text-ink"
                    >
                      {item.label}
                      <span className="flex h-11 w-12 flex-shrink-0 items-center justify-center text-primary">
                        <Chevron open={isOpen} />
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={linkActive(pathname, item.href) ? 'page' : undefined}
                      className="flex min-h-[48px] flex-1 items-center px-4 text-[15px] font-medium text-ink"
                    >
                      {item.label}
                    </Link>
                  )}
                  {hasSub && (
                    <div id={`m-sub-${i}`} hidden={!isOpen} className="bg-tint-cyan-2/60 pb-2">
                      {item.overview && (
                        <Link href={item.overview.href} className="flex min-h-[44px] items-center px-6 text-sm font-semibold text-primary">
                          {item.overview.label}
                        </Link>
                      )}
                      {item.groups!.map((g, gi) => (
                        <div key={gi}>
                          {g.heading && (
                            <p className="px-6 pb-1 pt-3 text-[12px] font-semibold uppercase tracking-wide text-ink/60">{g.heading}</p>
                          )}
                          <ul>
                            {g.links.map((l) => (
                              <li key={l.href}>
                                <Link
                                  href={l.href}
                                  aria-current={linkActive(pathname, l.href) ? 'page' : undefined}
                                  className="flex min-h-[44px] items-center px-8 text-sm text-ink"
                                >
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-grey-line p-4">
          <Link
            href={cta.href}
            onClick={() => pushEvent('book_us_click', { location: 'header' })}
            className="mb-3 flex min-h-[48px] items-center justify-center rounded-md bg-primary text-[15px] font-semibold text-white"
          >
            {cta.label}
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a href={site.phoneHref} className="flex min-h-[48px] items-center justify-center rounded-md border border-primary text-[15px] font-semibold text-primary">
              Call us
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] items-center justify-center rounded-md border border-secondary text-[15px] font-semibold text-secondary"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
