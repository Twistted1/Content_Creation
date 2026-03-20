import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { StudioProvider } from "../StudioContext";
import { Header } from "./Header";

function LocationValue() {
  const location = useLocation();
  return <div data-testid="location-value">{location.pathname}</div>;
}

describe("Podcast Header navigation", () => {
  it("navigates to ideas from podcast header", () => {
    render(
      <MemoryRouter initialEntries={["/podcast"]}>
        <StudioProvider>
          <Header />
          <LocationValue />
        </StudioProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Ideas" }));

    expect(screen.getByTestId("location-value").textContent).toBe("/ideas");
  });
});
