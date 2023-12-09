import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DoughnutChart from "./Chart";
import axios from "axios";
import { useSelector } from "react-redux";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

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
          vote_1: updatedPoll?.vote_1,
          vote_2: updatedPoll?.vote_2,
          vote_3: updatedPoll?.vote_3,
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

      let updatedEvent: Event;

      if (willGo) {
        updatedEvent = {
          ...event,
          going: [...event.going, userId],
          invited: event.invited.filter((id) => id !== userId),
        };
      } else {
        updatedEvent = {
          ...event,
          invited: event.invited.filter((id) => id !== userId),
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
        try {
          const invitedEmailPromises = event.invited.map((userId) =>
            axios.get(
              `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/user/${userId}`
            )
          );

          const goingEmailPromises = event.going.map((userId) =>
            axios.get(
              `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/user/${userId}`
            )
          );

          const invitedEmails = await Promise.all(invitedEmailPromises);
          const goingEmails = await Promise.all(goingEmailPromises);

          const invitedEmailList = invitedEmails.map(
            (response) => response.data.email
          );
          const goingEmailList = goingEmails.map(
            (response) => response.data.email
          );

          setInvitedEmails(invitedEmailList);
          setGoingEmails(goingEmailList);
        } catch (error) {
          console.error("Error fetching user emails:", error);
        }
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
            {event.name} <div>{openIndex === index ? "▲" : "▼"}</div>
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

const EventCategoryTitle = styled.text`
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

const BeijeTitle = styled.text`
  color: #f3d8b6;
  font-size: 36px;
`;

const BeijeText = styled.text`
  color: #f3d8b6;
  font-size: 22px;
`;

const RedText = styled.text`
  color: #f64a45;
  font-size: 16px;
  margin-bottom: 5px;
`;
const RedTextBig = styled.text`
  color: #f64a45;
  font-size: 22px;
  margin-bottom: 5px;
`;

const ChartVoteContainer = styled.div`
  display: flex;
  gap: 5%;
  justify-content: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const InvitedEmaisDisplay = styled.div`
  display: flex;
  gap: 5%;
  justify-content: center;
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

const AccordionHeader = styled.div`
  min-width: 100%;
  background-color: #f64a45;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out; 

  &:hover {
    transform: translateY(-5px);
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
