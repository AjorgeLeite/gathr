import Image from "next/image";
import styled, { keyframes } from "styled-components";
import LoginRegisterComp from "@/components/LoginRegisterComp";
import React from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const userData = useSelector((userData: any) => userData.user.user)
  return (
    <>
      <HomepageContainer>
        <HomepageBanner>
          <StyledLogo
            src={"/assets/LOGOROUNDPNGBeije.png"}
            alt={"gathr logo"}
            width={800}
            height={800}
          ></StyledLogo>
          <HomepageBannerText>
            <h1>Welcome to gathr.</h1>
            <p>
              Plan and decide together! <br /> gathr lets you effortlessly
              create events with friends. <br />
              Vote on activities and make every moment unforgettable. Start now!
            </p>
          </HomepageBannerText>
        </HomepageBanner>
        <HomepageInfo>
          <FooterBar>
            <StyledImageAnimated
              src="/assets/LOGOPNGBEIJE.png"
              alt="gathr logo"
              width={80}
              height={35}
            ></StyledImageAnimated>
          </FooterBar>
          <StyledImage
            src={"/assets/3.jpg"}
            alt={"gathr logo"}
            width={1000}
            height={600}
          ></StyledImage>
          
          {userData.isLoggedIn ? (
            <HomepageInfoContentLoggedIn>
            <HomepageInfoText>
            <h1>Have fun with your friends! Create an event and invite them!</h1>
          </HomepageInfoText>
          </HomepageInfoContentLoggedIn>
          ) : (
          <HomepageInfoContent>
            <HomepageInfoText>
              <h1>Log in, Sign up, and start inviting your friends!</h1>
            </HomepageInfoText>
            <LoginRegisterComp></LoginRegisterComp>
          </HomepageInfoContent>
          )}
            
        </HomepageInfo>
      </HomepageContainer>
    </>
  );
}
const swing = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const swingWithDelay = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
`;
const slideInLeftToRight = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0%);
  }
`;
const slideInRightToLeft = keyframes`
  from {
    transform: translateX(+100%);
  }
  to {
    transform: translateX(0%);
  }
`;

const FooterBar = styled.div`
  height: 50px;
  background-color: #f64a45;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px 30px 0px 0px;
  filter: drop-shadow(0px 1px 5px #000000);
  z-index: 99;
`;
const HomepageContainer = styled.div`
  width: 100%;
  height: auto;
  background-color: #f3d8b6;
  margin-bottom: 2%;

  @media screen and (max-width: 768px) {
    margin-bottom: 5%;
  }
`;

const HomepageBanner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 800px;
`;
const HomepageBannerText = styled.div`
  animation: ${slideInLeftToRight} 1s ease-in-out;
  margin-top: 10%;
  font-size: 35px;
  min-width: 35%;
  max-width: 60%;
  min-height: 200px;
  z-index: 99;
  text-align: center;
  padding: 20px;

  @media screen and (max-width: 768px) {
    font-size: 28px;
    margin-top: 10%;
    max-width: 90%;
    font-weight: 700;
  }

  @media screen and (min-width: 1280px) {
    margin-right: 40%;
    width: 50%;
  }
  @media screen and (min-width: 1750px) {
    background-color: #f3ec78;
    background-image: linear-gradient(45deg, #f3bc78, #f64a45);
    background-size: 100%;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
  }
`;
const HomepageInfo = styled.div`
  width: 100%;
  min-height: 700px;
  position: relative;
`;
const HomepageInfoContent = styled.div`
  width: 100%;
  gap: 10%;
  min-height: 700px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const HomepageInfoContentLoggedIn = styled.div`
  width: 100%;
  gap: 10%;
  min-height: 700px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
const HomepageInfoText = styled.div`
  font-size: 40px;
  min-width: 35%;
  max-width: 60%;
  min-height: 200px;
  z-index: 99;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;

  @media screen and (max-width: 1280px) {
    font-size: 18px;
  }
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;
const StyledLogo = styled(Image)`
  animation: ${swing} 2s ease-in-out, ${swingWithDelay} 4s linear infinite;
  margin-top: -5px;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: contain;
`;
const StyledImage = styled(Image)`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const StyledImageAnimated = styled(Image)`
  animation: fadeInUp 0.5s ease-in-out;
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
`;
