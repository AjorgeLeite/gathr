import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styled from "styled-components";


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

type Event = {
  id: number;
  created_at: number;
  created_by: number;
  name: string;
  description: string;
  going: number[];
  invited: number[];
  polls_id?: Poll[];
};

type Poll = {
  polls_id: number;
  id: number;
  created_at: number;
  name: string;
  option_1: string;
  option_2: string;
  option_3: string;
  vote_1: number;
  vote_2: number;
  vote_3: number;
  already_voted: number[];
};

type InvitedUser = {
  invitedUserId: number;
  email: string;
};

const EditEvent: React.FC<EventItemProps> = ({ event, onSave, onCancel }) => {
  const [updatedEvent, setUpdatedEvent] = useState<Event | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [emailNotRegistered, setEmailNotRegistered] = useState(false);

  const handleAddPoll = () => {
    setUpdatedEvent((prevEvent) => ({
      ...(prevEvent as Event),
      polls_id: [
        ...(prevEvent?.polls_id || []),
        {
          polls_id: 0,
          id: 0,
          created_at: 0,
          name: "",
          option_1: "",
          option_2: "",
          option_3: "",
          vote_1: 0,
          vote_2: 0,
          vote_3: 0,
          already_voted: [],
        },
      ],
    }));
  };

  const handleDeletePoll = (pollIndex: number) => {
    setUpdatedEvent((prevEvent) => {
      const updatedPolls = [...(prevEvent?.polls_id || [])];
      updatedPolls.splice(pollIndex, 1);
      return {
        ...(prevEvent as Event),
        polls_id: updatedPolls,
      };
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
        const response = await axios.get(
          `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events/${event.id}`
        );
        setUpdatedEvent(response.data);
        console.log("emailsgetting", response.data);

        const userEmailPromises = response.data.invited.map(
          async (invitedUserId: any) => {
            console.log("emailsid", invitedUserId);
            const userEmailResponse = await axios.get(
              `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/user/${invitedUserId}`
            );
            return userEmailResponse.data.email;
          }
        );

        const userEmails = await Promise.all(userEmailPromises);

        const updatedInvitedUsers: InvitedUser[] = response.data.invited.map(
          (invitedUserId: any, index: number) => ({
            invitedUserId,
            email: userEmails[index],
          })
        );

        setInvitedUsers(updatedInvitedUsers);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!updatedEvent) return;

    const { name, value } = e.target;

    if (name.startsWith("polls_id.")) {
      const pollIndex = parseInt(name.split(".")[1], 10);

      setUpdatedEvent((prevEvent) => {
        if (!prevEvent) return prevEvent;
        const updatedPolls = [...(prevEvent.polls_id || [])];
        updatedPolls[pollIndex] = {
          ...(updatedPolls[pollIndex] || {}),
          [name.split(".")[2]]: value,
        };

        return {
          ...prevEvent,
          polls_id: updatedPolls,
        };
      });
    } else {
      setUpdatedEvent((prevEvent) => {
        if (!prevEvent) return prevEvent;
        return {
          ...(prevEvent as Event),
          [name]: value,
        };
      });
    }
  };

  const handleSaveEvent = async (updatedEvent: Event | null) => {
    if (!updatedEvent) return;
    const { authToken } = parseCookies();
    console.log("editupdated", updatedEvent);

    try {
      await axios.patch(
        `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events/${event.id}`,
        {
          ...updatedEvent,
          invited: invitedUsers.map((user) => user.invitedUserId),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      onSave(updatedEvent);
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
                  <BtnSmallBeije
                    onClick={() => handleRemoveInvite(index)}
                  >
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
                  <p>{`Option 1: ${poll.option_1}`}</p>
                  <p>{`Votes: ${poll.vote_1}`}</p>
                  <p>{`Option 2: ${poll.option_2}`}</p>
                  <p>{`Votes:${poll.vote_2}`}</p>
                  <p>{`Option 3: ${poll.option_3}`}</p>
                  <p>{`Votes: ${poll.vote_3}`}</p>
                  <br/>
                  <BtnSmallBeije onClick={() => handleDeletePoll(pollIndex)}>
                    Delete Poll
                  </BtnSmallBeije>
                </PollDisplay>
              ))}
            
          </PollDisplayContainer>
<PollDisplayContainer>
<div>
              
              <InputContainer>
                <label>Poll Name:</label>
                <InputStyled
                  type="text"
                  name="newPoll.name"
                  onChange={handleInputChange}
                />
              </InputContainer>
              <InputContainer>
                <label>Option 1:</label>
                <InputStyled
                  type="text"
                  name="newPoll.option_1"
                  onChange={handleInputChange}
                />
              </InputContainer>
              <InputContainer>
                <label>Option 2:</label>
                <InputStyled
                  type="text"
                  name="newPoll.option_2"
                  onChange={handleInputChange}
                />
              </InputContainer>
              <InputContainer>
                <label>Option 3:</label>
                <InputStyled
                  type="text"
                  name="newPoll.option_3"
                  onChange={handleInputChange}
                />
              </InputContainer>
              <BtnSmallBeije onClick={handleAddPoll}>Add Poll</BtnSmallBeije>
            </div>
</PollDisplayContainer>
          <InputContainer>
            <BtnMedium onClick={() => handleSaveEvent(updatedEvent)}>
              Edit Event
            </BtnMedium>
            <BtnMedium onClick={onCancel}>Cancel</BtnMedium>
          </InputContainer>
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
    width:60%;
  }
  @media screen and (max-width: 728px) {
    width:80%;
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
  gap:10px;
  color:#f3d8b6;

  @media screen and (max-width: 1280px) {
    width:60%;
  }
  @media screen and (max-width: 728px) {
    width:80%;
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
  
`;

export default EditEvent;