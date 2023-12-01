import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import axios from "axios";
import styled from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import EventItem from "@/components/EventItem";
import LoginRegisterComp from "@/components/LoginRegisterComp";
import Link from "next/link";


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

type EventsPageProps = {
  events: Event[];
};

export const getServerSideProps: GetServerSideProps<EventsPageProps> = async (
  context
) => {
  try {
    const { authToken } = parseCookies(context);

    const response = await axios.get<Event[]>(
      `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const events = response.data;

    return {
      props: { events },
    };
  } catch (error: any) {
    console.error("Error :", error.message);
    return {
      props: { events: [] },
    };
  }
};

const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
  console.log("Events", events);
  const [openIndexes, setOpenIndexes] = useState([null, null, null]);
  const userData = useSelector((userData: any) => userData.user.user);

  const myCreatedEvents = events.filter(
    (event) => event.created_by === userData.userId
  );
  const invitedEvents = events.filter((event) =>
    event.invited.includes(userData.userId)
  );
  const goingEvents = events.filter((event) =>
    event.going.includes(userData.userId)
  );

  const handleOpenIndexChange = (
    categoryIndex: number,
    index: number | null
  ) => {
    const newOpenIndexes: any[] = [...openIndexes];
    newOpenIndexes[categoryIndex] = index;
    setOpenIndexes(newOpenIndexes);
  };

  return (
    <>
      {userData.isLoggedIn === false ? (
        <>
          <PleaseLogIn>
            <h1>Please log in to access your events</h1>
            <LoginRegisterComp />
          </PleaseLogIn>
        </>
      ) : (
        <EventsPageContainer>
          <Link href={"/newevent"}>
          <CreateEventBtn>Create a New Event</CreateEventBtn>
          </Link>
          <RedTitle>Events</RedTitle>

          <EventItem
            title="My Created Events"
            events={myCreatedEvents}
            openIndex={openIndexes[0]}
            setOpenIndex={(index: number | null) =>
              handleOpenIndexChange(0, index)
            }
          />

          <EventItem
            title="Invited Events"
            events={invitedEvents}
            openIndex={openIndexes[1]}
            setOpenIndex={(index: number | null) =>
              handleOpenIndexChange(1, index)
            }
          />

          <EventItem
            title="Going Events"
            events={goingEvents}
            openIndex={openIndexes[2]}
            setOpenIndex={(index: number | null) =>
              handleOpenIndexChange(2, index)
            }
          />
        </EventsPageContainer>
      )}
    </>
  );
};

const RedTitle = styled.text`
color: #f64a45;
font-size: 36px;
`;


const CreateEventBtn = styled.button`
  width: 450px;
  height: 45px;
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

const PleaseLogIn = styled.div`
  display: flex;
  width: 100%;
  height: 80vh;
  padding: 20%;
  justify-content: space-around;
  align-items: center;
  background-color: #f3d8b6;
`;

const EventsPageContainer = styled.div`
  padding: 4%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: #f3d8b6;
`;

export default EventsPage;
