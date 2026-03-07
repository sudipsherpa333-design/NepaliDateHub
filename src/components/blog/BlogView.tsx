import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Tag, Calendar, ChevronRight } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  status: "published" | "draft";
}

export function BlogView() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const storedPosts = localStorage.getItem("calchub_blog_posts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts).filter((p: BlogPost) => p.status === "published"));
    } else {
      // Add some dummy posts if none exist
      const dummyPosts: BlogPost[] = [
        {
          id: "1",
          title: "Understanding EMI Calculations in Nepal",
          excerpt: "A comprehensive guide to how banks calculate your Equated Monthly Installments.",
          content: "Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full.\n\nIn Nepal, banks typically use the reducing balance method. This means that as you pay off the principal, the interest you owe decreases. It's crucial to understand this when taking out a home loan or auto loan.",
          category: "Finance",
          date: new Date().toISOString(),
          status: "published",
        },
        {
          id: "2",
          title: "New Tax Slabs for 2080/81",
          excerpt: "Everything you need to know about the updated income tax brackets.",
          content: "The Government of Nepal has introduced new tax slabs for the fiscal year 2080/81. These changes affect both individuals and married couples.\n\nKey changes include adjustments to the basic exemption limit and modifications to the higher tax brackets. It is highly recommended to use our updated Tax Calculator to see how these changes affect your take-home salary.",
          category: "Tax",
          date: new Date(Date.now() - 86400000).toISOString(),
          status: "published",
        }
      ];
      localStorage.setItem("calchub_blog_posts", JSON.stringify(dummyPosts));
      setPosts(dummyPosts);
    }
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12"
      >
        <button
          onClick={() => setSelectedPost(null)}
          className="mb-8 text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm font-medium"
        >
          &larr; Back to all posts
        </button>
        <div className="space-y-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(selectedPost.date).toLocaleDateString()}</span>
            <span className="flex items-center"><Tag className="w-4 h-4 mr-1" /> {selectedPost.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            {selectedPost.title}
          </h1>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            {selectedPost.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          CalcHub <span className="text-blue-600 dark:text-blue-500">Blog</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Insights, guides, and updates on finance and utilities in Nepal.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedPost(post)}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 cursor-pointer flex flex-col h-full transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                {post.category}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
              {post.excerpt}
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mt-auto group">
              Read article <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No articles found matching your criteria.
        </div>
      )}
    </div>
  );
}
