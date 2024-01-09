import { parseCookies } from "nookies";
import axios from "axios";
import styled, { css } from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import React from "react";

type InvitedUser = {
  email: string;
  invitedUserId: number;
};

type PollOption = {
  id?: number;
  name: string;
  options: string[];
  pollOptionId?: number;
};

const NewEvent: React.FC = () => {
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [polls, setPolls] = useState<PollOption[]>([]);
  const [addedPolls, setAddedPolls] = useState<PollOption[]>([]);
  const [pollOptionIds, setPollOptionIds] = useState<number[]>([]);
  const [emailNotRegistered, setEmailNotRegistered] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pollErrorMsg, setPollErrorMsg] = useState("");

  const userId = useSelector((state: any) => state.user?.user?.userId);

  const { authToken } = parseCookies();
  const router = useRouter();

  const handleAddInvite = async () => {
    if (
      inviteEmail.trim() !== "" &&
      !invitedUsers.some((user) => user.email === inviteEmail)
    ) {
      try {
        const response = await axios.get(
          `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/user?email=${inviteEmail}`
        );

        if (response.data.length > 0) {
          const invitedUserId = response.data[0].id;
          setInvitedUsers([
            ...invitedUsers,
            { email: inviteEmail, invitedUserId },
          ]);
          setInviteEmail("");
          setEmailNotRegistered(false);
        } else {
          setEmailNotRegistered(true);
        }
      } catch (error) {
        console.error("Error getting user id:", error);
      }
    }
  };

  const handleDeleteInvite = (emailToDelete: string) => {
    const updatedInvitedUsers = invitedUsers.filter(
      (user) => user.email !== emailToDelete
    );
    setInvitedUsers(updatedInvitedUsers);
  };

  const handlePollNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    pollIndex: number
  ) => {
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].name = e.target.value;
    setPolls(updatedPolls);
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    pollIndex: number,
    optionIndex: number
  ) => {
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].options[optionIndex] = e.target.value;
    setPolls(updatedPolls);
  };

  const handleAddOption = (pollIndex: number) => {
    const updatedPolls = [...polls];
    if (updatedPolls[pollIndex].options.length < 10) {
      updatedPolls[pollIndex].options.push("");
      setPolls(updatedPolls);
    } else {
      setPollErrorMsg("You've reached the maximum options for this poll.");
    }
  };

  const handleRemoveOption = (pollIndex: number, optionIndex: number) => {
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].options.splice(optionIndex, 1);
    setPolls(updatedPolls);
  };

  const handleAddPoll = () => {
    if (polls.length < 3) {
      setPolls((prevPolls) => [...prevPolls, { name: "", options: [""] }]);
    }
  };

  const handleAddToEvent = async (pollIndex: number) => {
    const selectedPoll = polls[pollIndex];

    if (selectedPoll.options.every((option) => option.trim() === "")) {
      setPollErrorMsg("You need to have at least one option.");
      return;
    }

    if (
      selectedPoll.name.trim() === "" ||
      selectedPoll.options.some((option) => option.trim() === "")
    ) {
      setPollErrorMsg("Poll name and options cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/poll_options",
        {
          polls_id: null,
          name: selectedPoll.name,
          option_1: selectedPoll.options[0] || "",
          option_2: selectedPoll.options[1] || "",
          option_3: selectedPoll.options[2] || "",
          option_4: selectedPoll.options[3] || "",
          option_5: selectedPoll.options[4] || "",
          option_6: selectedPoll.options[5] || "",
          option_7: selectedPoll.options[6] || "",
          option_8: selectedPoll.options[7] || "",
          option_9: selectedPoll.options[8] || "",
          option_10: selectedPoll.options[9] || "",
          vote_1: 0,
          vote_2: 0,
          vote_3: 0,
          vote_4: 0,
          vote_5: 0,
          vote_6: 0,
          vote_7: 0,
          vote_8: 0,
          vote_9: 0,
          vote_10: 0,
          already_voted: [],
        }
      );

      const createdPollOption = response.data;
      setAddedPolls((prevAddedPolls) => [
        ...prevAddedPolls,
        { ...selectedPoll, pollOptionId: createdPollOption.id },
      ]);
      setPollOptionIds((prevPollOptionIds) => [
        ...prevPollOptionIds,
        createdPollOption.id,
      ]);
      setPolls((prevPolls) =>
        prevPolls.filter((_, index) => index !== pollIndex)
      );
      setPollErrorMsg("");
      return createdPollOption.id;
    } catch (error) {
      console.error("Error creating poll option:", error);
      return null;
    }
  };

  const handleRemovePollDisplay = (pollIndex: number) => {
    const updatedAddedPolls = addedPolls.filter(
      (_, index) => index !== pollIndex
    );
    const updatedPolls = polls.filter((_, index) => index !== pollIndex);

    setAddedPolls(updatedAddedPolls);
    setPolls(updatedPolls);
  };

  const handleSubmitEvent = async () => {
    if (eventName.trim() === "" || eventDescription.trim() === "") {
      setErrorMsg("Event name and description cannot be empty.");
      return;
    }
    try {
      const pollIds = [];

      for (const poll of addedPolls) {
        const pollResponse = await axios.post(
          "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/polls",
          {
            name: poll.name,
            poll_options_id: [poll.pollOptionId],
          }
        );

        const createdPoll = pollResponse.data;
        pollIds.push(createdPoll.id);
      }

      const eventResponse = await axios.post(
        "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events",
        {
          name: eventName,
          description: eventDescription,
          created_by: userId,
          invited: invitedUsers.map((user) => user.invitedUserId),
          polls_id: pollIds,
        }
      );

      for (let i = 0; i < addedPolls.length; i++) {
        const pollId = pollIds[i];
        const pollOptionId = addedPolls[i].pollOptionId;

        await axios.patch(
          `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/poll_options/${pollOptionId}`,
          {
            polls_id: pollId,
            name: addedPolls[i].name,
            option_1: addedPolls[i].options[0] || "",
            option_2: addedPolls[i].options[1] || "",
            option_3: addedPolls[i].options[2] || "",
            option_4: addedPolls[i].options[3] || "",
            option_5: addedPolls[i].options[4] || "",
            option_6: addedPolls[i].options[5] || "",
            option_7: addedPolls[i].options[6] || "",
            option_8: addedPolls[i].options[7] || "",
            option_9: addedPolls[i].options[8] || "",
            option_10: addedPolls[i].options[9] || "",
            vote_1: 0,
            vote_2: 0,
            vote_3: 0,
            vote_4: 0,
            vote_5: 0,
            vote_6: 0,
            vote_7: 0,
            vote_8: 0,
            vote_9: 0,
            vote_10: 0,
            already_voted: [],
          }
        );
      }
      setErrorMsg("");
      router.push("/events");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <NewEventContainer>
      <RedTextBig>Create a New Event</RedTextBig>
      <FormContainer>
        <CategoryContainer>
          <label htmlFor="eventName">Event Name:</label>
          <InputStyled
            id="eventName"
            type="text"
            placeholder="Add a name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </CategoryContainer>
        <CategoryContainer>
          <label htmlFor="eventDesc">Event Description:</label>
          <InputStyled
            id="eventDesc"
            type="text"
            placeholder="Add a description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
        </CategoryContainer>
        <CategoryContainer>
          <label htmlFor="eventInv">Invite:</label>
          <InputStyled
            id="eventInv"
            type="email"
            placeholder="Add a email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <BtnSmallBeije onClick={handleAddInvite}>Add Invite</BtnSmallBeije>
        </CategoryContainer>
        {emailNotRegistered && (
          <TextWarning>Email is not registered</TextWarning>
        )}
        <InvitedEmails>
          <label htmlFor="eventPplInv">People Invited:</label>
          {invitedUsers.map((user, index) => (
            <InvitedEmail key={index}>
              {user.email}
              <DeleteInviteButton
                onClick={() => handleDeleteInvite(user.email)}
              >
                Delete
              </DeleteInviteButton>
            </InvitedEmail>
          ))}
        </InvitedEmails>

        <PollsContainer>
          <h2>Polls:</h2>
          {polls.map((poll, pollIndex) => (
            <PoolWindow key={pollIndex}>
              <label htmlFor="pollName">Poll Name:</label>
              <input
                id="pollName"
                type="text"
                placeholder="Poll Name"
                value={poll.name}
                onChange={(e) => handlePollNameChange(e, pollIndex)}
              />

              <label htmlFor="pollOptions">Options:</label>

              <BtnSmall onClick={() => handleAddOption(pollIndex)}>
                Add Option
              </BtnSmall>

              {poll.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    id="pollOptions"
                    type="text"
                    placeholder="Add Option"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(e, pollIndex, optionIndex)
                    }
                  />

                  <BtnSmall
                    onClick={() => handleRemoveOption(pollIndex, optionIndex)}
                  >
                    Remove Option
                  </BtnSmall>
                </div>
              ))}

              <BtnSmall onClick={() => handleAddToEvent(pollIndex)}>
                Add to Event
              </BtnSmall>
              <TextWarning>{pollErrorMsg}</TextWarning>
              <BtnSmall onClick={() => handleRemovePollDisplay(pollIndex)}>
                Remove Poll
              </BtnSmall>
            </PoolWindow>
          ))}

          {polls.length < 3 && addedPolls.length < 3 && (
            <BtnSmallBeije onClick={handleAddPoll}>Add Poll</BtnSmallBeije>
          )}
        </PollsContainer>

        {addedPolls.length > 0 && (
          <CategoryContainer>
            {addedPolls.map((addedPoll, index) => (
              <AddedPollDisplay key={index}>
                <p>{`Poll Name: ${addedPoll.name}`}</p>
                <p>{`Options: ${addedPoll.options.join(", ")}`}</p>
                <BtnSmall onClick={() => handleRemovePollDisplay(index)}>
                  Remove Poll
                </BtnSmall>
              </AddedPollDisplay>
            ))}
          </CategoryContainer>
        )}

        <BtnMedium onClick={handleSubmitEvent}>Create Event</BtnMedium>
        <TextWarning>{errorMsg}</TextWarning>
      </FormContainer>
    </NewEventContainer>
  );
};

