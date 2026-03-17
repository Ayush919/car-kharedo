"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Car,
  Heart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  GitCompare,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { useHydratedCarStore } from "@/stores/useCarStore";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { wishlist, compareCars } = useHydratedCarStore();

  const isAdmin = (session?.user as any)?.role === "admin";

  return (
    <nav className="navbar-glass sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-md shadow-primary-500/25 transition-transform duration-300 group-hover:scale-105">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Car<span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">Kharedo</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/cars"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            >
              Buy Cars
            </Link>
            <Link
              href="/car-request"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4" />
                Request Car
              </div>
            </Link>
            <Link
              href="/wishlist"
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                Wishlist
                {wishlist.length > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-1 text-[10px] font-bold text-white shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </div>
            </Link>
            <Link
              href="/compare"
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            >
              <div className="flex items-center gap-1.5">
                <GitCompare className="h-4 w-4" />
                Compare
                {compareCars.length > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-1 text-[10px] font-bold text-white shadow-sm">
                    {compareCars.length}
                  </span>
                )}
              </div>
            </Link>

            <div className="ml-2 h-6 w-px bg-gray-200" />

            {session ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  {session.user?.name}
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-elevated animate-slide-down">
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 text-gray-400" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 text-gray-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary ml-2 !py-2.5 !px-5 text-sm">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="animate-slide-down border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/cars"
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Buy Cars
              </Link>
              <Link
                href="/car-request"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                <ClipboardList className="h-4 w-4" />
                Request Car
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Wishlist
                {wishlist.length > 0 && (
                  <span className="badge-primary">{wishlist.length}</span>
                )}
              </Link>
              <Link
                href="/compare"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                onClick={() => setMobileOpen(false)}
              >
                Compare
                {compareCars.length > 0 && (
                  <span className="badge-primary">{compareCars.length}</span>
                )}
              </Link>
              <div className="my-2 h-px bg-gray-100" />
              {session ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      onClick={() => setMobileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn-primary mx-3 mt-2 text-center text-sm" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
