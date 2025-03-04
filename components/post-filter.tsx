"use client"

import { useState, useEffect } from "react"
import { usePosts } from "@/lib/posts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Filter, SortAsc, ThumbsUp, Clock } from "lucide-react"

export function PostFilter() {
  const { allTags, selectedTags, setSelectedTags, setSortBy, sortBy, fetchAllTags } = usePosts()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchAllTags()
  }, [fetchAllTags])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSortBy("default")
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2 items-center">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[200px] overflow-y-auto">
              {allTags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  {tag}
                  {selectedTags.includes(tag) && <span className="text-primary">✓</span>}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <SortAsc className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("default")} className="flex items-center gap-2 cursor-pointer">
              {sortBy === "default" && <span className="text-primary">✓</span>}
              Default
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("likes")} className="flex items-center gap-2 cursor-pointer">
              {sortBy === "likes" && <span className="text-primary">✓</span>}
              <ThumbsUp className="h-4 w-4" />
              Most Liked
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("date")} className="flex items-center gap-2 cursor-pointer">
              {sortBy === "date" && <span className="text-primary">✓</span>}
              <Clock className="h-4 w-4" />
              Newest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {(selectedTags.length > 0 || sortBy !== "default") && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button onClick={() => toggleTag(tag)} className="ml-1 rounded-full hover:bg-muted p-0.5">
              ×
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}

