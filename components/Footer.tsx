import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <FooterStyle>
        <FooterBar>
          <Image
            src="/assets/LOGOPNGBEIJE.png"
            alt="gathr logo"
            width={80}
            height={35}
          ></Image>
        </FooterBar>
        <FooterLinks>
          <Link href={"/about"}>
            <FooterAnimatedLinks>About Us</FooterAnimatedLinks>
          </Link>
          <Link href={"/events"}>
            <FooterAnimatedLinks>My Events</FooterAnimatedLinks>
          </Link>
        </FooterLinks>
        <FooterInfo>
          <p>Copyright © 2021 Gathr</p>
          <p>All Rights Reserved</p>
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </FooterInfo>
      </FooterStyle>
    </>
  );
};

const FooterStyle = styled.footer`
  width: 100%;
  height: auto;
  background-color: #f3d8b6;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FooterBar = styled.div`
  height: 50px;
  background-color: #f64a45;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0px 0px 30px 30px;
  filter: drop-shadow(0px 1px 5px #000000);
`;
const FooterLinks = styled.div`
  margin-top: 8px;
  min-width: 280px;
  display: flex;
  justify-content: space-around;
  gap: 5%;
  color: #f64a45;
  cursor: pointer;
  justify-content: center;
  align-items: center;
`;
const FooterAnimatedLinks = styled.div`
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 1px;
    background-color: #f57265;
    transition: width 0.3s ease;
  }

  &::before {
    left: 0;
    bottom: 0;
  }

  &::after {
    right: 0;
    bottom: 0;
  }

  &:hover {
    letter-spacing: 0px;

    &::before,
    &::after {
      width: 50%;
    }
  }
`;
const FooterInfo = styled.div`
  display: flex;
  justify-content: space-around;
  color: black;
  margin-bottom: 10px;
`;
export default Footer;
