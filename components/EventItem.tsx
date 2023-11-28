import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';


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
  id: number;
  created_at: number;
  name: string;
  option_1: string;
  option_2: string;
  option_3: string;
  vote_1: number;
  vote_2: number;
  vote_3: number;
};
type EventItemProps = {
  title: string;
  events: Event[];
  openIndex?: number | null;
  setOpenIndex: (index: number | null) => void;
};

const EventItem: React.FC<EventItemProps> = ({ title, events }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
  
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
                <p>{event.description}</p>
                {event.polls_id && (
                  <div>
                    <h3>Polls:</h3>
                    {event.polls_id.map((poll) => (
                      <div key={poll.id}>
                        <h4>{poll.name}</h4>
                        <p>Option 1: {poll.option_1}</p>
                        <p>Option 2: {poll.option_2}</p>
                        <p>Option 3: {poll.option_3}</p>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </AccordionContainer>
    );
  };
  


const AccordionContainer = styled.div`
  width: 500px;
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