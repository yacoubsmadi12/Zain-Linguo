import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { Word } from "@shared/schema";

interface ArchiveResponse {
  words: Word[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export default function Archive() {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

  const { data: archiveData, isLoading, error } = useQuery<ArchiveResponse>({
    queryKey: [`/api/words/archive?page=${currentPage}&limit=12`],
  });

  // Filter words based on search and level filter
  const filteredWords = archiveData?.words?.filter(word => {
    const matchesSearch = !searchQuery || 
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = !filterLevel || filterLevel === "all" || word.cefr === filterLevel;
    
    return matchesSearch && matchesLevel;
  }) || [];

  const handleWordClick = (word: Word) => {
    // Navigate to a specific word detail view or show modal
    // For now, we'll just log it - you could implement a modal or detail page
    console.log("View word details:", word);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-6">
          <div className="bg-card rounded-lg border border-border p-6 h-24" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6 h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !archiveData) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-destructive mb-2">Unable to Load Archive</h2>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Archive Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Word Archive</h2>
        <p className="text-muted-foreground">Browse through all previous daily words</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full sm:w-48" data-testid="level-filter">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="A1">A1 - Beginner</SelectItem>
                <SelectItem value="A2">A2 - Elementary</SelectItem>
                <SelectItem value="B1">B1 - Intermediate</SelectItem>
                <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                <SelectItem value="C1">C1 - Advanced</SelectItem>
                <SelectItem value="C2">C2 - Proficiency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWords.map((word, index) => (
          <Card
            key={word.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleWordClick(word)}
            data-testid={`word-card-${word.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-primary" data-testid={`word-text-${word.id}`}>
                  {word.word}
                </h3>
                <Badge variant="outline" data-testid={`word-level-${word.id}`}>
                  {word.cefr}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-3" data-testid={`word-phonetic-${word.id}`}>
                {word.phonetic}
              </p>
              <p className="text-sm leading-relaxed line-clamp-3" data-testid={`word-definition-${word.id}`}>
                {word.definition}
              </p>
              <div className="mt-4 text-xs text-muted-foreground" data-testid={`word-date-${word.id}`}>
                {formatDate(word.date)}
              </div>
            </CardContent>
          </Card>
        ))}

      </div>

      {/* No Results */}
      {filteredWords.length === 0 && (searchQuery || (filterLevel && filterLevel !== "all")) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No words found matching your search criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setFilterLevel("all");
            }}
            className="mt-4"
            data-testid="clear-filters"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {archiveData.words.length > 0 && !searchQuery && (!filterLevel || filterLevel === "all") && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            data-testid="prev-page"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex space-x-1">
            <Badge variant="default" className="px-3 py-2" data-testid="current-page">
              {currentPage}
            </Badge>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!archiveData.pagination.hasMore}
            data-testid="next-page"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
