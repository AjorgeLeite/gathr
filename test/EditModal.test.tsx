import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
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

    fireEvent.click(screen.getByTestId("edit-event-button"));

    await waitFor(() => expect(onSaveMock).toHaveBeenCalled());
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
});
