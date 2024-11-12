import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GuesserContainer from "./GuesserContainer";
import { act, ReactNode } from "react";
import { GuesserContextProvider } from "./GuesserContext";

vi.mock("@/lib/randomizer", () => {
  return {
    MAX_NUM: 5,
    getRandomValue: vi.fn(() => {
      return "3";
    }),
  };
});

const renderWithContext = (component: ReactNode) => {
  render(<GuesserContextProvider>{component}</GuesserContextProvider>);
};
const guessANumber = (val: string) => {
  renderWithContext(<GuesserContainer />);
  const inputEl = screen.getByTestId("inputEl");
  const submitEl = screen.getByTestId("submitBtn");
  act(() => {
    fireEvent.change(inputEl, {
      target: {
        value: val,
      },
    });
    fireEvent.click(submitEl);
  });
};
describe("GuessContainer Component", () => {
  it("should render the initial UI with randon prompt", () => {
    render(<GuesserContainer />);
    expect(
      screen.getByText(/guess an integer between 1 and/i)
    ).toBeInTheDocument();
  });
  it("should congratulate on success", async () => {
    guessANumber("3");
    await waitFor(() => {
      expect(
        screen.getByText(
          /Congratulations! Great guess ✅ The random number was 3/i
        )
      ).toBeInTheDocument();
    });
  });
  it("should display failure message and try again on wrong guess", async () => {
    guessANumber("2");
    await waitFor(() => {
      expect(screen.getByText(/Wrong guess/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId("tryAgainBtn")).toBeInTheDocument();
  });

  it("should reset the ui on try again btn", async () => {
    guessANumber("1");
    const tryAgainBtn = screen.getByTestId("tryAgainBtn");
    act(() => {
      fireEvent.click(tryAgainBtn);
    });
    expect(
      screen.getByText(/guess an integer between 1 and/i)
    ).toBeInTheDocument();
  });
});
