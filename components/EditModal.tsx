import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";

type User = {
  id: number;
  name: string;
  email: string;
};

type Poll = {
  id: number;
  created_at: number;
  name: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: any;
  option_5: any;
  option_6: any;
  option_7: any;
  option_8: any;
  option_9: any;
  option_10: any;
  vote_1: number;
  vote_2: number;
  vote_3: number;
  vote_4: number;
  vote_5: number;
  vote_6: number;
  vote_7: number;
  vote_8: number;
  vote_9: number;
  vote_10: number;
  already_voted: number[];
  polls_id?: number[];
};

type Event = {
  id: number;
  created_at: number;
  created_by: number;
  name: string;
  description: string;
  going: User[];
  invited: User[];
  polls_id?: Poll[];
  newPoll?: {
    id: number;
    created_at: number;
    name: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: any;
    option_5: any;
    option_6: any;
    option_7: any;
    option_8: any;
    option_9: any;
    option_10: any;
    vote_1: number;
    vote_2: number;
    vote_3: number;
    vote_4: number;
    vote_5: number;
    vote_6: number;
    vote_7: number;
    vote_8: number;
    vote_9: number;
    vote_10: number;
    already_voted: number[];
    polls_id?: number[];
  };
};

type InvitedUser = {
  invitedUserId: number;
  email: string;
};

type EventItemProps = {
  title: string;
  event: Event;
  openIndex: number | null;
  onDeleteEvent: (eventId: number) => void;
  onEditEvent: (event: Event) => void;
  setOpenIndex: (index: number | null) => void;
  onSave: (updatedEvent: Event) => void;
  onCancel: () => void;
};