const AddedPollDisplay = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background-color: #f3d8b6;
  border-radius: 10px;
  padding: 10px;
  color: #f64a45;
`;

const NewEventContainer = styled.div`
  width: 100%;
  min-height: 75vh;
  background-color: #f3d8b6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5%;
`;

const FormContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 18px;
  }

  input {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #f64a45;
  }

  @media screen and (max-width: 1280px) {
    width: 70%;
  }
  @media screen and (max-width: 728px) {
    width: 90%;
  }
`;

const TextWarning = styled.h3`
  color: #f64a45;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const InvitedEmail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 5px;
  margin-top: 5px;
  gap: 10%;
`;
const RedTextBig = styled.p`
  color: #f64a45;
  font-size: 22px;
  margin-bottom: 5px;
`;
const DeleteInviteButton = styled.button`
  background-color: #f64a45;
  color: #fff;
  border: none;
  padding: 5px;
  cursor: pointer;
`;
const PoolWindow = styled.div``;

const InputStyled = styled.input`
  background-color: #f3d8b6;
  padding: 5px;
  color: grey;
  border-radius: 10px;
  border: 0px;
  min-height: 40px;
  width: 50%;
`;

const BtnSmall = styled.button`
  padding: 5px;
  width: auto;
  border-radius: 10px;
  border: 1px solid #f57265;
  background-color: transparent;
  color: #f64a45;
  cursor: pointer;
  transition: background-color 0.5s, color 0.3s;

  &:hover {
    background-color: #f57265;
    color: #f3d8b6;
  }
`;
const BtnMedium = styled.button`
  padding: 10px;
  width: auto;
  border-radius: 10px;
  border: 1px solid #f57265;
  background-color: transparent;
  color: #f64a45;
  cursor: pointer;
  transition: background-color 0.5s, color 0.3s;

  &:hover {
    background-color: #f57265;
    color: #f3d8b6;
  }
`;

