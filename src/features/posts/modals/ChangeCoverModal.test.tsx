import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "../../../test-utils";
import * as toolsHelper from "../../../helpers/toolsHelper";
import * as postAction from "../states/action";
import { Post } from "@/types";

describe("ChangeCoverModal", () => {
  const mockPost: Post = { id: 1, user_id: 1, description: "Test Post" };

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
  });

  it("should not render when show is false or post is null", () => {
    const { container: c1 } = renderWithProviders(
      <ChangeCoverModal show={false} onClose={vi.fn()} post={mockPost} />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = renderWithProviders(
      <ChangeCoverModal show={true} onClose={vi.fn()} post={null} />
    );
    expect(c2.firstChild).toBeNull();
  });

  it("should validate file presence, file type, and file size", () => {
    const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockImplementation(() => {});

    renderWithProviders(<ChangeCoverModal show={true} onClose={vi.fn()} post={mockPost} />);

    const fileInput = screen.getByTestId("cover-file-input");
    const form = fileInput.closest("form");

    fireEvent.submit(form!);
    expect(errorSpy).toHaveBeenCalledWith("Pilih file cover terlebih dahulu!");

    // Empty files test
    fireEvent.change(fileInput, { target: { files: [] } });

    // Non-image file test
    const badFile = new File(["dummy"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    expect(errorSpy).toHaveBeenCalledWith("Hanya file JPEG, JPG, atau PNG yang diperbolehkan!");

    // Large file test (>1MB)
    const largeFile = new File([new Uint8Array(2 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    expect(errorSpy).toHaveBeenCalledWith("Ukuran file terlalu besar. Maksimal 1MB!");
  });

  it("should preview selected image and dispatch cover upload on valid file", () => {
    const changeCoverSpy = vi
      .spyOn(postAction, "asyncSetIsPostChangeCover")
      .mockReturnValue((() => {}) as any);
    const onClose = vi.fn();

    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} post={mockPost} />,
      {
        preloadedState: {
          isPostChangeCover: false,
          isPostChangedCover: false,
        },
      }
    );

    const fileInput = screen.getByTestId("cover-file-input");
    const validFile = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Expect preview image to be rendered
    const previewImg = screen.getByAltText("Preview");
    expect(previewImg).toBeInTheDocument();

    const form = fileInput.closest("form");
    fireEvent.submit(form!);

    expect(changeCoverSpy).toHaveBeenCalledWith(1, validFile);

    const closeBtn = screen.getByTestId("close-cover-modal-btn");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    const cancelBtn = screen.getByTestId("cancel-cover-modal-btn");
    fireEvent.click(cancelBtn);
  });

  it("should handle state transition when isPostChangeCover and isPostChangedCover are true", () => {
    const onClose = vi.fn();
    const asyncPostSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue((() => {}) as any);

    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} post={mockPost} />,
      {
        preloadedState: {
          isPostChangeCover: true,
          isPostChangedCover: true,
        },
      }
    );

    expect(asyncPostSpy).toHaveBeenCalledWith(1);
    expect(onClose).toHaveBeenCalled();
  });

  it("should handle state transition when isPostChangeCover is true but isPostChangedCover is false", () => {
    const onClose = vi.fn();
    const asyncPostSpy = vi.spyOn(postAction, "asyncSetPost").mockReturnValue((() => {}) as any);

    renderWithProviders(
      <ChangeCoverModal show={true} onClose={onClose} post={mockPost} />,
      {
        preloadedState: {
          isPostChangeCover: true,
          isPostChangedCover: false,
        },
      }
    );

    expect(asyncPostSpy).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
