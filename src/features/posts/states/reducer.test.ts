import { describe, it, expect } from "vitest";
import { ActionType } from "./action";
import {
  postsReducer,
  postReducer,
  isPostReducer,
  isPostAddReducer,
  isPostAddedReducer,
  isPostChangeReducer,
  isPostChangedReducer,
  isPostChangeCoverReducer,
  isPostChangedCoverReducer,
  isPostDeleteReducer,
  isPostDeletedReducer,
  isPostLikeReducer,
  isPostLikedReducer,
  isPostAddCommentReducer,
  isPostAddedCommentReducer,
  isPostDeleteCommentReducer,
  isPostDeletedCommentReducer,
  isPostDeleteAllReducer,
  isPostDeletedAllReducer,
} from "./reducer";
import { Post } from "@/types";

describe("posts reducers", () => {
  const dummyPost: Post = {
    id: 1,
    user_id: 1,
    description: "Post description",
  };

  it("postsReducer should handle action correctly", () => {
    expect(postsReducer(undefined, {})).toEqual([]);
    expect(
      postsReducer([], {
        type: ActionType.SET_POSTS,
        payload: [dummyPost],
      })
    ).toEqual([dummyPost]);
    expect(
      postsReducer([dummyPost], {
        type: "UNKNOWN",
      })
    ).toEqual([dummyPost]);
  });

  it("postReducer should handle action correctly", () => {
    expect(postReducer(undefined, {})).toBeNull();
    expect(
      postReducer(null, {
        type: ActionType.SET_POST,
        payload: dummyPost,
      })
    ).toEqual(dummyPost);
    expect(
      postReducer(dummyPost, {
        type: "UNKNOWN",
      })
    ).toEqual(dummyPost);
  });

  it("isPostReducer should handle action correctly", () => {
    expect(isPostReducer(undefined, {})).toBe(false);
    expect(
      isPostReducer(false, {
        type: ActionType.SET_IS_POST,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostAddReducer should handle action correctly", () => {
    expect(isPostAddReducer(undefined, {})).toBe(false);
    expect(
      isPostAddReducer(false, {
        type: ActionType.SET_IS_POST_ADD,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostAddReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostAddedReducer should handle action correctly", () => {
    expect(isPostAddedReducer(undefined, {})).toBe(false);
    expect(
      isPostAddedReducer(false, {
        type: ActionType.SET_IS_POST_ADDED,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostAddedReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostChangeReducer should handle action correctly", () => {
    expect(isPostChangeReducer(undefined, {})).toBe(false);
    expect(
      isPostChangeReducer(false, {
        type: ActionType.SET_IS_POST_CHANGE,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostChangeReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostChangedReducer should handle action correctly", () => {
    expect(isPostChangedReducer(undefined, {})).toBe(false);
    expect(
      isPostChangedReducer(false, {
        type: ActionType.SET_IS_POST_CHANGED,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostChangedReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostChangeCoverReducer should handle action correctly", () => {
    expect(isPostChangeCoverReducer(undefined, {})).toBe(false);
    expect(
      isPostChangeCoverReducer(false, {
        type: ActionType.SET_IS_POST_CHANGE_COVER,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostChangeCoverReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostChangedCoverReducer should handle action correctly", () => {
    expect(isPostChangedCoverReducer(undefined, {})).toBe(false);
    expect(
      isPostChangedCoverReducer(false, {
        type: ActionType.SET_IS_POST_CHANGED_COVER,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostChangedCoverReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostDeleteReducer should handle action correctly", () => {
    expect(isPostDeleteReducer(undefined, {})).toBe(false);
    expect(
      isPostDeleteReducer(false, {
        type: ActionType.SET_IS_POST_DELETE,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostDeleteReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostDeletedReducer should handle action correctly", () => {
    expect(isPostDeletedReducer(undefined, {})).toBe(false);
    expect(
      isPostDeletedReducer(false, {
        type: ActionType.SET_IS_POST_DELETED,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostDeletedReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostLikeReducer should handle action correctly", () => {
    expect(isPostLikeReducer(undefined, {})).toBe(false);
    expect(
      isPostLikeReducer(false, {
        type: ActionType.SET_IS_POST_LIKE,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostLikeReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostLikedReducer should handle action correctly", () => {
    expect(isPostLikedReducer(undefined, {})).toBe(false);
    expect(
      isPostLikedReducer(false, {
        type: ActionType.SET_IS_POST_LIKED,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostLikedReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostAddCommentReducer should handle action correctly", () => {
    expect(isPostAddCommentReducer(undefined, {})).toBe(false);
    expect(
      isPostAddCommentReducer(false, {
        type: ActionType.SET_IS_POST_ADD_COMMENT,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostAddCommentReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostAddedCommentReducer should handle action correctly", () => {
    expect(isPostAddedCommentReducer(undefined, {})).toBe(false);
    expect(
      isPostAddedCommentReducer(false, {
        type: ActionType.SET_IS_POST_ADDED_COMMENT,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostAddedCommentReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostDeleteCommentReducer should handle action correctly", () => {
    expect(isPostDeleteCommentReducer(undefined, {})).toBe(false);
    expect(
      isPostDeleteCommentReducer(false, {
        type: ActionType.SET_IS_POST_DELETE_COMMENT,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostDeleteCommentReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostDeletedCommentReducer should handle action correctly", () => {
    expect(isPostDeletedCommentReducer(undefined, {})).toBe(false);
    expect(
      isPostDeletedCommentReducer(false, {
        type: ActionType.SET_IS_POST_DELETED_COMMENT,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostDeletedCommentReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostDeleteAllReducer should handle action correctly", () => {
    expect(isPostDeleteAllReducer(undefined, {})).toBe(false);
    expect(
      isPostDeleteAllReducer(false, {
        type: ActionType.SET_IS_POST_DELETE_ALL,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostDeleteAllReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });

  it("isPostDeletedAllReducer should handle action correctly", () => {
    expect(isPostDeletedAllReducer(undefined, {})).toBe(false);
    expect(
      isPostDeletedAllReducer(false, {
        type: ActionType.SET_IS_POST_DELETED_ALL,
        payload: true,
      })
    ).toBe(true);
    expect(
      isPostDeletedAllReducer(true, {
        type: "UNKNOWN",
      })
    ).toBe(true);
  });
});