const BtnSmallBeije = styled.button`
  padding: 5px;
  width: auto;
  border-radius: 10px;
  border: 1px solid #f3d8b6;
  background-color: transparent;
  color: #f3d8b6;
  cursor: pointer;
  transition: background-color 0.5s, color 0.3s;

  &:hover {
    background-color: #f3d8b6;
    color: #f57265;
  }
`;

const CategoryContainer = styled.div`
  gap: 10px;
  padding: 10px;
  width: 100%;
  height: auto;
  min-height: 15%;
  background-color: #f57265;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  color: #f3d8b6;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const InvitedEmails = styled.div`
  padding: 10px;
  width: 100%;
  height: auto;
  min-height: 15%;
  background-color: #f57265;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 10px;
  color: #f3d8b6;
  flex-direction: column;
`;
const PollsContainer = styled.div`
  padding: 15px;
  width: 100%;
  min-height: 15%;
  background-color: #f57265;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 20px;
  color: #f3d8b6;

  label {
    font-size: 20px;
    margin-bottom: 10px;
  }

  > div {
    width: 100%;
    margin-top: 15px;
    padding: 15px;
    border: 2px solid #f64a45;
    border-radius: 10px;
    background-color: #f3d8b6;
    display: flex;
    flex-direction: column;
    gap: 15px;
    color: #f64a45;

    input {
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #f64a45;
      background-color: #f3d8b6;
    }

    > div {
      display: flex;
      gap: 15px;
      align-items: center;

      input {
        width: 70%;
      }

      button {
        width: 30%;
      }
    }

    button {
      width: 100%;
    }
  }

  > button {
    margin-top: 20px;
  }

  @media screen and (max-width: 768px) {
    padding: 10px;

    > div {
      padding: 10px;

      input {
        padding: 8px;
      }

      button {
        font-size: 14px;
      }
    }
  }
`;

export default NewEvent;
