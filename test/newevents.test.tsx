import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import NewEvent from "@/pages/newevents";

jest.mock("next/router", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    isFallback: false,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

const mockStore = configureMockStore();
const store = mockStore({
  user: {
    user: {
      userId: "mockedUserId",
    },
  },
});

describe("NewEvent Component", () => {
  it("update the state with input values", () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <NewEvent />
      </Provider>
    );

    const eventNameInput = getByPlaceholderText(
      "Add a name"
    ) as HTMLInputElement;
    const eventDescriptionInput = getByPlaceholderText(
      "Add a description"
    ) as HTMLInputElement;
    const inviteEmailInput = getByPlaceholderText(
      "Add a email"
    ) as HTMLInputElement;

    fireEvent.change(eventNameInput, { target: { value: "New Event Name" } });
    fireEvent.change(eventDescriptionInput, {
      target: { value: "Event Description" },
    });
    fireEvent.change(inviteEmailInput, { target: { value: "test@test.com" } });

    expect(eventNameInput.value).toBe("New Event Name");
    expect(eventDescriptionInput.value).toBe("Event Description");
    expect(inviteEmailInput.value).toBe("test@test.com");
  });
});
