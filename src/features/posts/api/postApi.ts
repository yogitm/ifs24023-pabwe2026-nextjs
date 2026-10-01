import apiHelper from "../../../helpers/apiHelper";
import { DELCOM_BASEURL } from "@/lib/config";

const postApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/posts`;

  function _url(path: string) {
    return BASE_URL + path;
  }

  async function postPost(description: string) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal membuat postingan");
    }

    return result.data;
  }

  async function postPostCover(postId: number | string, cover: File) {
    const formData = new FormData();
    formData.append("cover", cover);
    const response = await apiHelper.fetchData(_url(`/${postId}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover");
    }

    return result.message;
  }

  async function putPost(postId: number | string, description: string) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah postingan");
    }

    return result.message;
  }

  async function getPosts(is_me: boolean | number | string = "", search = "") {
    const params = new URLSearchParams();
    if (is_me) {
      params.append("is_me", "1");
    }
    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `/?${queryString}` : "/";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data postingan");
    }

    return result.data?.posts || [];
  }

  async function getPostById(postId: number | string) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail postingan");
    }

    return result.data?.post;
  }

  async function deletePost(postId: number | string) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus postingan");
    }

    return result.message;
  }

  async function postLike(postId: number | string, like: number | boolean) {
    const response = await apiHelper.fetchData(_url(`/${postId}/likes`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        like: like ? 1 : 0,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal memperbarui status like");
    }

    return result.message;
  }

  async function postComment(postId: number | string, comment: string) {
    const response = await apiHelper.fetchData(_url(`/${postId}/comments`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment,
      }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan komentar");
    }

    return result.data;
  }

  async function deleteComment(postId: number | string, commentId: number | string) {
    const response = await apiHelper.fetchData(_url(`/${postId}/comments/${commentId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus komentar");
    }

    return result.message;
  }

  async function deleteAllPosts() {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus semua postingan");
    }

    return result.message;
  }

  return {
    postPost,
    postPostCover,
    putPost,
    getPosts,
    getPostById,
    deletePost,
    postLike,
    postComment,
    deleteComment,
    deleteAllPosts,
  };
})();

export default postApi;
