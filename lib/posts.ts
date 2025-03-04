"use client"

import { create } from "zustand"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: number
}

export interface Comment {
  id: number
  body: string
  postId: number
  user: {
    id: number
    username: string
    image?: string
  }
}

export interface User {
  id: number
  firstName: string
  lastName: string
  username: string
  email: string
  image: string
  gender?: string
  phone?: string
  birthDate?: string
  address?: {
    address: string
    city: string
    state?: string
    postalCode?: string
  }
}

interface PostsState {
  posts: Post[]
  filteredPosts: Post[]
  totalPosts: number
  loading: boolean
  error: string | null
  currentPage: number
  limit: number
  searchTerm: string
  sortBy: "default" | "likes" | "date"
  selectedTags: string[]
  allTags: string[]
  fetchPosts: (page?: number) => Promise<void>
  searchPosts: (term: string) => void
  setSortBy: (sort: "default" | "likes" | "date") => void
  setSelectedTags: (tags: string[]) => void
  fetchAllTags: () => Promise<void>
}

export const usePosts = create<PostsState>((set, get) => ({
  posts: [],
  filteredPosts: [],
  totalPosts: 0,
  loading: false,
  error: null,
  currentPage: 1,
  limit: 10,
  searchTerm: "",
  sortBy: "default",
  selectedTags: [],
  allTags: [],

  fetchPosts: async (page = 1) => {
    const { limit, searchTerm } = get()
    const skip = (page - 1) * limit

    set({ loading: true, error: null, currentPage: page })

    try {
      let url = `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`

      if (searchTerm) {
        url = `https://dummyjson.com/posts/search?q=${searchTerm}&limit=${limit}&skip=${skip}`
      }

      const response = await fetch(url)
      const data = await response.json()

      set({
        posts: data.posts,
        filteredPosts: data.posts,
        totalPosts: data.total,
        loading: false,
      })

      // Apply any active filters
      const { selectedTags, sortBy } = get()
      if (selectedTags.length > 0 || sortBy !== "default") {
        get().applyFilters()
      }
    } catch (error) {
      set({
        error: "Failed to fetch posts",
        loading: false,
      })
    }
  },

  searchPosts: (term: string) => {
    set({ searchTerm: term, currentPage: 1 })
    get().fetchPosts(1)
  },

  setSortBy: (sort: "default" | "likes" | "date") => {
    set({ sortBy: sort })
    get().applyFilters()
  },

  setSelectedTags: (tags: string[]) => {
    set({ selectedTags: tags })
    get().applyFilters()
  },

  applyFilters: () => {
    const { posts, selectedTags, sortBy } = get()

    // Filter by tags if any are selected
    let filtered = posts
    if (selectedTags.length > 0) {
      filtered = posts.filter((post) => post.tags.some((tag) => selectedTags.includes(tag)))
    }

    // Sort posts
    if (sortBy === "likes") {
      filtered = [...filtered].sort((a, b) => b.reactions - a.reactions)
    } else if (sortBy === "date") {
      // DummyJSON doesn't have dates, so we'll sort by ID as a proxy
      filtered = [...filtered].sort((a, b) => b.id - a.id)
    }

    set({ filteredPosts: filtered })
  },

  fetchAllTags: async () => {
    try {
      const response = await fetch("https://dummyjson.com/posts")
      const data = await response.json()

      // Extract all unique tags
      const tags = new Set<string>()
      data.posts.forEach((post: Post) => {
        post.tags.forEach((tag) => tags.add(tag))
      })

      set({ allTags: Array.from(tags) })
    } catch (error) {
      console.error("Failed to fetch tags:", error)
    }
  },
}))

// Functions to fetch individual post, comments, and user data
export async function fetchPost(id: number): Promise<Post> {
  const response = await fetch(`https://dummyjson.com/posts/${id}`)
  if (!response.ok) throw new Error("Failed to fetch post")
  return response.json()
}

export async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await fetch(`https://dummyjson.com/posts/${postId}/comments`)
  if (!response.ok) throw new Error("Failed to fetch comments")
  const data = await response.json()
  return data.comments
}

export async function fetchUser(userId: number): Promise<User> {
  const response = await fetch(`https://dummyjson.com/users/${userId}`)
  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
}

