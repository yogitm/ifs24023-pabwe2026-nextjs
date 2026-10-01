import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import SidebarComponent from "./SidebarComponent";
import { renderWithProviders } from "../../../test-utils";

let mockPathname = "/";
let mockSearchParams: URLSearchParams | null = new URLSearchParams("is_me=1");

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe("SidebarComponent", () => {
  beforeEach(() => {
    mockPathname = "/";
    mockSearchParams = new URLSearchParams("is_me=1");
  });

  it("should render navigation links properly with is_me=1", () => {
    const onCloseMobile = vi.fn();
    renderWithProviders(
      <SidebarComponent isSidebarOpen={false} onCloseMobile={onCloseMobile} />
    );

    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
    expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("should render active state for all posts when pathname is / and no is_me param", () => {
    mockPathname = "/";
    mockSearchParams = new URLSearchParams("");

    renderWithProviders(
      <SidebarComponent isSidebarOpen={false} onCloseMobile={vi.fn()} />
    );

    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
  });

  it("should render active state for users and profile routes", () => {
    mockPathname = "/users";
    mockSearchParams = null;

    const { unmount } = renderWithProviders(
      <SidebarComponent isSidebarOpen={false} onCloseMobile={vi.fn()} />
    );
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    unmount();

    mockPathname = "/profile";
    renderWithProviders(
      <SidebarComponent isSidebarOpen={false} onCloseMobile={vi.fn()} />
    );
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("should render backdrop and call onCloseMobile when backdrop clicked on mobile", () => {
    const onCloseMobile = vi.fn();
    renderWithProviders(
      <SidebarComponent isSidebarOpen={true} onCloseMobile={onCloseMobile} />
    );

    const backdrop = screen.getByTestId("sidebar-backdrop");
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop);
    expect(onCloseMobile).toHaveBeenCalled();
  });

  it("should call onCloseMobile when clicking navigation link", () => {
    const onCloseMobile = vi.fn();
    renderWithProviders(
      <SidebarComponent isSidebarOpen={true} onCloseMobile={onCloseMobile} />
    );

    const link = screen.getByText("Daftar Pengguna");
    fireEvent.click(link);
    expect(onCloseMobile).toHaveBeenCalled();
  });
});
