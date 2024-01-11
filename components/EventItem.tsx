import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import DoughnutChart from "./Chart";
import axios from "axios";
import { useSelector } from "react-redux";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

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

type EventItemProps = {
  title: string;
  events: Event[];
  openIndex: number | null;
  onDeleteEvent: (event: number) => void;
  onEditEvent: (event: Event) => void;
  setOpenIndex: (index: number | null) => void;
};

const EventItem: React.FC<EventItemProps> = ({
  title,
  events,
  onDeleteEvent,
  onEditEvent,
}) => {
  const userId = useSelector((userId: any) => userId.user.user.userId);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [pollDataMap, setPollDataMap] = useState<Record<number, Poll | null>>(
    {}
  );
  const [votedPolls, setVotedPolls] = useState<number[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [goingEmails, setGoingEmails] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const initialVotedPolls: number[] = [];
    const initialPollDataMap: Record<number, Poll | null> = {};

    for (const event of events) {
      if (event.polls_id) {
        for (const poll of event.polls_id) {
          if (poll.already_voted?.includes(userId)) {
            initialVotedPolls.push(poll.id);
            initialPollDataMap[poll.id] = poll;
          }
        }
      }
    }

    setVotedPolls(initialVotedPolls);
    setPollDataMap(initialPollDataMap);
  }, [events, userId]);

  const handleVote = async (
    pollId: number,
    optionVote: number,
    eventId: number
  ) => {
    try {
      const currentPollData = pollDataMap[pollId];

      const updatedEvents = events.map((event) => {
        if (event.id === eventId && event.polls_id) {
          return {
            ...event,
            polls_id: event.polls_id.map((poll) => {
              if (poll.id === pollId) {
                const updatedPoll = {
                  ...poll,
                  [`vote_${optionVote}` as keyof Poll]:
                    (poll[`vote_${optionVote}` as keyof Poll] as number) + 1,
                  already_voted: [...(poll.already_voted || []), userId],
                };

                setPollDataMap((prevMap) => ({
                  ...prevMap,
                  [pollId]: updatedPoll,
                }));
                setVotedPolls((prevVotedPolls) => [...prevVotedPolls, pollId]);
                return updatedPoll;
              }
              return poll;
            }),
          };
        }
        return event;
      });

      const updatedPoll = updatedEvents
        .find((event) => event.id === eventId)
        ?.polls_id?.find((poll) => poll.id === pollId);

      setPollDataMap((prevMap) => ({
        ...prevMap,
        [pollId]: updatedPoll as Poll,
      }));

      await axios.patch(
        `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/poll_options/${pollId}`,
        {
          polls_id: updatedPoll?.polls_id,
          name: updatedPoll?.name,
          option_1: updatedPoll?.option_1,
          option_2: updatedPoll?.option_2,
          option_3: updatedPoll?.option_3,
          option_4: updatedPoll?.option_4,
          option_5: updatedPoll?.option_5,
          option_6: updatedPoll?.option_6,
          option_7: updatedPoll?.option_7,
          option_8: updatedPoll?.option_8,
          option_9: updatedPoll?.option_9,
          option_10: updatedPoll?.option_10,
          vote_1: updatedPoll?.vote_1,
          vote_2: updatedPoll?.vote_2,
          vote_3: updatedPoll?.vote_3,
          vote_4: updatedPoll?.vote_4,
          vote_5: updatedPoll?.vote_5,
          vote_6: updatedPoll?.vote_6,
          vote_7: updatedPoll?.vote_7,
          vote_8: updatedPoll?.vote_8,
          vote_9: updatedPoll?.vote_9,
          vote_10: updatedPoll?.vote_10,
          already_voted: updatedPoll?.already_voted,
        }
      );
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleAnswer = async (eventId: number, willGo: boolean) => {
    const { authToken } = parseCookies();

    try {
      const response = await axios.get<Event>(
        `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const event = response.data;
      console.log("event", event);
      let updatedEvent: Event;

      const updatedPolls = (event.polls_id?.map((poll) => poll.polls_id) ||
        []) as unknown as Poll[];

      if (willGo) {
        console.log("updatedpolls", updatedPolls);
        console.log("eventpolls", event.polls_id);
        updatedEvent = {
          ...event,
          going: [...event.going, userId],
          invited: event.invited.filter((id) => id !== userId),
          polls_id: updatedPolls,
        };
      } else {
        updatedEvent = {
          ...event,
          going: [...event.going],
          invited: event.invited.filter((id) => id !== userId),
          polls_id: updatedPolls,
        };
      }
      await axios.patch(
        `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events/${eventId}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      router.push("/events");
    } catch (error: any) {
      console.error("Error handling answer:", error.message);
    }
  };

  const handleOpenIndexChange = async (index: number | null) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));

    if (index !== null) {
      const event = events[index];

      if (event.invited.length > 0 || event.going.length > 0) {
        const invitedEmails = event.invited.map((user) => user.email);
        const goingEmails = event.going.map((user) => user.email);

        setInvitedEmails(invitedEmails);
        setGoingEmails(goingEmails);
      }
    }
  };

  return (
    <AccordionContainer>
      <TitleContainer>
        <EventCategoryTitle>{title}</EventCategoryTitle>
      </TitleContainer>
      {events.map((event, index) => (
        <AccordionItem key={event.id}>
          <AccordionHeader onClick={() => handleOpenIndexChange(index)}>
            <div>{event.name}</div>{" "}
            <OpenClose>{openIndex === index ? "▲" : "▼"}</OpenClose>
          </AccordionHeader>
          {openIndex === index && (
            <AccordionContent>
              <BeijeText>{event.description}</BeijeText>
              {event.polls_id && (
                <>
                  <BeijeTitle>Polls:</BeijeTitle>
                  <ChartVoteContainer>
                    {event.polls_id.map((poll) => (
                      <div key={poll.id}>
                        <BeijeText>{poll.name}</BeijeText>
                        <ChartAndVote>
                          <DoughnutChart
                            key={poll.id}
                            pollData={pollDataMap[poll.id] || poll}
                          />
                          {votedPolls.includes(poll.id) && (
                            <>
                              <RedText>
                                You already voted for this poll.
                              </RedText>
                            </>
                          )}
                          {!votedPolls.includes(poll.id) && poll.option_1 && (
                            <>
                              <RedText>Vote Here</RedText>
                              <VoteBtnContainer>
                                <VoteBtn
                                  onClick={() =>
                                    handleVote(poll.id, 1, event.id)
                                  }
                                >
                                  {poll.option_1}
                                </VoteBtn>
                                {poll.option_2 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 2, event.id)
                                    }
                                  >
                                    {poll.option_2}
                                  </VoteBtn>
                                )}
                                {poll.option_3 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 3, event.id)
                                    }
                                  >
                                    {poll.option_3}
                                  </VoteBtn>
                                )}
                                {poll.option_4 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 4, event.id)
                                    }
                                  >
                                    {poll.option_4}
                                  </VoteBtn>
                                )}
                                {poll.option_5 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 5, event.id)
                                    }
                                  >
                                    {poll.option_5}
                                  </VoteBtn>
                                )}
                                {poll.option_6 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 6, event.id)
                                    }
                                  >
                                    {poll.option_6}
                                  </VoteBtn>
                                )}
                                {poll.option_7 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 7, event.id)
                                    }
                                  >
                                    {poll.option_7}
                                  </VoteBtn>
                                )}
                                {poll.option_8 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 8, event.id)
                                    }
                                  >
                                    {poll.option_8}
                                  </VoteBtn>
                                )}
                                {poll.option_9 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 9, event.id)
                                    }
                                  >
                                    {poll.option_9}
                                  </VoteBtn>
                                )}
                                {poll.option_10 && (
                                  <VoteBtn
                                    onClick={() =>
                                      handleVote(poll.id, 10, event.id)
                                    }
                                  >
                                    {poll.option_10}
                                  </VoteBtn>
                                )}
                              </VoteBtnContainer>
                            </>
                          )}
                        </ChartAndVote>
                      </div>
                    ))}
                  </ChartVoteContainer>
                </>
              )}
              <InvitedEmaisDisplay>
                {invitedEmails.length > 0 && (
                  <GorOrNot>
                    <RedTextBig>Invited to the event:</RedTextBig>
                    <EmailList>
                      {invitedEmails.map((email) => (
                        <RedText key={email}>{email}</RedText>
                      ))}
                    </EmailList>
                  </GorOrNot>
                )}

                {goingEmails.length > 0 && (
                  <GorOrNot>
                    <RedTextBig>Going to the event:</RedTextBig>
                    <EmailList>
                      {goingEmails.map((email) => (
                        <RedText key={email}>{email}</RedText>
                      ))}
                    </EmailList>
                  </GorOrNot>
                )}
              </InvitedEmaisDisplay>
              {title === "Invited Events" && (
                <GorOrNot>
                  <RedText>Can we count you in?</RedText>
                  <ButtonContainer>
                    <DeleteButton onClick={() => handleAnswer(event.id, true)}>
                      Yes, I will go
                    </DeleteButton>
                    <DeleteButton onClick={() => handleAnswer(event.id, false)}>
                      No, I won&apos;t go
                    </DeleteButton>
                  </ButtonContainer>
                </GorOrNot>
              )}
              {title === "My Created Events" && (
                <GorOrNot>
                  <RedText>Edit and delete the event here</RedText>
                  <EditAndDelete>
                    <DeleteButton onClick={() => onDeleteEvent(event.id)}>
                      Delete
                    </DeleteButton>
                    <DeleteButton onClick={() => onEditEvent(event)}>
                      Edit
                    </DeleteButton>
                  </EditAndDelete>
                </GorOrNot>
              )}
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </AccordionContainer>
  );
};
const OpenClose = styled.div`
  margin-left: 30%;
  position: absolute;
`;
const EventCategoryTitle = styled.p`
  color: #f64a45;
  font-size: 22px;
  margin-bottom: 5px;
  border-bottom: 1px solid #f64a45;
  width: auto;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const EditAndDelete = styled.div`
  display: flex;
  gap: 10%;
  justify-content: center;
