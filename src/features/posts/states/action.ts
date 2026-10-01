import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import postApi from "../api/postApi";
import { Dispatch } from "@reduxjs/toolkit";
import { Post } from "@/types";

export const ActionType = {
  SET_POSTS: "SET_POSTS",
  SET_POST: "SET_POST",
  SET_IS_POST: "SET_IS_POST",
  SET_IS_POST_ADD: "SET_IS_POST_ADD",
  SET_IS_POST_ADDED: "SET_IS_POST_ADDED",
  SET_IS_POST_CHANGE: "SET_IS_POST_CHANGE",
  SET_IS_POST_CHANGED: "SET_IS_POST_CHANGED",
  SET_IS_POST_CHANGE_COVER: "SET_IS_POST_CHANGE_COVER",
  SET_IS_POST_CHANGED_COVER: "SET_IS_POST_CHANGED_COVER",
  SET_IS_POST_DELETE: "SET_IS_POST_DELETE",
  SET_IS_POST_DELETED: "SET_IS_POST_DELETED",
  SET_IS_POST_LIKE: "SET_IS_POST_LIKE",
  SET_IS_POST_LIKED: "SET_IS_POST_LIKED",
  SET_IS_POST_ADD_COMMENT: "SET_IS_POST_ADD_COMMENT",
  SET_IS_POST_ADDED_COMMENT: "SET_IS_POST_ADDED_COMMENT",
  SET_IS_POST_DELETE_COMMENT: "SET_IS_POST_DELETE_COMMENT",
  SET_IS_POST_DELETED_COMMENT: "SET_IS_POST_DELETED_COMMENT",
  SET_IS_POST_DELETE_ALL: "SET_IS_POST_DELETE_ALL",
  SET_IS_POST_DELETED_ALL: "SET_IS_POST_DELETED_ALL",
};

export function setPostsActionCreator(posts: Post[]) {
  return {
    type: ActionType.SET_POSTS,
    payload: posts,
  };
}

export function asyncSetPosts(is_me: boolean | number | string = "", search = "") {
  return async (dispatch: Dispatch) => {
    try {
      const posts = await postApi.getPosts(is_me, search);
      dispatch(setPostsActionCreator(posts));
    } catch {
      dispatch(setPostsActionCreator([]));
    }
  };
}

export function setPostActionCreator(post: Post | null) {
  return {
    type: ActionType.SET_POST,
    payload: post,
  };
}

export function setIsPostActionCreator(status: boolean) {
  return {
    type: ActionType.SET_IS_POST,
    payload: status,
  };
}

export function asyncSetPost(postId: number | string) {
  return async (dispatch: Dispatch) => {
    try {
      const post = await postApi.getPostById(postId);
      dispatch(setPostActionCreator(post));
    } catch {
      dispatch(setPostActionCreator(null));
    } finally {
      dispatch(setIsPostActionCreator(true));
    }
  };
}

export function setIsPostAddActionCreator(isPostAdd: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADD,
    payload: isPostAdd,
  };
}

export function setIsPostAddedActionCreator(isPostAdded: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADDED,
    payload: isPostAdded,
  };
}

export function asyncSetIsPostAdd(description: string) {
  return async (dispatch: Dispatch) => {
    try {
      await postApi.postPost(description);
      showSuccessDialog("Postingan berhasil ditambahkan!");
      dispatch(setIsPostAddedActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostAddedActionCreator(false));
    } finally {
      dispatch(setIsPostAddActionCreator(true));
    }
  };
}

export function setIsPostChangeActionCreator(isPostChange: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGE,
    payload: isPostChange,
  };
}

export function setIsPostChangedActionCreator(isPostChanged: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGED,
    payload: isPostChanged,
  };
}

export function asyncSetIsPostChange(postId: number | string, description: string) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await postApi.putPost(postId, description);
      showSuccessDialog(message || "Postingan berhasil diperbarui!");
      dispatch(setIsPostChangedActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostChangedActionCreator(false));
    } finally {
      dispatch(setIsPostChangeActionCreator(true));
    }
  };
}

export function setIsPostChangeCoverActionCreator(isPostChangeCover: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGE_COVER,
    payload: isPostChangeCover,
  };
}

