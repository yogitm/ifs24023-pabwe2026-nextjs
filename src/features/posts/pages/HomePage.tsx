"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsPostDelete,
  asyncSetIsPostLike,
  asyncSetPosts,
  setIsPostDeleteActionCreator,
  setIsPostLikedActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import {
  IconPlus,
  IconArticle,
  IconHeart,
  IconMessageCircle,
  IconUser,
  IconPencil,
  IconTrash,
  IconFilter,
  IconSearch,
  IconLoader2,
  IconArrowRight,
} from "@tabler/icons-react";
import { Post } from "@/types";

function HomePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const profile = useAppSelector((state) => state.profile);
  const posts = useAppSelector((state) => state.posts);
  const isPostDeleted = useAppSelector((state) => state.isPostDeleted);
  const isPostLiked = useAppSelector((state) => state.isPostLiked);

  const initialFilter = searchParams?.get("is_me") === "1" ? "1" : "";
  const [filter, setFilter] = useState(initialFilter);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);

  useEffect(() => {
    if (searchParams?.get("is_me") === "1") {
      setFilter("1");
    }
  }, [searchParams]);

  useEffect(() => {
    setLoadingPosts(true);
    Promise.resolve(dispatch(asyncSetPosts(filter))).finally(() => {
      setLoadingPosts(false);
    });
  }, [filter, dispatch]);

  useEffect(() => {
    if (isPostDeleted) {
      dispatch(setIsPostDeleteActionCreator(false));
      dispatch(asyncSetPosts(filter));
    }
  }, [isPostDeleted, filter, dispatch]);

  useEffect(() => {
    if (isPostLiked) {
      dispatch(setIsPostLikedActionCreator(false));
      dispatch(asyncSetPosts(filter));
    }
  }, [isPostLiked, filter, dispatch]);

  if (!profile) return null;

  async function handleDeletePost(postId: number | string) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus postingan ini?");
    if (result.isConfirmed) {
      dispatch(asyncSetIsPostDelete(postId));
    }
  }

  function handleToggleLike(postId: number | string, isLiked: boolean | number | undefined) {
    dispatch(asyncSetIsPostLike(postId, isLiked ? 0 : 1));
  }

  const postList = posts || [];
  const filteredPosts = postList.filter((post) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const desc = (post.description || "").toLowerCase();
    const author = post.author || post.user;
    const authorName = (author?.name || "").toLowerCase();
    return desc.includes(q) || authorName.includes(q);
  });

  const totalCount = postList.length;
  const myPostsCount = postList.filter(
    (p) => p.user_id === profile.id || p.author?.id === profile.id
  ).length;
  const totalLikes = postList.reduce((acc, p) => acc + (p.likes_count || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Linimasa Postingan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bagikan pemikiran, cerita, dan diskusikan ide bersama komunitas Anda.
          </p>
        </div>

        <button
          type="button"
          data-testid="add-post-btn"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <IconPlus size={18} stroke={2.5} />
          <span>Tambah Postingan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Postingan
            </p>
            <p className="text-3xl font-black text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <IconArticle size={26} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Postingan Saya
            </p>
            <p className="text-3xl font-black text-emerald-600 mt-1">
              {myPostsCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IconUser size={26} stroke={2} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Suka
            </p>
            <p className="text-3xl font-black text-rose-600 mt-1">{totalLikes}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <IconHeart size={26} stroke={2} />
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <IconSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            id="search-post-input"
            aria-label="Cari postingan atau nama pembuat"
            data-testid="search-post-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari postingan atau nama pembuat..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
            <IconFilter size={16} /> Filter:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              data-testid="filter-all-btn"
              onClick={() => setFilter("")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === ""
                  ? "bg-white text-indigo-600 shadow-xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Semua Postingan
            </button>
            <button
              type="button"
              data-testid="filter-me-btn"
              onClick={() => setFilter("1")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === "1"
                  ? "bg-white text-indigo-600 shadow-xs font-bold"
                  : "hover:text-slate-900"
              }`}
            >
              Postingan Saya
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {loadingPosts && postList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80">
          <IconLoader2 size={32} className="animate-spin text-indigo-600 mb-2" />
          <p className="text-sm font-medium text-slate-500">Memuat postingan...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
            <IconArticle size={32} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Belum ada postingan</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "Tidak ada postingan yang cocok dengan kata kunci pencarian Anda."
              : "Jadilah yang pertama membuat postingan di linimasa ini!"}
          </p>
          <button
            type="button"
            data-testid="empty-add-post-btn"
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
          >
            <IconPlus size={16} /> Buat Postingan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post: Post) => {
            const author = post.author || post.user;
            const authorName = author?.name || "Anonim";
            const authorPhoto = author?.photo;
            const authorInitial = authorName.charAt(0).toUpperCase();
            const isOwner =
              post.user_id === profile.id || (author && author.id === profile.id);
            const isLiked = Boolean(post.is_liked);

            return (
              <div
                key={post.id}
                data-testid={`post-card-${post.id}`}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-md transition-all"
              >
                {/* Post Author Header */}
                <div className="p-5 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {authorPhoto ? (
                      <img
                        src={authorPhoto}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                        {authorInitial}
                      </div>
                    )}
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 leading-tight">
                        {authorName}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {post.created_at ? formatDate(post.created_at) : "Baru saja"}
                      </p>
                    </div>
                  </div>

                  {isOwner && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        data-testid={`edit-post-btn-${post.id}`}
                        onClick={() => {
                          setSelectedPostId(post.id);
                          setShowChangeModal(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Ubah Postingan"
                        aria-label="Ubah Postingan"
                      >
                        <IconPencil size={18} />
                      </button>
                      <button
                        type="button"
                        data-testid={`delete-post-btn-${post.id}`}
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Postingan"
                        aria-label="Hapus Postingan"
                      >
                        <IconTrash size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                {post.cover && (
                  <div className="w-full bg-slate-100 max-h-96 overflow-hidden">
                    <img
                      src={post.cover}
                      alt="Cover Postingan"
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-5">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.description}
                  </p>
                </div>

                {/* Footer Interaction Bar */}
                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      data-testid={`like-post-btn-${post.id}`}
                      onClick={() => handleToggleLike(post.id, post.is_liked)}
                      className={`inline-flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                        isLiked
                          ? "text-rose-600 hover:text-rose-700"
                          : "text-slate-500 hover:text-rose-600"
                      }`}
                    >
                      <IconHeart
                        size={18}
                        className={isLiked ? "fill-rose-600 text-rose-600" : ""}
                      />
                      <span>{post.likes_count || 0} Suka</span>
                    </button>

                    <button
                      type="button"
                      data-testid={`comment-post-btn-${post.id}`}
                      onClick={() => router.push(`/posts/${post.id}`)}
                      className="inline-flex items-center gap-1.5 font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      <IconMessageCircle size={18} />
                      <span>{post.comments_count || 0} Komentar</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    data-testid={`view-detail-btn-${post.id}`}
                    onClick={() => router.push(`/posts/${post.id}`)}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    <span>Lihat Detail</span>
                    <IconArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => {
          setShowChangeModal(false);
          setSelectedPostId(null);
        }}
        postId={selectedPostId}
      />
    </div>
  );
}

export default HomePage;
