"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Home, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { usePosts } from "@/lib/posts"
import { useState } from "react"

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const pathname = usePathname()
  const { searchPosts } = usePosts()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchPosts(searchTerm)
  }

  if (!isAuthenticated) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Social Cot</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:justify-between sm:space-x-4">
          <form onSubmit={handleSearch} className="hidden sm:flex-1 sm:flex max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <nav className="flex items-center space-x-2">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="icon" className="w-9 px-0">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>

            <Link href={`/users/${user?.id}`}>
              <Button
                variant={pathname === `/users/${user?.id}` ? "default" : "ghost"}
                size="icon"
                className="w-9 px-0"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>

            <ThemeSwitcher />

            <div className="flex items-center space-x-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt={user?.username} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <Button variant="ghost" size="icon" onClick={logout} className="w-9 px-0">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

