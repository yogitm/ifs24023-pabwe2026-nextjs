import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";

const mockPush = vi.fn();
let mockSearchParams: URLSearchParams | null = new URLSearchParams("");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
  useParams: () => ({}),
}));

describe("HomePage", () => {
  const mockProfile = { id: 1, name: "Abdullah", email: "abdul@del.org" };
  const mockPosts = [
    {
      id: 1,
      user_id: 1,
      description: "Postingan pertama saya",
      cover: "https://example.com/cover1.jpg",
      likes_count: 5,
      comments_count: 2,
      is_liked: 1,
      created_at: "2026-03-01T10:00:00.000Z",
      author: {
        id: 1,
        name: "Abdullah",
        email: "abdul@del.org",
        photo: "https://example.com/avatar.jpg",
      },
    },
    {
      id: 2,
      user_id: 2,
      description: "Postingan dari rekan kerja",
      cover: null,
      likes_count: 0,
      comments_count: 0,
      is_liked: 0,
      created_at: null,
      user: {
        id: 2,
        name: "Budi",
        email: "budi@del.org",
        photo: null,
      },
    },
    {
      id: 3,
      user_id: 99,
      description: "",
      cover: null,
      likes_count: 0,
      comments_count: 0,
      is_liked: 0,
      created_at: null,
      author: {
        id: 1,
        name: "",
        email: "",
        photo: null,
      },
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    mockSearchParams = new URLSearchParams("");
  });

  it("should return null if profile is not present", () => {
    const { container } = renderWithProviders(<HomePage />, {
      preloadedState: { profile: null },
    });
    expect(container.firstChild).toBeNull();
  });

  it("should render posts stats, and empty state when empty", async () => {
    vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => Promise.resolve()) as any);
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: null as any,
      },
    });

    expect(screen.getByText("Linimasa Postingan")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Belum ada postingan")).toBeInTheDocument();
    });

    const emptyAddBtn = screen.getByTestId("empty-add-post-btn");
    fireEvent.click(emptyAddBtn);
    expect(screen.getByTestId("add-post-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("add-post-modal")).not.toBeInTheDocument();
  });

  it("should display loading indicator while loading posts when no posts exist", () => {
    vi.spyOn(postAction, "asyncSetPosts").mockImplementation(
      (() => () => new Promise(() => {})) as any
    );

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: [],
      },
    });

    expect(screen.getByText("Memuat postingan...")).toBeInTheDocument();
  });

  it("should render list of posts with cards and allow interactions", async () => {
    vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => Promise.resolve()) as any);
    const likeSpy = vi.spyOn(postAction, "asyncSetIsPostLike").mockReturnValue((() => {}) as any);

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    expect(screen.getByText("Postingan pertama saya")).toBeInTheDocument();
    expect(screen.getByText("Postingan dari rekan kerja")).toBeInTheDocument();
    expect(screen.getByText("5 Suka")).toBeInTheDocument();

    // Toggle like
    const likeBtn = screen.getByTestId("like-post-btn-1");
    fireEvent.click(likeBtn);
    expect(likeSpy).toHaveBeenCalledWith(1, 0);

    const unlikeBtn = screen.getByTestId("like-post-btn-2");
    fireEvent.click(unlikeBtn);
    expect(likeSpy).toHaveBeenCalledWith(2, 1);

    // Click comments button to navigate
    const commentBtn = screen.getByTestId("comment-post-btn-1");
    fireEvent.click(commentBtn);
    expect(mockPush).toHaveBeenCalledWith("/posts/1");

    // Click view detail button
    const detailBtn = screen.getByTestId("view-detail-btn-2");
    fireEvent.click(detailBtn);
    expect(mockPush).toHaveBeenCalledWith("/posts/2");
  });

  it("should filter posts by search query and show empty search message", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const searchInput = screen.getByTestId("search-post-input");
    fireEvent.change(searchInput, { target: { value: "pertama" } });

    expect(screen.getByText("Postingan pertama saya")).toBeInTheDocument();
    expect(screen.queryByText("Postingan dari rekan kerja")).not.toBeInTheDocument();

    // Search by author name
    fireEvent.change(searchInput, { target: { value: "Budi" } });
    expect(screen.queryByText("Postingan pertama saya")).not.toBeInTheDocument();
    expect(screen.getByText("Postingan dari rekan kerja")).toBeInTheDocument();

    // Non-matching search
    fireEvent.change(searchInput, { target: { value: "xyznotfound" } });
    expect(screen.getByText("Tidak ada postingan yang cocok dengan kata kunci pencarian Anda.")).toBeInTheDocument();
  });

  it("should switch tabs between Semua Postingan and Postingan Saya", () => {
    const fetchSpy = vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => Promise.resolve()) as any);

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const filterMeBtn = screen.getByTestId("filter-me-btn");
    fireEvent.click(filterMeBtn);
    expect(fetchSpy).toHaveBeenCalledWith("1");

    const filterAllBtn = screen.getByTestId("filter-all-btn");
    fireEvent.click(filterAllBtn);
    expect(fetchSpy).toHaveBeenCalledWith("");
  });

  it("should handle delete post with confirmation", async () => {
    const deleteSpy = vi.spyOn(postAction, "asyncSetIsPostDelete").mockReturnValue((() => {}) as any);
    const confirmSpy = vi.spyOn(toolsHelper, "showConfirmDialog");

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const deleteBtn = screen.getByTestId("delete-post-btn-1");

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

  it("should open and close edit modal when clicking edit button", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const editBtn = screen.getByTestId("edit-post-btn-1");
    fireEvent.click(editBtn);

    expect(screen.getByTestId("edit-post-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-edit-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("edit-post-modal")).not.toBeInTheDocument();
  });

  it("should open and close add modal when clicking Add Post button", () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    const addBtn = screen.getByTestId("add-post-btn");
    fireEvent.click(addBtn);

    expect(screen.getByTestId("add-post-modal")).toBeInTheDocument();

    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("add-post-modal")).not.toBeInTheDocument();
  });

  it("should reload posts when isPostDeleted or isPostLiked changes", async () => {
    const fetchSpy = vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => Promise.resolve()) as any);

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
        isPostDeleted: true,
        isPostLiked: true,
      },
    });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  it("should initialize filter to 1 if searchParams has is_me=1", () => {
    mockSearchParams = new URLSearchParams("is_me=1");
    const fetchSpy = vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => Promise.resolve()) as any);

    renderWithProviders(<HomePage />, {
      preloadedState: {
        profile: mockProfile,
        posts: mockPosts,
      },
    });

    expect(fetchSpy).toHaveBeenCalledWith("1");
  });
});
