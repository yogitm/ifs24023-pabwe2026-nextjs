import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/posts/1",
  useParams: () => ({ postId: "1" }),
}));

describe("DetailPage", () => {
  const mockProfile = { id: 1, name: "Abdullah", email: "abdul@del.org" };
  const mockPost = {
    id: 1,
    user_id: 1,
    description: "Postingan rincian lengkap untuk diuji",
    cover: "https://example.com/cover.jpg",
    likes_count: 3,
    is_liked: 0,
    created_at: "2026-03-01T12:00:00.000Z",
    author: {
      id: 1,
      name: "Abdullah",
      email: "abdul@del.org",
      photo: "https://example.com/photo.jpg",
    },
    comments: [
      {
        id: 10,
        post_id: 1,
        user_id: 2,
        comment: "Komentar pertama dari pengguna lain",
        created_at: "2026-03-01T12:30:00.000Z",
        author: {
          id: 2,
          name: "Budi",
          email: "budi@del.org",
          photo: "https://example.com/budi.jpg",
        },
      },
      {
        id: 11,
        post_id: 1,
        user_id: 3,
        comment: "Komentar kedua tanpa foto",
        created_at: null,
        user: {
          id: 3,
          name: "Charlie",
          email: "charlie@del.org",
          photo: null,
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading spinner if profile or post is not available", () => {
    const { container } = renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: null,
        post: null,
      },
    });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should redirect to / if isPost is true and post is null", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: null,
        isPost: true,
      },
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should do nothing if isPost is true but post exists", () => {
    mockPush.mockClear();
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPost: true,
      },
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should redirect to / if isPostDeleted is true", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPostDeleted: true,
      },
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should render post details, handle likes and display comments", () => {
    const likeSpy = vi.spyOn(postAction, "asyncSetIsPostLike").mockReturnValue((() => {}) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    expect(screen.getByTestId("post-description-text")).toHaveTextContent(
      "Postingan rincian lengkap untuk diuji"
    );
    expect(screen.getByTestId("post-cover-image")).toBeInTheDocument();
    expect(screen.getByText("Komentar pertama dari pengguna lain")).toBeInTheDocument();
    expect(screen.getByText("Komentar kedua tanpa foto")).toBeInTheDocument();

    const likeBtn = screen.getByTestId("like-detail-btn");
    fireEvent.click(likeBtn);
    expect(likeSpy).toHaveBeenCalledWith(1, 1);
  });

  it("should handle like toggle when post is already liked", () => {
    const likeSpy = vi.spyOn(postAction, "asyncSetIsPostLike").mockReturnValue((() => {}) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: { ...mockPost, is_liked: 1 },
      },
    });

    const likeBtn = screen.getByTestId("like-detail-btn");
    expect(screen.getByText(/Disukai/)).toBeInTheDocument();
    fireEvent.click(likeBtn);
    expect(likeSpy).toHaveBeenCalledWith(1, 0);
  });

  it("should open and close edit modal and cover modal on button click", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    const editBtn = screen.getByTestId("edit-post-btn");
    fireEvent.click(editBtn);
    expect(screen.getByTestId("edit-post-modal")).toBeInTheDocument();

    const closeEditBtn = screen.getByTestId("close-edit-modal-btn");
    fireEvent.click(closeEditBtn);
    expect(screen.queryByTestId("edit-post-modal")).not.toBeInTheDocument();

    const coverBtn = screen.getByTestId("edit-cover-btn");
    fireEvent.click(coverBtn);
    expect(screen.getByTestId("change-cover-modal")).toBeInTheDocument();

    const closeCoverBtn = screen.getByTestId("close-cover-modal-btn");
    fireEvent.click(closeCoverBtn);
    expect(screen.queryByTestId("change-cover-modal")).not.toBeInTheDocument();
  });

  it("should handle delete post", async () => {
    const deleteSpy = vi.spyOn(postAction, "asyncSetIsPostDelete").mockReturnValue((() => {}) as any);
    const confirmSpy = vi.spyOn(toolsHelper, "showConfirmDialog");

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    const deleteBtn = screen.getByTestId("delete-post-btn");

    // Cancelled delete first
    confirmSpy.mockResolvedValueOnce({ isConfirmed: false } as any);
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });
    expect(deleteSpy).not.toHaveBeenCalled();

    // Confirmed delete second
    confirmSpy.mockResolvedValueOnce({ isConfirmed: true } as any);
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledTimes(2);
      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });

  it("should validate and add comment", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});
    const addCommentSpy = vi
      .spyOn(postAction, "asyncSetIsPostAddComment")
      .mockReturnValue((() => {}) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    const form = screen.getByTestId("submit-comment-btn").closest("form");
    fireEvent.submit(form!);
    expect(errorSpy).toHaveBeenCalledWith("Komentar tidak boleh kosong");

    const input = screen.getByTestId("comment-input");
    fireEvent.change(input, { target: { value: "Komentar baru dari saya" } });
    fireEvent.submit(form!);

    expect(addCommentSpy).toHaveBeenCalledWith(1, "Komentar baru dari saya");
  });

  it("should delete comment with confirmation", async () => {
    const deleteCommentSpy = vi
      .spyOn(postAction, "asyncSetIsPostDeleteComment")
      .mockReturnValue((() => {}) as any);
    const confirmSpy = vi.spyOn(toolsHelper, "showConfirmDialog");

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
      },
    });

    const deleteCommentBtn = screen.getByTestId("delete-comment-btn-10");

    // Cancelled delete first
    confirmSpy.mockResolvedValueOnce({ isConfirmed: false } as any);
    fireEvent.click(deleteCommentBtn);
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledTimes(1);
    });
    expect(deleteCommentSpy).not.toHaveBeenCalled();

    // Confirmed delete second
    confirmSpy.mockResolvedValueOnce({ isConfirmed: true } as any);
    fireEvent.click(deleteCommentBtn);
    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledTimes(2);
      expect(deleteCommentSpy).toHaveBeenCalledWith(1, 10);
    });
  });

  it("should handle reload triggers for isPostLiked, isPostAddComment, isPostDeleteComment, isPostChanged, isPostChangedCover", () => {
    const fetchSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue((() => {}) as any);

    const { rerender } = renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPostLiked: true,
        isPostAddComment: true,
        isPostAddedComment: true,
        isPostDeleteComment: true,
        isPostDeletedComment: true,
        isPostChanged: true,
        isPostChangedCover: true,
      },
    });

    expect(fetchSpy).toHaveBeenCalled();

    // Also trigger add/delete comment state without confirmed action
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: mockPost,
        isPostAddComment: true,
        isPostAddedComment: false,
        isPostDeleteComment: true,
        isPostDeletedComment: false,
      },
    });
  });

  it("should render fallback text when there are no comments and fallback avatar when photo is null", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: { id: 99, name: "Other User", email: "other@del.org" },
        post: {
          id: 2,
          user_id: 10,
          description: "Post from another user",
          cover: null,
          created_at: null,
          user: {
            id: 10,
            name: "",
            email: "",
            photo: null,
          },
          comments: [
            {
              id: 99,
              post_id: 2,
              user_id: 99,
              comment: "Komentar tanpa nama",
              created_at: null,
              author: {
                id: 99,
                name: "",
                photo: null,
              },
            },
          ],
        },
      },
    });

    expect(screen.getByText(/Baru saja/)).toBeInTheDocument();
    expect(screen.getAllByText("Anonim").length).toBeGreaterThan(0);
    expect(screen.queryByTestId("edit-cover-btn")).not.toBeInTheDocument();
  });

  it("should render message when there are no comments and handle owner by author.id", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        profile: mockProfile,
        post: { ...mockPost, user_id: 99, author: { ...mockPost.author, id: 1 }, comments: undefined as any },
      },
    });

    expect(
      screen.getByText("Belum ada komentar pada postingan ini. Jadilah yang pertama memberikan tanggapan!")
    ).toBeInTheDocument();
    expect(screen.getByTestId("edit-cover-btn")).toBeInTheDocument();
  });
});
