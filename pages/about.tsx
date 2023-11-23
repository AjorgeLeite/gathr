import styled from "styled-components";
import Image from "next/image";

const About = () => {
    return ( <>
    <AboutContainer>
        <StyledImage src={"/assets/aboutbg.jpg"} alt={"About"} width={1000} height={600}></StyledImage>
        
        <AboutText>
        <h1>Welcome to gathr!</h1>
        <br/>
        <br />

At gathr, we believe that the best events are the ones created and chosen by the people who attend them. Our platform empowers you to plan and organize gatherings that reflect the collective preferences of your friends and community.
<br />
<br/>
<br/>
<h4>What can you do with gathr? </h4>
<br/>
<br/>
<ul>
<li>
Create Events: Easily create events for any occasion – from casual get-togethers to exciting vacations. Describe your event, set the date, and let the planning begin!
</li>
<br/>
<li>
    Invite Friends: Invite your friends to join the fun! Our user-friendly interface makes it simple to send out invitations, and your friends will receive notifications to ensure they don&apos;t miss out.
</li>
<br/>
<li>
    RSVP and Voting: Friends can quickly respond to your event invitation, letting you know if they can make it. But the excitement doesn&apos;t end there – our unique voting feature allows participants to collectively decide on key aspects of the event, such as choosing the perfect restaurant or deciding the destination for your next adventure.
</li>
<br/>
<li>
    Shape Your Experience: Your event, your way. Our platform is designed to put the decision-making power in the hands of the participants. Vote on activities, suggest ideas, and collaborate with your friends to create memorable experiences.
</li>
</ul>
        </AboutText>
        
        </AboutContainer>
    </> );
}
 
const StyledImage = styled(Image)`
    width: auto;
    height: 80vh;
position: absolute;

`;

const AboutText = styled.div`
padding-top: 5%;
padding-bottom: 5%;
text-align: center;
width:50%;
position: relative;
z-index: 99;
`;

const AboutContainer = styled.div`
position: relative;
display: flex;
justify-content: center;
align-items:center;
width: 100%;
min-height: 80vh;
background-color: #f64a45;
`;
export default About;