`;

const DeleteButton = styled.button`
  background-color: #f64a45;
  color: #f3d8b6;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const BeijeTitle = styled.span`
  color: #f3d8b6;
  font-size: 36px;
`;

const BeijeText = styled.span`
  color: #f3d8b6;
  font-size: 22px;
`;

const RedText = styled.span`
  color: #f64a45;
  font-size: 16px;
  margin-bottom: 5px;
`;
const RedTextBig = styled.span`
  color: #f64a45;
  font-size: 22px;
  margin-bottom: 5px;
`;

const ChartVoteContainer = styled.div`
  display: flex;
  gap: 5%;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    width: auto;
  }
`;
const InvitedEmaisDisplay = styled.div`
  display: flex;
  gap: 5%;
  justify-content: center;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const GorOrNot = styled.div`
  background-color: #f3d8b6be;
  width: 300px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 5%;
  justify-content: center;
  @media screen and (max-width: 768px) {
    margin-top: 10px;
  }
`;

const VoteBtn = styled.button`
  padding: 5px;
  width: auto;
  border-radius: 10px;
  border: 1px solid #f57265;
  background-color: transparent;
  color: #f64a45;
  cursor: pointer;
  transition: background-color 0.5s, color 0.3s;
  margin-top: 5px;
  &:hover {
    background-color: #f57265;
    color: #f3d8b6;
  }
`;

