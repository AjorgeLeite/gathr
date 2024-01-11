import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import LoginForm from "@/components/Loginform";
import { Provider } from "react-redux";
import store from "@/store/store";
import { useRouter } from "next/router"; 


jest.mock("next/router", () => {
  return {
    __esModule: true,
    useRouter: jest.fn(),
  };
});

jest.mock("axios");

describe("LoginForm", () => {
  test("logs in and redirects to events page", async () => {

    (axios.post as jest.Mock).mockResolvedValue({
      data: { authToken: "mockAuthToken" },
    });

    (axios.get as jest.Mock).mockResolvedValue({
      data: { name: "User", id: 123 },
    });

    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/events");
    }, { timeout: 5000 }); 
  });
});
