"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { usePosts } from "@/lib/posts"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { PostFilter } from "@/components/post-filter"
import { Pagination } from "@/components/pagination"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const { filteredPosts, loading, fetchPosts } = usePosts()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else {
      fetchPosts()
    }
  }, [isAuthenticated, router, fetchPosts])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Feed</h1>

        <PostFilter />

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-40 bg-muted rounded-lg mb-4"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <><PostCard key={post.id} post={post} /><script>console.log("Filtered Posts:", filteredPosts);
              </script></>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">No posts found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
          </div>
        )}

        <Pagination />
      </main>
    </div>
  )
}

