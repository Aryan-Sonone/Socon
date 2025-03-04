"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchUser, type Post, type User } from "@/lib/posts"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser(post.userId)
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [post.userId])

  if (loading) {
    return (
      <Card className="mb-4 animate-pulse">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted"></div>
              <div className="h-3 w-16 rounded bg-muted"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted"></div>
            <div className="h-4 w-full rounded bg-muted"></div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full justify-between">
            <div className="flex space-x-4">
              <div className="h-5 w-16 rounded bg-muted"></div>
              <div className="h-5 w-16 rounded bg-muted"></div>
            </div>
            <div className="flex space-x-1">
              <div className="h-6 w-12 rounded bg-muted"></div>
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  // ✅ Ensure reactions is always an object
  const reactions = typeof post.reactions === "number"
    ? { likes: post.reactions, dislikes: 0 }
    : post.reactions || { likes: 0, dislikes: 0 }; // 🔹 Default fallback


  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Link href={`/users/${user?.id}`}>
            <Avatar>
              <AvatarImage src={user?.image} alt={user?.username} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link href={`/users/${user?.id}`} className="font-medium hover:underline">
              {user?.firstName} {user?.lastName}
            </Link>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground">{post.body}</p>
        </Link>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between">
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="mr-1">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {reactions.likes ?? 0} 👍 | {reactions.dislikes ?? 0} 👎
              </span>

            </div>
            <Link href={`/posts/${post.id}`} className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Comments</span>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

