import React from "react";
import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/action-creators/actions';
import { useRouter } from "next/router";
import { destroyCookie } from 'nookies';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((userData:any) => userData.user.user);
  console.log("userData: ", userData);

  const handleLogout = () => {
    dispatch(logout());
    destroyCookie(null, 'authToken');
    router.push('/');
  };

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
          <Link href={"/events"}>
            <NavbarAnimatedLinks>My Events</NavbarAnimatedLinks>
          </Link>
          {userData.isLoggedIn ? (
            <NavbarBtn onClick={handleLogout}>Logout</NavbarBtn>
          ) : (
            <Link href={"/login"}>
              <NavbarBtn>Login/Register</NavbarBtn>
            </Link>
          )}
        </NavbarLinks>
      </NavbarStyle>
    </>
  );
};

const RedText = styled.text`
  color: #f64a45;
  font-size: 16px;
  margin-left: 5%;
`;

const NavbarStyle = styled.nav`
  padding-left: 10%;
  padding-right: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 10%;
  background-color: #f3d8b6;
  filter: drop-shadow(0px 1px 5px #000000);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const NavbarLinks = styled.div`
  min-width: 320px;
  display: flex;
  justify-content: space-around;
  gap: 10%;
  color: #f64a45;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    padding: 10px;
    gap: 10px;
  }
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