export function setIsPostChangedCoverActionCreator(status: boolean) {
  return {
    type: ActionType.SET_IS_POST_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsPostChangeCover(postId: number | string, cover: File) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await postApi.postPostCover(postId, cover);
      showSuccessDialog(message || "Cover berhasil diperbarui!");
      dispatch(setIsPostChangedCoverActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostChangedCoverActionCreator(false));
    } finally {
      dispatch(setIsPostChangeCoverActionCreator(true));
    }
  };
}

export function setIsPostDeleteActionCreator(isPostDelete: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETE,
    payload: isPostDelete,
  };
}

export function setIsPostDeletedActionCreator(isPostDeleted: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETED,
    payload: isPostDeleted,
  };
}

export function asyncSetIsPostDelete(postId: number | string) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await postApi.deletePost(postId);
      showSuccessDialog(message || "Postingan berhasil dihapus!");
      dispatch(setIsPostDeletedActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostDeletedActionCreator(false));
    } finally {
      dispatch(setIsPostDeleteActionCreator(true));
    }
  };
}

export function setIsPostLikeActionCreator(isPostLike: boolean) {
  return {
    type: ActionType.SET_IS_POST_LIKE,
    payload: isPostLike,
  };
}

export function setIsPostLikedActionCreator(isPostLiked: boolean) {
  return {
    type: ActionType.SET_IS_POST_LIKED,
    payload: isPostLiked,
  };
}

export function asyncSetIsPostLike(postId: number | string, like: number | boolean) {
  return async (dispatch: Dispatch) => {
    try {
      await postApi.postLike(postId, like);
      dispatch(setIsPostLikedActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostLikedActionCreator(false));
    } finally {
      dispatch(setIsPostLikeActionCreator(true));
    }
  };
}

export function setIsPostAddCommentActionCreator(isPostAddComment: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADD_COMMENT,
    payload: isPostAddComment,
  };
}

export function setIsPostAddedCommentActionCreator(isPostAddedComment: boolean) {
  return {
    type: ActionType.SET_IS_POST_ADDED_COMMENT,
    payload: isPostAddedComment,
  };
}

export function asyncSetIsPostAddComment(postId: number | string, comment: string) {
  return async (dispatch: Dispatch) => {
    try {
      await postApi.postComment(postId, comment);
      showSuccessDialog("Komentar berhasil ditambahkan!");
      dispatch(setIsPostAddedCommentActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostAddedCommentActionCreator(false));
    } finally {
      dispatch(setIsPostAddCommentActionCreator(true));
    }
  };
}

export function setIsPostDeleteCommentActionCreator(isPostDeleteComment: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETE_COMMENT,
    payload: isPostDeleteComment,
  };
}

export function setIsPostDeletedCommentActionCreator(isPostDeletedComment: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETED_COMMENT,
    payload: isPostDeletedComment,
  };
}

export function asyncSetIsPostDeleteComment(postId: number | string, commentId: number | string) {
  return async (dispatch: Dispatch) => {
    try {
      const message = await postApi.deleteComment(postId, commentId);
      showSuccessDialog(message || "Komentar berhasil dihapus!");
      dispatch(setIsPostDeletedCommentActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostDeletedCommentActionCreator(false));
    } finally {
      dispatch(setIsPostDeleteCommentActionCreator(true));
    }
  };
}

export function setIsPostDeleteAllActionCreator(isPostDeleteAll: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETE_ALL,
    payload: isPostDeleteAll,
  };
}

export function setIsPostDeletedAllActionCreator(isPostDeletedAll: boolean) {
  return {
    type: ActionType.SET_IS_POST_DELETED_ALL,
    payload: isPostDeletedAll,
  };
}

export function asyncSetIsPostDeleteAll() {
  return async (dispatch: Dispatch) => {
    try {
      const message = await postApi.deleteAllPosts();
      showSuccessDialog(message || "Semua postingan berhasil dihapus!");
      dispatch(setIsPostDeletedAllActionCreator(true));
    } catch (error: any) {
      showErrorDialog(error.message);
      dispatch(setIsPostDeletedAllActionCreator(false));
    } finally {
      dispatch(setIsPostDeleteAllActionCreator(true));
    }
  };
}
