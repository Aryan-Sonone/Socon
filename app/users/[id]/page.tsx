"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { fetchUser, type User, type Post } from "@/lib/posts"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        const userId = Number.parseInt(params.id)
        const userData = await fetchUser(userId)
        setUser(userData)

        // Fetch user's posts
        const response = await fetch(`https://dummyjson.com/posts/user/${userId}`)
        const data = await response.json()
        setUserPosts(data.posts)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-60 bg-muted rounded-lg"></div>
            <div className="h-40 bg-muted rounded-lg"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">User not found</h3>
            <Button asChild className="mt-4">
              <Link href="/">Go back to feed</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <Button variant="ghost" size="sm" asChild className="mb-6 flex items-center">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to feed
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.image} alt={user.username} />
                    <AvatarFallback>
                      {user.firstName?.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground mb-4">@{user.username}</p>

                  <div className="w-full space-y-3 mt-4">
                    {user.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {user.address.address}, {user.address.city}
                          {user.address.state && `, ${user.address.state}`}
                        </span>
                      </div>
                    )}
                    {user.birthDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(user.birthDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Posts</h2>
            {userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6">
                  <p className="text-center text-muted-foreground">This user hasn't posted anything yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

