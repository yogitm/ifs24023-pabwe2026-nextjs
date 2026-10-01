import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setPostsActionCreator,
  asyncSetPosts,
  setPostActionCreator,
  setIsPostActionCreator,
  asyncSetPost,
  setIsPostAddActionCreator,
  setIsPostAddedActionCreator,
  asyncSetIsPostAdd,
  setIsPostChangeActionCreator,
  setIsPostChangedActionCreator,
  asyncSetIsPostChange,
  setIsPostChangeCoverActionCreator,
  setIsPostChangedCoverActionCreator,
  asyncSetIsPostChangeCover,
  setIsPostDeleteActionCreator,
  setIsPostDeletedActionCreator,
  asyncSetIsPostDelete,
  setIsPostLikeActionCreator,
  setIsPostLikedActionCreator,
  asyncSetIsPostLike,
  setIsPostAddCommentActionCreator,
  setIsPostAddedCommentActionCreator,
  asyncSetIsPostAddComment,
  setIsPostDeleteCommentActionCreator,
  setIsPostDeletedCommentActionCreator,
  asyncSetIsPostDeleteComment,
  setIsPostDeleteAllActionCreator,
  setIsPostDeletedAllActionCreator,
  asyncSetIsPostDeleteAll,
} from "./action";
import postApi from "../api/postApi";
import * as toolsHelper from "../../../helpers/toolsHelper";
import { Post } from "@/types";

