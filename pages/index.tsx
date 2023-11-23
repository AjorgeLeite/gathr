import Image from "next/image";
import styled from "styled-components";
import LoginRegisterComp from "@/components/LoginRegisterComp";

export default function Home() {
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
              Plan and decide together! gathr lets you effortlessly create
              events with friends. Vote on activities and make every moment
              unforgettable. Start now!
            </p>
          </HomepageBannerText>
        </HomepageBanner>
        <HomepageInfo>
          <FooterBar>
            <Image
              src="/assets/LOGOPNGBEIJE.png"
              alt="gathr logo"
              width={80}
              height={35}
            ></Image>
          </FooterBar>
          <StyledImage
            src={"/assets/1.jpg"}
            alt={"gathr logo"}
            width={1000}
            height={600}
          ></StyledImage>
          <HomepageInfoContent>
          <HomepageInfoText>
            <h1>Log in, Sign up, and start inviting your friends!</h1>
          </HomepageInfoText>
          <LoginRegisterComp></LoginRegisterComp>
          </HomepageInfoContent>
        </HomepageInfo>
      </HomepageContainer>
    </>
  );
}
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
`;

const HomepageBanner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
min-height: 800px;
`;
const HomepageBannerText = styled.div`

margin-top: 5%;
  font-size: 40px;
  min-width: 35%;
  max-width: 60%;
  min-height: 200px;
  z-index: 99;
  text-align: center;
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
`;
const StyledLogo = styled(Image)`
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
