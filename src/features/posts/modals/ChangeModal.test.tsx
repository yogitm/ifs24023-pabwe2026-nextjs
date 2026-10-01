import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";

describe("ChangeModal", () => {
  const mockPost = {
    id: 1,
    user_id: 1,
    description: "Initial Post Description",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false or postId is null", () => {
    const { container: c1 } = renderWithProviders(
      <ChangeModal show={false} onClose={vi.fn()} postId={1} />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = renderWithProviders(
      <ChangeModal show={true} onClose={vi.fn()} postId={null} />
    );
    expect(c2.firstChild).toBeNull();
  });

  it("should populate inputs with post data and handle changes", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={1} />, {
      preloadedState: {
        post: mockPost,
      },
    });

    const descInput = screen.getByTestId("edit-post-description-input") as HTMLTextAreaElement;
    expect(descInput.value).toBe("Initial Post Description");

    fireEvent.change(descInput, { target: { value: "Updated Description" } });
    expect(descInput.value).toBe("Updated Description");
  });

  it("should handle empty or null description in post object", () => {
    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={1} />, {
      preloadedState: {
        post: { id: 1, user_id: 1, description: "" },
      },
    });

    const descInput = screen.getByTestId("edit-post-description-input") as HTMLTextAreaElement;
    expect(descInput.value).toBe("");
  });

  it("should validate empty description", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<ChangeModal show={true} onClose={vi.fn()} postId={1} />, {
      preloadedState: {
        post: mockPost,
      },
    });

    const descInput = screen.getByTestId("edit-post-description-input");
    fireEvent.change(descInput, { target: { value: "   " } });

    const form = screen.getByTestId("edit-post-modal").querySelector("form");
    fireEvent.submit(form!);

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should dispatch asyncSetIsPostChange on submit and handle close", () => {
    const changeSpy = vi.spyOn(postAction, "asyncSetIsPostChange").mockReturnValue((() => {}) as any);
    const onClose = vi.fn();

    renderWithProviders(<ChangeModal show={true} onClose={onClose} postId={1} />, {
      preloadedState: {
        post: mockPost,
        isPostChange: false,
        isPostChanged: false,
      },
    });

    const form = screen.getByTestId("edit-post-modal").querySelector("form");
    fireEvent.submit(form!);

    expect(changeSpy).toHaveBeenCalledWith(1, "Initial Post Description");

    const closeBtn = screen.getByTestId("close-edit-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    const cancelBtn = screen.getByTestId("cancel-edit-modal-btn");
    fireEvent.click(cancelBtn);
  });

  it("should handle state transition when isPostChange and isPostChanged are true", () => {
    const onClose = vi.fn();
    const asyncPostsSpy = vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => {}) as any);
    const asyncPostSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue((() => {}) as any);

    renderWithProviders(<ChangeModal show={true} onClose={onClose} postId={1} />, {
      preloadedState: {
        post: mockPost,
        isPostChange: true,
        isPostChanged: true,
      },
    });

    expect(asyncPostSpy).toHaveBeenCalledWith(1);
    expect(asyncPostsSpy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("should handle state transition when isPostChange is true but isPostChanged is false", () => {
    const onClose = vi.fn();
    const asyncPostsSpy = vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => {}) as any);

    renderWithProviders(<ChangeModal show={true} onClose={onClose} postId={1} />, {
      preloadedState: {
        post: mockPost,
        isPostChange: true,
        isPostChanged: false,
      },
    });

    expect(asyncPostsSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
