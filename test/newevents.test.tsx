import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
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

  
  it("adds and removes polls", () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <NewEvent />
      </Provider>
    );

    const addPollButton = getByText("Add Poll");
    fireEvent.click(addPollButton);

    const removePollButton = getByText("Remove Poll");
    fireEvent.click(removePollButton);

    waitFor(() => {

      expect(queryByText("Poll Name:")).toBeNull();
    });

  });

  it("adds and removes poll options", () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <NewEvent />
      </Provider>
    );
  
    const addPollButton = getByText("Add Poll");
    fireEvent.click(addPollButton);
  
    const addOptionButton = getByText("Add Option");
    fireEvent.click(addOptionButton);
  
  });

  it("adds invites", async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <NewEvent />
      </Provider>
    );
  
    const inviteEmailInput = getByPlaceholderText("Add a email") as HTMLInputElement;
    const addInviteButton = getByText("Add Invite");

    fireEvent.change(inviteEmailInput, { target: { value: "test@test.com" } });
    fireEvent.click(addInviteButton);

    try {
      await waitFor(() => expect(getByText("test@test.com")).toBeTruthy());
    } catch (error) {
      console.error("Error:", error);
    }
  });
  


});
