import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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
        <RegisterForm setIsLoggedIn={() => { }} setUserName={() => { }} isLoggedIn={false} />
      </Provider>
    );


    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Username" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });



await act(async () => {
  fireEvent.submit(screen.getByRole("button", { name: /Register/i }));
});
console.log('Form sbnitted');
console.log(mockPush.mock.calls); 
  });
});
