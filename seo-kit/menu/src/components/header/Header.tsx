'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cta, nav, site, type NavItem } from '../../data/navigation';

/*
 * SolidMix RMC header: desktop menu (with a wide menu for products) + mobile drawer.
 *  - Every link is a real <a href> and is present in the server-rendered HTML, so Google and AI
 *    crawlers read the whole menu without running JavaScript.
 *  - The parent label is itself a link (overview page). A separate small chevron button opens the submenu,
 *    so touch and keyboard users can reach both.
 *  - Keyboard: Tab through links, Enter on chevron opens, Esc closes. Screen readers get aria-expanded/current.
 *  - Mobile drawer: locks page scroll, traps focus, closes on Esc and on page change.
 */

const trim = (p: string) => p.replace(/\/$/, '') || '/';

function linkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return trim(pathname) === trim(href) || pathname.startsWith(trim(href) + '/');
}

function itemActive(pathname: string, item: NavItem) {
  if (linkActive(pathname, item.href)) return true;
  return !!item.groups?.some((g) => g.links.some((l) => linkActive(pathname, l.href)));
}

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

  // close everything on page change
  useEffect(() => {
    setOpenDesktop(null);
    setMobileOpen(false);
    setExpanded(null);
  }, [pathname]);

  // lock scroll + focus handling for the mobile drawer
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

  // Esc closes the desktop dropdown
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
    <header className="sticky top-0 z-30 border-b border-grey-line bg-white">
      <div className="relative mx-auto flex h-[72px] w-full max-w-[1360px] items-center justify-between gap-4 px-4 lg:h-[76px] lg:max-w-none lg:justify-start lg:gap-6 lg:px-6 xl:gap-10 xl:px-[60px]">
        <Link href="/" aria-label="SolidMix RMC home" className="flex-shrink-0">
          <Image
            src="/images/solidmix-logo.webp"
            alt="SolidMix RMC, ready mix concrete in Raipur"
            width={180}
            height={72}
            priority
            className="h-[52px] w-auto lg:h-[60px]"
          />
        </Link>

        {/* ---------- Desktop ---------- */}
        <nav aria-label="Primary" className="hidden lg:block" onKeyDown={onDesktopKey}>
          <ul className="flex items-center">
            {nav.map((item, i) => {
              const hasSub = !!item.groups?.length;
              const active = itemActive(pathname, item);
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
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={linkActive(pathname, item.href) ? 'page' : undefined}
                      className={`flex items-center whitespace-nowrap rounded py-[13px] pl-3 text-[15px] font-semibold transition-colors hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary xl:pl-[18px] xl:text-[16px] ${
                        hasSub ? 'pr-0' : 'pr-3 xl:pr-[18px]'
                      } ${active ? 'text-secondary' : 'text-primary'}`}
                    >
                      {item.label}
                    </Link>
                    {hasSub && (
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        aria-label={`${open ? 'Close' : 'Open'} ${item.label} submenu`}
                        onClick={() => setOpenDesktop(open ? null : i)}
                        className={`flex h-[44px] w-7 items-center justify-center rounded text-primary hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary xl:w-8 ${
                          active ? 'text-secondary' : ''
                        }`}
                      >
                        <Chevron open={open} size={14} />
                      </button>
                    )}
                  </div>

                  {hasSub && (
                    <div
                      id={panelId}
                      className={`absolute top-full z-50 border-t-[3px] border-primary bg-white shadow-xl transition-all duration-150 ${
                        wide ? 'inset-x-0' : 'left-0 w-max min-w-[220px]'
                      } ${open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0'}`}
                    >
                      <div className={wide ? 'mx-auto max-w-[1100px] px-6 py-6' : 'py-2'}>
                        {item.overview && (
                          <Link
                            href={item.overview.href}
                            tabIndex={open ? 0 : -1}
                            className={`block font-semibold text-primary hover:text-secondary ${
                              wide ? 'mb-4 border-b border-grey-line pb-3 text-[16px]' : 'px-5 py-2.5 text-[14px]'
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
                                <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-ink/60">{g.heading}</p>
                              )}
                              <ul>
                                {g.links.map((l) => (
                                  <li key={l.href}>
                                    <Link
                                      href={l.href}
                                      tabIndex={open ? 0 : -1}
                                      aria-current={linkActive(pathname, l.href) ? 'page' : undefined}
                                      className={`block rounded text-[14px] leading-5 transition-colors hover:bg-tint-pink hover:text-primary focus-visible:bg-tint-pink ${
                                        wide ? 'px-2 py-2' : 'whitespace-nowrap px-5 py-2.5'
                                      } ${linkActive(pathname, l.href) ? 'font-semibold text-primary' : 'text-ink'}`}
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
          className="ml-auto hidden flex-shrink-0 whitespace-nowrap rounded bg-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary lg:block xl:px-6 xl:text-[15px]"
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
        className={`fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'visible translate-x-0' : 'pointer-events-none invisible translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-grey-line px-4 py-3">
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
              const active = itemActive(pathname, item);
              return (
                <li key={item.href}>
                  <div className="flex items-stretch">
                    <Link
                      href={item.href}
                      aria-current={linkActive(pathname, item.href) ? 'page' : undefined}
                      className={`flex min-h-[52px] flex-1 items-center px-4 text-[16px] font-medium ${active ? 'text-primary' : 'text-ink'}`}
                    >
                      {item.label}
                    </Link>
                    {hasSub && (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`m-sub-${i}`}
                        aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label} submenu`}
                        onClick={() => setExpanded(isOpen ? null : i)}
                        className="flex min-h-[52px] w-14 items-center justify-center border-l border-grey-line text-primary"
                      >
                        <Chevron open={isOpen} />
                      </button>
                    )}
                  </div>
                  {hasSub && (
                    <div id={`m-sub-${i}`} hidden={!isOpen} className="bg-tint-cyan/40 pb-2">
                      {item.overview && (
                        <Link href={item.overview.href} className="flex min-h-[48px] items-center px-6 text-[15px] font-semibold text-primary">
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
                                  className={`flex min-h-[46px] items-center px-6 text-[15px] ${
                                    linkActive(pathname, l.href) ? 'font-semibold text-primary' : 'text-ink'
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
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-grey-line p-4">
          <Link href={cta.href} className="mb-3 flex min-h-[48px] items-center justify-center rounded bg-primary text-[15px] font-semibold text-white">
            {cta.label}
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a href={site.phoneHref} className="flex min-h-[48px] items-center justify-center rounded border border-primary text-[15px] font-semibold text-primary">
              Call us
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] items-center justify-center rounded border border-secondary text-[15px] font-semibold text-secondary"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
