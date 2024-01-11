import React from "react";
import { render, fireEvent, waitFor, screen, within  } from "@testing-library/react";
import EditEvent from "@/components/EditModal";


jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

describe("EditEvent Component", () => {
  const onSaveMock = jest.fn();
  const onCancelMock = jest.fn();

  const defaultProps = {
    event: {
      id: 1,
      created_at: Date.now(),
      created_by: 1,
      name: "Test Event",
      description: "Test Event Description",
      going: [],
      invited: [],
      polls_id: [],
    },
    onSave: onSaveMock,
    onCancel: onCancelMock,
  };

  beforeEach(() => {
    onSaveMock.mockClear();
  });

  it("renders EditEvent component", () => {
    jest.spyOn(require("next/router"), "useRouter").mockReturnValue({
      push: jest.fn(),
    });

    render(
      <EditEvent
        title={""}
        openIndex={null}
        onDeleteEvent={() => {}}
        onEditEvent={() => {}}
        setOpenIndex={() => {}}
        {...defaultProps}
      />
    );
    expect(screen.getByText(/Editing event/i)).toBeTruthy();
  });

  it("calls onSave function when 'Edit Event' button is clicked", async () => {
    render(
      <EditEvent
        title={""}
        openIndex={null}
        onDeleteEvent={() => {}}
        onEditEvent={() => {}}
        setOpenIndex={() => {}}
        {...defaultProps}
      />
    );

    console.log(screen.getByTestId("edit-event-button"));
    fireEvent.click(screen.getByTestId("edit-event-button"));

    await waitFor(() => expect(onSaveMock).toHaveBeenCalled(), { timeout: 3000 });
    console.log("onSaveMock calls:", onSaveMock.mock.calls);
  });

  it("calls onCancel function when 'Cancel' button is clicked", () => {
    render(
      <EditEvent
        title={""}
        openIndex={null}
        onDeleteEvent={() => {}}
        onEditEvent={() => {}}
        setOpenIndex={() => {}}
        {...defaultProps}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(onCancelMock).toHaveBeenCalled();
  });

  it("Invites people when Add Invite button is clicked", async () => {
    render(
      <EditEvent
        title={""}
        openIndex={null}
        onDeleteEvent={() => {}}
        onEditEvent={() => {}}
        setOpenIndex={() => {}}
        {...defaultProps}
      />
    );
  
    fireEvent.change(screen.getByPlaceholderText("Add new email"), {
      target: { value: "test@test.com" },
    });
  
    fireEvent.click(screen.getByText("Add Invite"));
  
    await waitFor(() => {});
  
    const inviteInput = screen.getByPlaceholderText("Add new email") as HTMLInputElement;
    expect(inviteInput.value).toBe("test@test.com");
  });
  

  it("adds a new poll when 'Add Poll To Event' button is clicked", async () => {
    render(
      <EditEvent
        title={""}
        openIndex={null}
        onDeleteEvent={() => {}}
        onEditEvent={() => {}}
        setOpenIndex={() => {}}
        {...defaultProps}
      />
    );

    fireEvent.change(screen.getByLabelText("Poll Name:"), {
      target: { value: "Test Poll" },
    });

    fireEvent.change(screen.getByLabelText("Option 1:"), {
      target: { value: "Option 1 Test" },
    });

    fireEvent.click(screen.getByText("Add Poll To Event"));

    await waitFor(() => {});

    const pollNameInput = screen.getByLabelText("Poll Name:") as HTMLInputElement;
    const pollNameValue = pollNameInput.value;

    const pollOption = screen.getByLabelText("Option 1:") as HTMLInputElement;
const pollOptionValue = pollOption.value;

    expect(pollNameValue).toBe("Test Poll");
    expect(pollOptionValue).toBe("Option 1 Test");
  });
 


});
