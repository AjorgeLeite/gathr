import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DoughnutChart from './Chart';
import axios from 'axios';
import { useSelector } from "react-redux";


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
  setOpenIndex: (index: number | null) => void;
};

const EventItem: React.FC<EventItemProps> = ({ title, events }) => {
  const userId = useSelector((userId: any) => userId.user.user.userId);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [pollDataMap, setPollDataMap] = useState<Record<number, Poll | null>>({});
  const [votedPolls, setVotedPolls] = useState<number[]>([]);

  useEffect(() => {
    const initialPollDataMap: Record<number, Poll | null> = {};
    events.forEach((event) => {
      if (event.polls_id) {
        event.polls_id.forEach((poll) => {
          initialPollDataMap[poll.id] = null;
        });
      }
    });
    setPollDataMap(initialPollDataMap);
  }, [events]);

  const checkVoted = () => {
    for (const event of events) {
      if (event.polls_id) {
        for (const poll of event.polls_id) {
          if (poll.already_voted?.includes(userId)) {
            setVotedPolls((prevVotedPolls) => [...prevVotedPolls, poll.id]);
            setPollDataMap((prevMap) => ({ ...prevMap, [poll.id]: poll }));
            return;
          }
        }
      }
    }
  };

  useEffect(() => {
    checkVoted();
  }, [events]);

  const handleVote = async (pollId: number, optionVote: number, eventId: number) => {
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
                  [`vote_${optionVote}` as keyof Poll]: (poll[`vote_${optionVote}` as keyof Poll] as number) + 1,
                  already_voted: [...(poll.already_voted || []), userId],
                };

                setPollDataMap((prevMap) => ({ ...prevMap, [pollId]: updatedPoll }));
                setVotedPolls((prevVotedPolls) => [...prevVotedPolls, pollId]);
                return updatedPoll;
              }
              return poll;
            }),
          };
        }
        return event;
      });

      const updatedPoll = updatedEvents.find((event) => event.id === eventId)?.polls_id?.find((poll) => poll.id === pollId);

      setPollDataMap((prevMap) => ({ ...prevMap, [pollId]: updatedPoll as Poll }));

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

  const handleOpenIndexChange = (index: number | null) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <AccordionContainer>
      <h2>{title}</h2>
      {events.map((event, index) => (
        <AccordionItem key={event.id}>
          <AccordionHeader onClick={() => handleOpenIndexChange(index)}>
            {event.name} <div>{openIndex === index ? '▲' : '▼'}</div>
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
                          <DoughnutChart key={poll.id} pollData={pollDataMap[poll.id] || poll} />

                          {votedPolls.includes(poll.id) ? (
                            <RedText>You already voted for this poll.</RedText>
                          ) : (
                            <>
                              <RedText>Vote Here</RedText>
                              <VoteBtnContainer>
                                <VoteBtn onClick={() => handleVote(poll.id, 1, event.id)}>{poll.option_1}</VoteBtn>
                                <VoteBtn onClick={() => handleVote(poll.id, 2, event.id)}>{poll.option_2}</VoteBtn>
                                <VoteBtn onClick={() => handleVote(poll.id, 3, event.id)}>{poll.option_3}</VoteBtn>
                              </VoteBtnContainer>
                            </>
                          )}
                        </ChartAndVote>
                      </div>
                    ))}
                  </ChartVoteContainer>
                </>
              )}
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </AccordionContainer>
  );
};

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
`;

const ChartVoteContainer = styled.div`
display: flex; 
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
  min-width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AccordionItem = styled.div`
  border-radius: 2%;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  min-width: 100%;
  background-color: #f64a45;
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
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

export default EventItem;