describe("posts actions", () => {
  const dummyPost: Post = {
    id: 1,
    user_id: 1,
    description: "Sample description",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create correct action objects", () => {
    expect(setPostsActionCreator([dummyPost])).toEqual({
      type: ActionType.SET_POSTS,
      payload: [dummyPost],
    });
    expect(setPostActionCreator(dummyPost)).toEqual({
      type: ActionType.SET_POST,
      payload: dummyPost,
    });
    expect(setIsPostActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST,
      payload: true,
    });
    expect(setIsPostAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADD,
      payload: true,
    });
    expect(setIsPostAddedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADDED,
      payload: true,
    });
    expect(setIsPostChangeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGE,
      payload: true,
    });
    expect(setIsPostChangedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGED,
      payload: true,
    });
    expect(setIsPostChangeCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGE_COVER,
      payload: true,
    });
    expect(setIsPostChangedCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGED_COVER,
      payload: true,
    });
    expect(setIsPostDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE,
      payload: true,
    });
    expect(setIsPostDeletedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED,
      payload: true,
    });
    expect(setIsPostLikeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_LIKE,
      payload: true,
    });
    expect(setIsPostLikedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_LIKED,
      payload: true,
    });
    expect(setIsPostAddCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADD_COMMENT,
      payload: true,
    });
    expect(setIsPostAddedCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADDED_COMMENT,
      payload: true,
    });
    expect(setIsPostDeleteCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE_COMMENT,
      payload: true,
    });
    expect(setIsPostDeletedCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED_COMMENT,
      payload: true,
    });
    expect(setIsPostDeleteAllActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE_ALL,
      payload: true,
    });
    expect(setIsPostDeletedAllActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED_ALL,
      payload: true,
    });
  });

  describe("asyncSetPosts", () => {
    it("should dispatch setPostsActionCreator on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPosts").mockResolvedValue([dummyPost]);

      await asyncSetPosts()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator([dummyPost]));

      await asyncSetPosts("1", "test")(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator([dummyPost]));
    });

    it("should dispatch setPostsActionCreator with empty array on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPosts").mockRejectedValue(new Error("Failed"));

      await asyncSetPosts()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator([]));
    });
  });

  describe("asyncSetPost", () => {
    it("should dispatch setPostActionCreator and setIsPostActionCreator on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPostById").mockResolvedValue(dummyPost);

      await asyncSetPost(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setPostActionCreator(dummyPost));
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
    });

    it("should dispatch setPostActionCreator(null) and setIsPostActionCreator(true) on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPostById").mockRejectedValue(new Error("Failed"));

      await asyncSetPost(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setPostActionCreator(null));
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
    });
  });

  describe("asyncSetIsPostAdd", () => {
    it("should handle success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPost").mockResolvedValue(dummyPost);
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      await asyncSetIsPostAdd("New post")(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Postingan berhasil ditambahkan!");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddActionCreator(true));
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPost").mockRejectedValue(new Error("Add failed"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostAdd("New post")(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Add failed");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddActionCreator(true));
    });
  });

  describe("asyncSetIsPostChange", () => {
    it("should handle success with custom message or default message", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "putPost").mockResolvedValue("Custom updated message");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      await asyncSetIsPostChange(1, "Updated post")(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Custom updated message");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeActionCreator(true));

      vi.spyOn(postApi, "putPost").mockResolvedValue("");
      await asyncSetIsPostChange(1, "Updated post")(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Postingan berhasil diperbarui!");
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "putPost").mockRejectedValue(new Error("Update failed"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostChange(1, "Updated post")(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Update failed");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeActionCreator(true));
    });
  });

  describe("asyncSetIsPostChangeCover", () => {
    const dummyFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });

    it("should handle success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPostCover").mockResolvedValue("Cover updated");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      await asyncSetIsPostChangeCover(1, dummyFile)(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Cover updated");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeCoverActionCreator(true));

      vi.spyOn(postApi, "postPostCover").mockResolvedValue("");
      await asyncSetIsPostChangeCover(1, dummyFile)(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Cover berhasil diperbarui!");
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPostCover").mockRejectedValue(new Error("Cover error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostChangeCover(1, dummyFile)(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Cover error");
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangedCoverActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostChangeCoverActionCreator(true));
    });
  });

  describe("asyncSetIsPostDelete", () => {
    it("should handle success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deletePost").mockResolvedValue("Post deleted");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      await asyncSetIsPostDelete(1)(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Post deleted");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteActionCreator(true));

      vi.spyOn(postApi, "deletePost").mockResolvedValue("");
      await asyncSetIsPostDelete(1)(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Postingan berhasil dihapus!");
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deletePost").mockRejectedValue(new Error("Delete error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostDelete(1)(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Delete error");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteActionCreator(true));
    });
  });

  describe("asyncSetIsPostLike", () => {
    it("should handle success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postLike").mockResolvedValue("Liked");

      await asyncSetIsPostLike(1, 1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikeActionCreator(true));
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postLike").mockRejectedValue(new Error("Like error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostLike(1, 1)(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Like error");
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikedActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostLikeActionCreator(true));
    });
  });

  describe("asyncSetIsPostAddComment", () => {
    it("should handle success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postComment").mockResolvedValue({ id: 10, comment: "Hello" });
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      await asyncSetIsPostAddComment(1, "Hello")(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Komentar berhasil ditambahkan!");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedCommentActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddCommentActionCreator(true));
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postComment").mockRejectedValue(new Error("Comment error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostAddComment(1, "Hello")(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Comment error");
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddedCommentActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostAddCommentActionCreator(true));
    });
  });

  describe("asyncSetIsPostDeleteComment", () => {
    it("should handle success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteComment").mockResolvedValue("Comment deleted");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      await asyncSetIsPostDeleteComment(1, 10)(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Comment deleted");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedCommentActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteCommentActionCreator(true));

      vi.spyOn(postApi, "deleteComment").mockResolvedValue("");
      await asyncSetIsPostDeleteComment(1, 10)(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Komentar berhasil dihapus!");
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteComment").mockRejectedValue(new Error("Comment delete error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostDeleteComment(1, 10)(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Comment delete error");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedCommentActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteCommentActionCreator(true));
    });
  });

  describe("asyncSetIsPostDeleteAll", () => {
    it("should handle success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValue("All posts deleted");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      await asyncSetIsPostDeleteAll()(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("All posts deleted");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedAllActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteAllActionCreator(true));

      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValue("");
      await asyncSetIsPostDeleteAll()(dispatch);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Semua postingan berhasil dihapus!");
    });

    it("should handle error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteAllPosts").mockRejectedValue(new Error("Delete all error"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetIsPostDeleteAll()(dispatch);
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Delete all error");
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeletedAllActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setIsPostDeleteAllActionCreator(true));
    });
  });
});
