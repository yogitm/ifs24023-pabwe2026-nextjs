"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  asyncSetPost,
  asyncSetIsPostDelete,
  asyncSetIsPostLike,
  asyncSetIsPostAddComment,
  asyncSetIsPostDeleteComment,
  setIsPostActionCreator,
  setIsPostDeleteActionCreator,
  setIsPostLikedActionCreator,
  setIsPostAddCommentActionCreator,
  setIsPostAddedCommentActionCreator,
  setIsPostDeleteCommentActionCreator,
  setIsPostDeletedCommentActionCreator,
  setIsPostChangedActionCreator,
  setIsPostChangedCoverActionCreator,
} from "../states/action";
import { formatDate, showConfirmDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  IconArrowLeft,
  IconPhotoUp,
  IconPencil,
  IconTrash,
  IconHeart,
  IconMessageCircle,
  IconSend,
  IconLoader2,
} from "@tabler/icons-react";
import { PostComment } from "@/types";

function DetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const profile = useAppSelector((state) => state.profile);
  const post = useAppSelector((state) => state.post);
  const isPost = useAppSelector((state) => state.isPost);
  const isPostDeleted = useAppSelector((state) => state.isPostDeleted);
  const isPostLiked = useAppSelector((state) => state.isPostLiked);
  const isPostAddComment = useAppSelector((state) => state.isPostAddComment);
  const isPostAddedComment = useAppSelector((state) => state.isPostAddedComment);
  const isPostDeleteComment = useAppSelector((state) => state.isPostDeleteComment);
  const isPostDeletedComment = useAppSelector((state) => state.isPostDeletedComment);
  const isPostChanged = useAppSelector((state) => state.isPostChanged);
  const isPostChangedCover = useAppSelector((state) => state.isPostChangedCover);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    dispatch(asyncSetPost(postId));
  }, [postId, dispatch]);

  useEffect(() => {
    if (isPost) {
      dispatch(setIsPostActionCreator(false));
      if (!post) {
        router.push("/");
      }
    }
  }, [isPost, post, router, dispatch]);

  useEffect(() => {
    if (isPostDeleted) {
      dispatch(setIsPostDeleteActionCreator(false));
      router.push("/");
    }
  }, [isPostDeleted, router, dispatch]);

  useEffect(() => {
    if (isPostLiked) {
      dispatch(setIsPostLikedActionCreator(false));
      dispatch(asyncSetPost(postId));
    }
  }, [isPostLiked, postId, dispatch]);

  useEffect(() => {
    if (isPostAddComment) {
      dispatch(setIsPostAddCommentActionCreator(false));
      setCommentLoading(false);
      if (isPostAddedComment) {
        dispatch(setIsPostAddedCommentActionCreator(false));
        setCommentText("");
        dispatch(asyncSetPost(postId));
      }
    }
  }, [isPostAddComment, isPostAddedComment, postId, dispatch]);

  useEffect(() => {
    if (isPostDeleteComment) {
      dispatch(setIsPostDeleteCommentActionCreator(false));
      if (isPostDeletedComment) {
        dispatch(setIsPostDeletedCommentActionCreator(false));
        dispatch(asyncSetPost(postId));
      }
    }
  }, [isPostDeleteComment, isPostDeletedComment, postId, dispatch]);

  useEffect(() => {
    if (isPostChanged) {
      dispatch(setIsPostChangedActionCreator(false));
      dispatch(asyncSetPost(postId));
    }
  }, [isPostChanged, postId, dispatch]);

  useEffect(() => {
    if (isPostChangedCover) {
      dispatch(setIsPostChangedCoverActionCreator(false));
      dispatch(asyncSetPost(postId));
    }
  }, [isPostChangedCover, postId, dispatch]);

  if (!profile || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const author = post.author || post.user;
  const authorName = author?.name || "Anonim";
  const authorPhoto = author?.photo;
  const authorEmail = author?.email || "";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const isOwner =
    post.user_id === profile.id || author?.id === profile.id;
  const isLiked = Boolean(post.is_liked);
  const comments = post.comments || [];

  async function handleDeletePost() {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus postingan ini?");
    if (result.isConfirmed) {
      dispatch(asyncSetIsPostDelete(post.id));
    }
  }

  function handleToggleLike() {
    dispatch(asyncSetIsPostLike(post.id, isLiked ? 0 : 1));
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) {
      showErrorDialog("Komentar tidak boleh kosong");
      return;
    }

    setCommentLoading(true);
    dispatch(asyncSetIsPostAddComment(post.id, commentText.trim()));
  }

  async function handleDeleteComment(commentId: number | string) {
    const result = await showConfirmDialog("Apakah Anda yakin ingin menghapus komentar ini?");
    if (result.isConfirmed) {
      dispatch(asyncSetIsPostDeleteComment(post.id, commentId));
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <h1 className="sr-only">Detail Postingan</h1>

      {/* Back button & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          data-testid="back-to-posts-link"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <IconArrowLeft size={18} aria-hidden="true" />
          Kembali ke Linimasa
        </Link>

        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="edit-cover-btn"
              onClick={() => setShowCoverModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors cursor-pointer"
            >
              <IconPhotoUp size={16} aria-hidden="true" />
              Ubah Cover
            </button>
            <button
              type="button"
              data-testid="edit-post-btn"
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors cursor-pointer"
            >
              <IconPencil size={16} aria-hidden="true" />
              Ubah Postingan
            </button>
            <button
              type="button"
              data-testid="delete-post-btn"
              onClick={handleDeletePost}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors cursor-pointer"
            >
              <IconTrash size={16} aria-hidden="true" />
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Main Post Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Author Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={`Foto profil ${authorName}`}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-base">
                {authorInitial}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {authorName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {authorEmail} • {post.created_at ? formatDate(post.created_at) : "Baru saja"}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover && (
          <div className="w-full bg-slate-100 max-h-[480px] overflow-hidden flex items-center justify-center">
            <img
              src={post.cover}
              alt="Cover Postingan"
              data-testid="post-cover-image"
              className="w-full h-auto object-cover max-h-[480px]"
            />
          </div>
        )}

        {/* Post Description */}
        <div className="p-6">
          <p
            data-testid="post-description-text"
            className="text-base text-slate-800 leading-relaxed whitespace-pre-line"
          >
            {post.description}
          </p>
        </div>

        {/* Likes & Comments Count Bar */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            data-testid="like-detail-btn"
            onClick={handleToggleLike}
            aria-label={isLiked ? "Batal menyukai postingan ini" : "Sukai postingan ini"}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              isLiked
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200"
            }`}
          >
            <IconHeart
              size={20}
              aria-hidden="true"
              className={isLiked ? "fill-rose-600 text-rose-600" : ""}
            />
            <span>{isLiked ? "Disukai" : "Suka"} ({post.likes_count || 0})</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <IconMessageCircle size={20} aria-hidden="true" />
            <span>{comments.length} Komentar</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Diskusi & Komentar</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {comments.length}
          </span>
        </h3>

        {/* New Comment Form */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <label htmlFor="comment-input" className="sr-only">
            Tuliskan tanggapan atau komentar Anda
          </label>
          <textarea
            id="comment-input"
            aria-label="Tuliskan tanggapan atau komentar Anda"
            data-testid="comment-input"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            placeholder="Tuliskan tanggapan atau komentar Anda..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm resize-none transition-all"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              data-testid="submit-comment-btn"
              disabled={commentLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60 cursor-pointer"
            >
              {commentLoading ? (
                <>
                  <IconLoader2 size={16} className="animate-spin" aria-hidden="true" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <IconSend size={16} aria-hidden="true" />
                  <span>Kirim Komentar</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-sm border-t border-slate-100">
            Belum ada komentar pada postingan ini. Jadilah yang pertama memberikan tanggapan!
          </div>
        ) : (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            {comments.map((comment: PostComment) => {
              const cAuthor = comment.author || comment.user;
              const cAuthorName = cAuthor?.name || "Anonim";
              const cAuthorPhoto = cAuthor?.photo;
              const cAuthorInitial = cAuthorName.charAt(0).toUpperCase();
              const canDelete =
                profile.id === comment.user_id || profile.id === post.user_id;

              return (
                <div
                  key={comment.id}
                  data-testid={`comment-item-${comment.id}`}
                  className="flex gap-3 p-4 rounded-xl bg-slate-50/60 border border-slate-100"
                >
                  {cAuthorPhoto ? (
                    <img
                      src={cAuthorPhoto}
                      alt={`Foto profil ${cAuthorName}`}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {cAuthorInitial}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-800">
                          {cAuthorName}
                        </span>
                        <span className="text-[11px] text-slate-500 ml-2">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>

                      {canDelete && (
                        <button
                          type="button"
                          data-testid={`delete-comment-btn-${comment.id}`}
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-slate-500 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Hapus Komentar"
                          aria-label={`Hapus komentar dari ${cAuthorName}`}
                        >
                          <IconTrash size={14} aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed">
                      {comment.comment}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <ChangeCoverModal
        show={showCoverModal}
        onClose={() => setShowCoverModal(false)}
        post={post}
      />
      <ChangeModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        postId={postId}
      />
    </div>
  );
}

export default DetailPage;
