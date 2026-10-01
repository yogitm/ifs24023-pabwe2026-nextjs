import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from "./features/auth/states/reducer";
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from "./features/users/states/reducer";
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
} from "./features/posts/states/reducer";

export function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      isAuthLogin: isAuthLoginReducer,
      isAuthRegister: isAuthRegisterReducer,
      isAuthLogout: isAuthLogoutReducer,
      users: usersReducer,
      user: userReducer,
      profile: profileReducer,
      isProfile: isProfileReducer,
      isChangeProfile: isChangeProfileReducer,
      isChangeProfilePhoto: isChangeProfilePhotoReducer,
      isChangeProfilePassword: isChangeProfilePasswordReducer,
      posts: postsReducer,
      post: postReducer,
      isPost: isPostReducer,
      isPostAdd: isPostAddReducer,
      isPostAdded: isPostAddedReducer,
      isPostChange: isPostChangeReducer,
      isPostChanged: isPostChangedReducer,
      isPostChangeCover: isPostChangeCoverReducer,
      isPostChangedCover: isPostChangedCoverReducer,
      isPostDelete: isPostDeleteReducer,
      isPostDeleted: isPostDeletedReducer,
      isPostLike: isPostLikeReducer,
      isPostLiked: isPostLikedReducer,
      isPostAddComment: isPostAddCommentReducer,
      isPostAddedComment: isPostAddedCommentReducer,
      isPostDeleteComment: isPostDeleteCommentReducer,
      isPostDeletedComment: isPostDeletedCommentReducer,
      isPostDeleteAll: isPostDeleteAllReducer,
      isPostDeletedAll: isPostDeletedAllReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
  });
}

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Record<string, any>;
  store?: ReturnType<typeof createMockStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