const VoteBtnContainer = styled.div`
  width: 100%;
  gap: 5%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 5%;
  padding-right: 5%;
  padding-left: 5%;
`;

const ChartAndVote = styled.div`
  width: 300px;
  padding-top: 5%;
  padding-bottom: 5%;
  background-color: #f3d8b6be;
  border-radius: 5%;
  @media screen and (max-width: 1280px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

const AccordionContainer = styled.div`
  text-align: center;
  min-width: 60%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  @media screen and (max-width: 1280px) {
    width: 90%;
    flex-wrap: wrap;
  }
`;

const AccordionItem = styled.div`
  border-radius: 10px;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-in-out;
  transition: background-color 0.3s ease-in-out;

  @keyframes fadeInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &:hover {
    background-color: #f57265;
  }

  &:not(:hover) {
    transition: background-color 0.3s ease-in-out;
  }
`;

const fadeInOut = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const AccordionHeader = styled.div`
  min-width: 100%;
  background-color: #f64a45;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  transition: background-color 0.3s ease-in-out;
  

  &:hover {
    animation: ${fadeInOut} 1.5s infinite;
  }
`;
const AccordionContent = styled.div`
  background-color: #f48675;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 5%;
  justify-content: center;
`;

const EmailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5%;
  align-items: center;
`;

export default EventItem;
