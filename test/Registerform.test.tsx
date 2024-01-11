import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import RegisterForm from "@/components/Registerform"; 
import { Provider } from "react-redux";
import store from "@/store/store";
import { useRouter } from "next/router";


jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("axios");

describe("RegisterForm", () => {
  test("Register and redirects to events page", async () => {

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
        <RegisterForm setIsLoggedIn={() => { } } setUserName={() => { } } isLoggedIn={false} />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Usernamw" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/events");
    }, { timeout: 5000 }); 
  });
});