const EditEvent: React.FC<EventItemProps> = ({ event, onSave, onCancel }) => {
  const [updatedEvent, setUpdatedEvent] = useState<Event | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [emailNotRegistered, setEmailNotRegistered] = useState(false);
  const [newPollIds, setNewPollIds] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [pollErrorMsg, setPollErrorMsg] = useState("");
  const [numOptions, setNumOptions] = useState(1);
  const [pollOptions, setPollOptions] = useState<string[]>([""]);

  const handleAddOption = () => {
    if (numOptions < 10) {
      setNumOptions((prevNumOptions) => prevNumOptions + 1);
      setPollOptions((prevOptions) => [...prevOptions, ""]);
    } else {
      setPollErrorMsg("You cannot have more than 10 options");
    }
  };

  const handleRemoveOption = (index: number) => {
    setNumOptions((prevNumOptions) => prevNumOptions - 1);
    setPollOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions.splice(index, 1);
      return updatedOptions;
    });
  };

  const handleDeletePoll = (pollIndex: number) => {
    if (!updatedEvent) return;

    const updatedPolls = [...(updatedEvent.polls_id || [])];
    const deletedPollId = updatedPolls[pollIndex]?.id;

    setNewPollIds((prevIds) => prevIds.filter((id) => id !== deletedPollId));

    updatedPolls.splice(pollIndex, 1);

    const remainingPollIds: number[] = updatedPolls
      .flatMap((poll) => poll.polls_id || [])
      .filter((id) => id !== deletedPollId);

    setNewPollIds(remainingPollIds);

    setUpdatedEvent({
      ...(updatedEvent as Event),
      polls_id: updatedPolls,
    });
  };

  const handleRemoveInvite = (index: number) => {
    const updatedInvitedUsers = [...invitedUsers];
    updatedInvitedUsers.splice(index, 1);
    setInvitedUsers(updatedInvitedUsers);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      console.log("event fetching", event);
      try {
        setUpdatedEvent(event);
        console.log("polls_id:s", event);
        const updatedInvitedUsers: InvitedUser[] = event.invited.map(
          (user: User) => ({
            invitedUserId: user.id,
            email: user.email,
          })
        );

        setInvitedUsers(updatedInvitedUsers);
        const pollIds = event.polls_id?.map((poll) => poll.polls_id) || [];
        console.log("useffectpollids", pollIds);
        console.log("event", event);
        setNewPollIds(pollIds.flat().filter(id => id !== undefined) as number[]);
      } catch (error: any) {
        console.error("Error fetching event:", error.message);
      }
    };

    if (event) {
      fetchEvent();
    }
  }, [event]);

  const router = useRouter();

  const getUserIdByEmail = async () => {
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
        console.error("Error fetching user id:", error);
      }
    }
  };

 const handleAddPoll = async () => {
  const newPollName = (updatedEvent?.newPoll?.name || "").trim();
  const newPollOptions = Array.from(
    { length: numOptions },
    (_, index) =>
      (
        (updatedEvent?.newPoll?.[
          `option_${index + 1}` as keyof typeof updatedEvent.newPoll
        ] as string) || ""
      ).trim() || ""
  );

  const selectedOptions = newPollOptions.filter((option) => option !== "");

  if (!newPollName || selectedOptions.length === 0) {
    setPollErrorMsg("Poll name and at least one option are required.");
    return;
  }

  try {
    const optionsResponse = await axios.post(
      "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/poll_options",
      {
        name: newPollName,
        ...selectedOptions.reduce((acc, option, index) => {
          (acc as Record<string, any>)[`option_${index + 1}`] = option;

          return acc;
        }, {}),
      }
    );

    const newOptionsId = optionsResponse.data.id;

    const newPoll: any = {
      id: 0,
      created_at: 0,
      name: newPollName,
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
      polls_id: [],
      ...selectedOptions.reduce((acc, option, index) => {
        (acc as Record<string, any>)[`option_${index + 1}`] = option;

        return acc;
      }, {}),
    };

    setUpdatedEvent((prevEvent) => {
      if (!prevEvent) return prevEvent;

      const updatedPolls = [...(prevEvent.polls_id || [])];
      updatedPolls.push(newPoll);

      return {
        ...(prevEvent as Event),
        polls_id: updatedPolls,
        newPoll: {
          id: 0,
          created_at: 0,
          name: "",
          option_1: "",
          option_2: "",
          option_3: "",
          option_4: "",
          option_5: "",
          option_6: "",
          option_7: "",
          option_8: "",
          option_9: "",
          option_10: "",
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
          polls_id: [],
        },
      };
    });

    const pollResponse = await axios.post(
      "https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/polls",
      {
        name: newPollName,
        poll_options_id: newOptionsId,
      }
    );

    const newPollId = pollResponse.data.id || 0;

    const updatedPrevPollsIds = Array.from(new Set([...newPollIds, newPollId]));



    setNewPollIds(updatedPrevPollsIds);
    console.log("newpollids", newPollId);
    console.log("updatedPrevPollsIds", updatedPrevPollsIds);

    await axios.patch(
      `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/poll_options/${newOptionsId}`,
      {
        name: newPollName,
        ...selectedOptions.reduce((acc, option, index) => {
          (acc as Record<string, any>)[`option_${index + 1}`] = option;


          return acc;
        }, {}),
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
        polls_id: newPollId,
      }
    );

    setPollErrorMsg("");
  } catch (error) {
    console.error("Error creating poll:", error);
  }
};

  
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!updatedEvent) return;

    const { name, value } = e.target;

    if (name === "name" || name === "description") {
      setUpdatedEvent((prevEvent) => ({
        ...(prevEvent as Event),
        [name]: value,
      }));
    } else if (name.startsWith("newPoll.")) {
      setUpdatedEvent((prevEvent) => {
        if (!prevEvent) return prevEvent;

        const updatedNewPoll = {
          ...(prevEvent.newPoll || {}),
          [name.split(".")[1]]: value,
        };

        return {
          ...prevEvent,
          newPoll: updatedNewPoll as Poll,
        };
      });
    }
  };

  const handleSaveEvent = async (updatedEvent: Event | null) => {
    if (!updatedEvent) return;

    const { authToken } = parseCookies();

    if (
      updatedEvent.name.trim() === "" ||
      updatedEvent.description.trim() === ""
    ) {
      setErrorMsg("Event name and description cannot be empty.");
      return;
    }

    try {
      const { polls_id, ...eventData } = updatedEvent;

      const invitedUserIds = invitedUsers.map((user) => user.invitedUserId);

      const hasPollChanges =
        JSON.stringify(newPollIds.sort()) !==
        JSON.stringify(polls_id?.map((poll) => poll.id)?.sort());

      console.log("ididididid", polls_id);
      console.log("pollchange", hasPollChanges);

      const updatedEventData = {
        name: updatedEvent?.name || "",
        description: updatedEvent?.description || "",
        invited: updatedEvent?.invited || [],
        polls_id: hasPollChanges
          ? newPollIds
          : polls_id?.map((poll) => poll.polls_id),
        created_by: updatedEvent?.created_by,
        going: updatedEvent?.going || [],
      };
      console.log("updatedEventData", updatedEventData);
      await axios.patch(
        `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events/${event.id}`,
        {
          ...updatedEventData,
          invited: invitedUserIds,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setErrorMsg("");
      onSave(updatedEvent);
      router.push("/events");
      onCancel();
    } catch (error: any) {
      console.error("Error updating event:", error.message);
    }
  };

  return (
    <EventEditContainers>
      {updatedEvent ? (
        <>
          <TextWarning>
            Editing event &quot;{updatedEvent.name}&quot; :
          </TextWarning>
          <CategoryContainer>
            <InputContainer>
              <label>Event Name:</label>
              <InputStyled
                type="text"
                name="name"
                value={updatedEvent?.name || ""}
                onChange={handleInputChange}
              />
            </InputContainer>
          </CategoryContainer>
          <CategoryContainer>
            <InputContainer>
              <label>Description:</label>
              <InputStyled
                name="description"
                value={updatedEvent?.description || ""}
                onChange={handleInputChange}
              ></InputStyled>
            </InputContainer>
          </CategoryContainer>
          <EmailsContainer>
            <label>Invited Emails:</label>
            <EmailsDisplay>
              {invitedUsers.map((user, index) => (
                <EmailsDisplay key={index}>
                  {user.email}{" "}
                  <BtnSmallBeije onClick={() => handleRemoveInvite(index)}>
                    Remove
                  </BtnSmallBeije>
                </EmailsDisplay>
              ))}
            </EmailsDisplay>
            <InputContainer>
              <InputStyled
                type="text"
                placeholder="Add new email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <BtnSmallBeije onClick={getUserIdByEmail}>
                Add Invite
              </BtnSmallBeije>
            </InputContainer>
          </EmailsContainer>
          {emailNotRegistered && (
            <TextWarning>Email is not registered</TextWarning>
          )}

          <PollDisplayContainer>
            {updatedEvent.polls_id &&
              updatedEvent.polls_id.map((poll, pollIndex) => (
                <PollDisplay key={pollIndex}>
                  <h4>{`Poll ${pollIndex + 1}: ${poll.name}`}</h4>
                  <br />

                  {poll.option_1 && (
                    <>
                      <p>{`Option 1: ${poll.option_1}`}</p>
                      <p>{`Votes: ${poll.vote_1}`}</p>
                    </>
                  )}

                  {poll.option_2 && (
                    <>
                      <p>{`Option 2: ${poll.option_2}`}</p>
                      <p>{`Votes: ${poll.vote_2}`}</p>
                    </>
                  )}

                  {poll.option_3 && (
                    <>
                      <p>{`Option 3: ${poll.option_3}`}</p>
                      <p>{`Votes: ${poll.vote_3}`}</p>
                    </>
                  )}

                  {poll.option_4 && (
                    <>
                      <p>{`Option 4: ${poll.option_4}`}</p>
                      <p>{`Votes: ${poll.vote_4}`}</p>
                    </>
                  )}
                  {poll.option_5 && (
                    <>
                      <p>{`Option 5: ${poll.option_5}`}</p>
                      <p>{`Votes: ${poll.vote_5}`}</p>
                    </>
                  )}

                  {poll.option_6 && (
                    <>
                      <p>{`Option 6: ${poll.option_6}`}</p>
                      <p>{`Votes: ${poll.vote_6}`}</p>
                    </>
                  )}

                  {poll.option_7 && (
                    <>
                      <p>{`Option 7: ${poll.option_7}`}</p>
                      <p>{`Votes: ${poll.vote_7}`}</p>
                    </>
                  )}

                  {poll.option_8 && (
                    <>
                      <p>{`Option 8: ${poll.option_8}`}</p>
                      <p>{`Votes: ${poll.vote_8}`}</p>
                    </>
                  )}
                  {poll.option_9 && (
                    <>
                      <p>{`Option 9: ${poll.option_9}`}</p>
                      <p>{`Votes: ${poll.vote_9}`}</p>
                    </>
                  )}

                  {poll.option_10 && (
                    <>
                      <p>{`Option 10: ${poll.option_10}`}</p>
                      <p>{`Votes: ${poll.vote_10}`}</p>
                    </>
                  )}

                  <br />
                  <BtnSmallBeije onClick={() => handleDeletePoll(pollIndex)}>
                    Delete Poll
                  </BtnSmallBeije>
                </PollDisplay>
              ))}
          </PollDisplayContainer>
          <TextWarning>
            Polls cannot be edited. Please remove and create a new one.
          </TextWarning>
          <PollDisplayContainer>
            <div>
              <InputContainer>
                <label>Poll Name:</label>
                <InputStyled
                  type="text"
                  name="newPoll.name"
                  onChange={handleInputChange}
                  value={updatedEvent?.newPoll?.name || ""}
                />
              </InputContainer>
              {pollOptions.map((option, index) => (
                <InputContainer key={index}>
                  <label>{`Option ${index + 1}:`}</label>
                  <InputStyled
                    type="text"
                    name={`newPoll.option_${index + 1}`}
                    onChange={handleInputChange}
                    value={
                      (updatedEvent?.newPoll?.[
                        `option_${
                          index + 1
                        }` as keyof typeof updatedEvent.newPoll
                      ] as string) || ""
                    }
                  />
                  <BtnSmallBeije onClick={() => handleRemoveOption(index)}>
                Remove 
              </BtnSmallBeije>
                </InputContainer>
              ))}
              <PollBtnContainer>
                <BtnSmallBeije onClick={handleAddOption}>
                  Add Option
                </BtnSmallBeije>
                <BtnSmallBeije onClick={handleAddPoll}>
                  Add Poll To Event
                </BtnSmallBeije>
              </PollBtnContainer>
              <TextWarningBeije>{pollErrorMsg}</TextWarningBeije>
            </div>
          </PollDisplayContainer>
          <InputContainer>
            <BtnMedium
              data-testid="edit-event-button"
              onClick={() => handleSaveEvent(updatedEvent)}
            >
              Edit Event
            </BtnMedium>

            <BtnMedium onClick={onCancel}>Cancel</BtnMedium>
          </InputContainer>
          <TextWarning>{errorMsg}</TextWarning>
        </>
      ) : (
        <Image
          src="/assets/loading1.5s.gif"
          alt="gathr logo"
          width={70}
          height={70}
        />
      )}
    </EventEditContainers>
  );
};

const PollBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
`;
const PollDisplay = styled.div`
  border: 1px solid #f3d8b6;
  border-radius: 20px;
  padding: 20px;

  @media screen and (max-width: 1280px) {
  }

  @media screen and (max-width: 728px) {
    margin-top: 20px;
  }
`;
const PollDisplayContainer = styled.div`
  width: 40%;
  display: flex;
  gap: 2%;
  justify-content: center;
  align-items: center;
  background-color: #f57265;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  color: #f3d8b6;
  text-align: center;
  @media screen and (max-width: 1280px) {
    width: 60%;
    flex-direction: column;
  }

  @media screen and (max-width: 728px) {
    width: 80%;
  }
`;

const InputStyled = styled.input`
  background-color: #f3d8b6;
  padding: 5px;
  color: grey;
  border-radius: 10px;
  border: 0.5px solid #fbaf85;
  margin-bottom: 10px;
  font-family: inherit;
`;

const TextWarning = styled.h3`
  color: #f64a45;
  text-align: center;
`;
const TextWarningBeije = styled.h3`
  color: #f3d8b6;
`;

const EventEditContainers = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 60vh;
  align-items: center;
  gap: 10px;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 2%;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 728px) {
    flex-wrap: wrap;
  }
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
margin-bottom: 3%;
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
  padding: 10px;
  width: 40%;
  height: auto;
  min-height: 15%;
  background-color: #f57265;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  color: #f3d8b6;

  @media screen and (max-width: 1280px) {
    width: 60%;
  }
  @media screen and (max-width: 728px) {
    width: 80%;
  }
`;

const EmailsContainer = styled.div`
  width: 40%;
  height: auto;
  min-height: 10%;
  background-color: #f57265;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  color: #f3d8b6;

  @media screen and (max-width: 1280px) {
    width: 60%;
  }
  @media screen and (max-width: 728px) {
    width: 80%;
  }
`;

const EmailsDisplay = styled.div`
  width: 100%;
  display: flex;
  gap: 5%;
  justify-content: center;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 5%;
  flex-wrap: wrap;
`;

export default EditEvent;
