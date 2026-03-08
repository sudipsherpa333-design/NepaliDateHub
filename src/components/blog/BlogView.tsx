import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, Tag, Calendar, ChevronRight, Clock, Eye, Heart, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CommentSection } from "./CommentSection";

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  author: string;
  readingTime: number;
  views: number;
  likes: number;
  likedBy?: string[];
  createdAt: string;
  status: "published" | "draft";
}

const getDeviceId = () => {
  let deviceId = localStorage.getItem("calchub_device_id");
  if (!deviceId) {
    deviceId = "device-" + Date.now() + "-" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("calchub_device_id", deviceId);
  }
  return deviceId;
};

export function BlogView() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog?q=${searchQuery}&category=${selectedCategory}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (selectedPost) {
      document.title = `${selectedPost.title} | CalcHub Blog`;
      updateMetaTag('description', selectedPost.excerpt);
      updateMetaTag('keywords', selectedPost.tags?.join(', ') || 'finance, calculators, nepal');
      updateMetaTag('og:title', `${selectedPost.title} | CalcHub Blog`, true);
      updateMetaTag('og:description', selectedPost.excerpt, true);
      updateMetaTag('og:type', 'article', true);
      if (selectedPost.coverImage) {
        updateMetaTag('og:image', selectedPost.coverImage, true);
      }
    } else {
      document.title = "CalcHub Blog";
      updateMetaTag('description', "Insights, guides, and updates on finance and utilities in Nepal.");
      updateMetaTag('keywords', "blog, finance, nepal, calculators, utilities, tax, emi");
      updateMetaTag('og:title', "CalcHub Blog", true);
      updateMetaTag('og:description', "Insights, guides, and updates on finance and utilities in Nepal.", true);
      updateMetaTag('og:type', 'website', true);
      updateMetaTag('og:image', '', true);
    }

    return () => {
      document.title = "CalcHub";
      updateMetaTag('description', "CalcHub - Your ultimate utility and finance calculators.");
      updateMetaTag('keywords', "calculator, finance, nepal, emi, tax, unit converter");
      updateMetaTag('og:title', "CalcHub", true);
      updateMetaTag('og:description', "CalcHub - Your ultimate utility and finance calculators.", true);
      updateMetaTag('og:type', 'website', true);
      updateMetaTag('og:image', '', true);
    };
  }, [selectedPost]);

  const viewPost = async (slug: string) => {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPost(data);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleLike = async () => {
    if (!selectedPost) return;
    try {
      const deviceId = getDeviceId();
      const res = await fetch(`/api/blog/${selectedPost._id}/like`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ deviceId })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedPost({ ...selectedPost, likes: data.likes, likedBy: data.likedBy });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const categories = ["All", "Finance", "Tax", "Technology", "Life"];

  if (selectedPost) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {selectedPost.coverImage && (
          <div className="w-full h-64 md:h-96 relative">
            <img 
              src={selectedPost.coverImage} 
              alt={selectedPost.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        )}
        
        <div className="p-8 md:p-12">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-8 text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm font-medium"
          >
            &larr; Back to all posts
          </button>
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {selectedPost.category}
              </span>
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {selectedPost.readingTime} min read</span>
              <span className="flex items-center"><Eye className="w-4 h-4 mr-1" /> {selectedPost.views} views</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {selectedPost.title}
            </h1>
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {selectedPost.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedPost.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleLike} 
                  className={`p-2 rounded-full transition-colors flex items-center ${
                    selectedPost.likedBy?.includes(getDeviceId()) 
                      ? "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400" 
                      : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-1 ${selectedPost.likedBy?.includes(getDeviceId()) ? "fill-current" : ""}`} /> {selectedPost.likes}
                </button>
                <button className="p-2 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 mt-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedPost.content}
              </ReactMarkdown>
            </div>
            
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <Tag className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Related Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full transition-colors cursor-pointer border border-blue-100 dark:border-blue-800/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <CommentSection postId={selectedPost._id} />
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

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              onClick={() => viewPost(post.slug)}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer flex flex-col h-full transition-all hover:shadow-md group"
            >
              {post.coverImage ? (
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="h-48 w-full bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                  <Tag className="w-12 h-12 text-blue-300 dark:text-blue-700/50" />
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {post.readingTime} min
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-[10px] font-medium rounded-md uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-[10px] font-medium rounded-md">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Read <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No articles found matching your criteria.
        </div>
      )}
    </div>
  );
}
