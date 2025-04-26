'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/assets/images/final-logo.png";
import Menu from "../../public/assets/icons/menu.svg";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Button } from "../ui/button";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-3 md:py-2">
        <Image src={Logo} alt="logo" width={180} height={28} />
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <Image
                src={Menu}
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer mr-3"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
                <Image src={Logo} alt="logo" width={152} height={23} />

                <ul className="flex flex-col gap-3 w-full">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.route;

                    return (
                      <li
                        key={item.route}
                        className={clsx(
                          "group w-full rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-[#5271ff]/100 text-sidebar-primary-foreground"
                            : "hover:bg-gray-100 text-sidebar-foreground "
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
                            className={`${isActive && "brightness-200"}`}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
            <Button asChild className='button bg-blue-300 bg-cover'>
              <Link href='/sign-in'>Login</Link>
            </Button>
          </SignedOut>
          
      </nav>
    </header>
  );
};

export default MobileNav;
