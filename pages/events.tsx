import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import axios from "axios";
import styled from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import EventItem from "@/components/EventItem";
import LoginRegisterComp from "@/components/LoginRegisterComp";
import Link from "next/link";
import { useRouter } from "next/router";
import EditEvent from "@/components/EditModal"; 

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

const handleDeleteEvent = async (eventId: number, router: any) => {
  const { authToken } = parseCookies();
  try {
    await axios.delete(
      `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events/${eventId}`
    );

    const response = await axios.get<Event[]>(
      `https://x8ki-letl-twmt.n7.xano.io/api:pI50Mzzv/events`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const updatedEvents = response.data;
    router.push('/events');
  } catch (error: any) {
    console.error("Error deleting event:", error.message);
  }
};

const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
  const [openIndexes, setOpenIndexes] = useState<[number | null, number | null, number | null]>([null, null, null]); 
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
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
    const newOpenIndexes: [number | null, number | null, number | null] = [...openIndexes];
    newOpenIndexes[categoryIndex] = index;
    setOpenIndexes(newOpenIndexes);
  };

  const handleEditEvent = (event: Event) => {
    setIsEditing(true);
    setCurrentEvent(event);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentEvent(null);
  };

  const router = useRouter();

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
          
          <RedTitle>Events</RedTitle>
<Link href={"/newevents"}>
            <CreateEventBtn>Create a New Event</CreateEventBtn>
          </Link>
          {isEditing && currentEvent ? (
            <EditEvent
                event={currentEvent}
                onCancel={handleCancelEdit}
                onSave={() => { } } 
                title={""} openIndex={null} onDeleteEvent={function (eventId: number): void {
                  throw new Error("Function not implemented.");
                } } onEditEvent={function (event: { id: number; created_at: number; created_by: number; name: string; description: string; going: number[]; invited: number[]; polls_id?: { polls_id: number; id: number; created_at: number; name: string; option_1: string; option_2: string; option_3: string; vote_1: number; vote_2: number; vote_3: number; already_voted: number[]; }[] | undefined; }): void {
                  throw new Error("Function not implemented.");
                } } setOpenIndex={function (index: number | null): void {
                  throw new Error("Function not implemented.");
                } }            />
          ) : (
            <>
              <EventItem
                title="My Created Events"
                events={myCreatedEvents}
                openIndex={openIndexes[0]}
                onDeleteEvent={(eventId: number) =>
                  handleDeleteEvent(eventId, router)
                }
                onEditEvent={handleEditEvent}
                setOpenIndex={(index: number | null) =>
                  handleOpenIndexChange(0, index)
                }
              />

              <EventItem
                title="Invited Events"
                events={invitedEvents}
                openIndex={openIndexes[1]}
                onDeleteEvent={(eventId: number) =>
                  handleDeleteEvent(eventId, router)
                }
                onEditEvent={handleEditEvent}
                setOpenIndex={(index: number | null) =>
                  handleOpenIndexChange(1, index)
                }
              />

              <EventItem
                title="Going Events"
                events={goingEvents}
                openIndex={openIndexes[2]}
                onDeleteEvent={(eventId: number) =>
                  handleDeleteEvent(eventId, router)
                }
                onEditEvent={handleEditEvent}
                setOpenIndex={(index: number | null) =>
                  handleOpenIndexChange(2, index)
                }
              />
            </>
          )}
        </EventsPageContainer>
      )}
    </>
  );
};

const RedTitle = styled.h1` 
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

  @media screen and (max-width: 1280px) {
    width: 300px;

  }

`;

const PleaseLogIn = styled.div`
  display: flex;
  width: 100%;
max-height: 80vh;
  padding: 20%;
  justify-content: space-around;
  align-items: center;
  background-color: #f3d8b6;
text-align: center;
gap: 15px;
  @media screen and (max-width: 1280px) {
    flex-direction: column;

  }

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

export default EventsPage
