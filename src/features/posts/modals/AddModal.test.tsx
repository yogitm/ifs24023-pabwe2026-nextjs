import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when show is false", () => {
    const { container } = renderWithProviders(<AddModal show={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("should show validation error if description is empty", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<AddModal show={true} onClose={vi.fn()} />);

    const form = screen.getByTestId("add-post-modal").querySelector("form");
    fireEvent.submit(form!);

    expect(errorSpy).toHaveBeenCalledWith("Deskripsi tidak boleh kosong");
  });

  it("should dispatch asyncSetIsPostAdd and call onClose on successful add", () => {
    const asyncAddSpy = vi.spyOn(postAction, "asyncSetIsPostAdd").mockReturnValue((() => {}) as any);
    const onClose = vi.fn();

    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isPostAdd: false,
        isPostAdded: false,
      },
    });

    const descInput = screen.getByTestId("add-post-description-input");
    fireEvent.change(descInput, { target: { value: "Belajar NextJS sampai tuntas" } });

    const form = screen.getByTestId("add-post-modal").querySelector("form");
    fireEvent.submit(form!);

    expect(asyncAddSpy).toHaveBeenCalledWith("Belajar NextJS sampai tuntas");

    // Close button
    const closeBtn = screen.getByTestId("close-add-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    // Cancel button
    const cancelBtn = screen.getByTestId("cancel-add-modal-btn");
    fireEvent.click(cancelBtn);
  });

  it("should handle state transition when isPostAdd and isPostAdded are true", () => {
    const onClose = vi.fn();
    const asyncPostsSpy = vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => {}) as any);

    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isPostAdd: true,
        isPostAdded: true,
      },
    });

    expect(asyncPostsSpy).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("should handle state transition when isPostAdd is true but isPostAdded is false", () => {
    const onClose = vi.fn();
    const asyncPostsSpy = vi.spyOn(postAction, "asyncSetPosts").mockReturnValue((() => {}) as any);

    renderWithProviders(<AddModal show={true} onClose={onClose} />, {
      preloadedState: {
        isPostAdd: true,
        isPostAdded: false,
      },
    });

    expect(asyncPostsSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
