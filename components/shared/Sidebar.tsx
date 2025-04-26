'use client'

import { navLinks } from '@/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Button } from '../ui/button'

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="flex flex-col gap-3 w-full h-full">
        <Link href="/" className="sidebar-logo">
          <Image
            src="/assets/images/final-logo.png"
            alt="App Logo"
            width={180}
            height={28}
            priority
          />
        </Link>

        <nav className="flex flex-col gap-55"> {/* Adjusted gap here */}
          <SignedIn>
            <ul className="flex flex-col gap-4 w-full"> {/* Adjusted gap here */}
              {navLinks.slice(0, 6).map((item) => {
                const isActive = pathname === item.route

                return (
                  <li
                    key={item.route}
                    className={clsx(
                      'group w-full rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-[#5271ff]/100 text-sidebar-primary-foreground'
                        : 'hover:bg-gray-100 text-sidebar-foreground'
                    )}
                  >
                    <Link
                      href={item.route}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium"
                    >
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((item) => {
                const isActive = pathname === item.route

                return (
                  <li
                    key={item.route}
                    className={clsx(
                      'group w-full rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-[#5271ff]/100 text-sidebar-primary-foreground'
                        : 'hover:bg-gray-100 text-sidebar-foreground'
                    )}
                  >
                    <Link
                      href={item.route}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium"
                    >
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}

              <li className="cursor-pointer gap-4 p-4">
                <UserButton afterSignOutUrl="/" showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button asChild className="button bg-blue-300 bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
