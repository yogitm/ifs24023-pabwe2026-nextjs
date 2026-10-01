import { describe, it, expect, vi, beforeEach } from "vitest";
import postApi from "./postApi";
import apiHelper from "../../../helpers/apiHelper";

describe("postApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockResponse = (data: unknown, status = 200) => ({
    status,
    json: vi.fn().mockResolvedValue(data),
  });

  it("should postPost successfully and throw on failure", async () => {
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", data: { id: 1, description: "Hello" } }) as any
    );

    const res = await postApi.postPost("Hello");
    expect(res).toEqual({ id: 1, description: "Hello" });
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/posts"),
      expect.objectContaining({ method: "POST" })
    );

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Failed" }) as any);
    await expect(postApi.postPost("Hello")).rejects.toThrow("Failed");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.postPost("Hello")).rejects.toThrow("Gagal membuat postingan");
  });

  it("should postPostCover successfully and throw on failure", async () => {
    const dummyFile = new File(["dummy"], "cover.png", { type: "image/png" });
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", message: "Cover updated" }) as any
    );

    const res = await postApi.postPostCover(1, dummyFile);
    expect(res).toBe("Cover updated");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Cover fail" }) as any);
    await expect(postApi.postPostCover(1, dummyFile)).rejects.toThrow("Cover fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.postPostCover(1, dummyFile)).rejects.toThrow("Gagal mengubah cover");
  });

  it("should putPost successfully and throw on failure", async () => {
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", message: "Post updated" }) as any
    );

    const res = await postApi.putPost(1, "Updated text");
    expect(res).toBe("Post updated");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Put fail" }) as any);
    await expect(postApi.putPost(1, "Updated text")).rejects.toThrow("Put fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.putPost(1, "Updated text")).rejects.toThrow("Gagal mengubah postingan");
  });

  it("should getPosts with filters and throw on failure", async () => {
    const mockPosts = [{ id: 1, description: "Post 1" }];
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", data: { posts: mockPosts } }) as any
    );

    const res1 = await postApi.getPosts(true, "camp");
    expect(res1).toEqual(mockPosts);

    const res2 = await postApi.getPosts();
    expect(res2).toEqual(mockPosts);

    fetchSpy.mockResolvedValue(mockResponse({ status: "success", data: {} }) as any);
    const res3 = await postApi.getPosts();
    expect(res3).toEqual([]);

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Fetch fail" }) as any);
    await expect(postApi.getPosts()).rejects.toThrow("Fetch fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.getPosts()).rejects.toThrow("Gagal mengambil data postingan");
  });

  it("should getPostById successfully and throw on failure", async () => {
    const mockPost = { id: 1, description: "Detail Post" };
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", data: { post: mockPost } }) as any
    );

    const res = await postApi.getPostById(1);
    expect(res).toEqual(mockPost);

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Not found" }) as any);
    await expect(postApi.getPostById(1)).rejects.toThrow("Not found");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.getPostById(1)).rejects.toThrow("Gagal mengambil detail postingan");
  });

  it("should deletePost successfully and throw on failure", async () => {
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", message: "Deleted" }) as any
    );

    const res = await postApi.deletePost(1);
    expect(res).toBe("Deleted");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Del fail" }) as any);
    await expect(postApi.deletePost(1)).rejects.toThrow("Del fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.deletePost(1)).rejects.toThrow("Gagal menghapus postingan");
  });

  it("should postLike successfully and throw on failure", async () => {
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", message: "Liked" }) as any
    );

    const res1 = await postApi.postLike(1, 1);
    expect(res1).toBe("Liked");

    const res2 = await postApi.postLike(1, 0);
    expect(res2).toBe("Liked");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Like fail" }) as any);
    await expect(postApi.postLike(1, 1)).rejects.toThrow("Like fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.postLike(1, 1)).rejects.toThrow("Gagal memperbarui status like");
  });

  it("should postComment successfully and throw on failure", async () => {
    const mockComment = { id: 10, comment: "Nice post" };
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", data: mockComment }) as any
    );

    const res = await postApi.postComment(1, "Nice post");
    expect(res).toEqual(mockComment);

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Comment fail" }) as any);
    await expect(postApi.postComment(1, "Nice post")).rejects.toThrow("Comment fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.postComment(1, "Nice post")).rejects.toThrow("Gagal menambahkan komentar");
  });

  it("should deleteComment successfully and throw on failure", async () => {
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", message: "Comment deleted" }) as any
    );

    const res = await postApi.deleteComment(1, 10);
    expect(res).toBe("Comment deleted");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Delete comment fail" }) as any);
    await expect(postApi.deleteComment(1, 10)).rejects.toThrow("Delete comment fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.deleteComment(1, 10)).rejects.toThrow("Gagal menghapus komentar");
  });

  it("should deleteAllPosts successfully and throw on failure", async () => {
    const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue(
      mockResponse({ status: "success", message: "All posts deleted" }) as any
    );

    const res = await postApi.deleteAllPosts();
    expect(res).toBe("All posts deleted");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error", message: "Del all fail" }) as any);
    await expect(postApi.deleteAllPosts()).rejects.toThrow("Del all fail");

    fetchSpy.mockResolvedValue(mockResponse({ status: "error" }) as any);
    await expect(postApi.deleteAllPosts()).rejects.toThrow("Gagal menghapus semua postingan");
  });
});
