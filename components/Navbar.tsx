import React from "react";
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <NavbarStyle>
        <Link href={"/"}>
        <StyledImage
            src="/assets/LOGOPNG.png"
            alt="gathr logo"
            width={150}
            height={80}
          />
        </Link>
        <NavbarLinks>
          <Link href={"/about"}>
            <NavbarAnimatedLinks>About Us</NavbarAnimatedLinks>
          </Link>
          <Link href={"/events"}><NavbarAnimatedLinks>My Events</NavbarAnimatedLinks></Link>
          <Link href={""}>
            <NavbarBtn>Login/Register</NavbarBtn>
          </Link>
        </NavbarLinks>
      </NavbarStyle>
    </>
  );
};

const NavbarStyle = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 10%;
  width: 100%;
  background-color: #f3d8b6;
  filter: drop-shadow(0px 1px 5px #000000);
`;

const NavbarLinks = styled.div`
  min-width: 280px;
  display: flex;
  justify-content: space-around;
  gap: 5%;
  color: #f64a45;
  cursor: pointer;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(Image)`
  width: 150px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavbarBtn = styled.button`
  width: 100px;
  height: 35px;
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

const NavbarAnimatedLinks = styled.div`
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

export default Navbar;
