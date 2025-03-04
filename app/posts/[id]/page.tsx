"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { fetchPost, fetchComments, fetchUser, type Post, type Comment, type User } from "@/lib/posts"
import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, ArrowLeft } from "lucide-react"

export default function PostPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        const postId = Number.parseInt(params.id)
        const postData = await fetchPost(postId)
        setPost(postData)

        const commentsData = await fetchComments(postId)
        setComments(commentsData)

        const userData = await fetchUser(postData.userId)
        setUser(userData)
      } catch (error) {
        console.error("Error fetching data:", error)
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

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">Post not found</h3>
            <Button asChild className="mt-4">
              <Link href="/">Go back to feed</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }
  // ✅ Ensure reactions is always an object
  const reactions = typeof post.reactions === "number"
    ? { likes: post.reactions, dislikes: 0 }
    : post.reactions || { likes: 0, dislikes: 0 }; // 🔹 Default fallback

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

        <Card className="mb-8">
          <CardHeader>
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
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <p className="text-muted-foreground mb-4">{post.body}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {reactions.likes ?? 0} 👍 | {reactions.dislikes ?? 0} 👎
                </span>


              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                <span>{comments.length}</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <Link href={`/users/${comment.user.id}`}>
                      <Avatar>
                        <AvatarImage src={comment.user.image} alt={comment.user.username} />
                        <AvatarFallback>{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <Link href={`/users/${comment.user.id}`} className="font-medium hover:underline">
                      @{comment.user.username}
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{comment.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">No comments yet</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

