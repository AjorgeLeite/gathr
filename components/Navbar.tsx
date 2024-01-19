import React, { useState, useEffect } from "react";
import Image from "next/image";
import styled, { css, keyframes } from "styled-components";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/action-creators/actions";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";

interface NavbarStyleProps extends React.HTMLAttributes<HTMLDivElement> {
  $mobileMenuOpen?: boolean;
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((userData: any) => userData.user.user);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    destroyCookie(null, "authToken");
    router.push("/");
  };

  const navigateTo = (path: string) => {
    router.push(path);
    closeMobileMenu();
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <NavbarStyle $mobileMenuOpen={mobileMenuOpen}>
        <LogoContainer>
          <Link href={"/"}>
            <StyledImage
              src="/assets/LOGOPNG.png"
              alt="gathr logo"
              width={150}
              height={80}
            />
          </Link>

          <MobileMenuButton onClick={toggleMobileMenu}>
            <BurgerIcon
              src="/assets/burgericon.gif"
              alt="gathr logo"
              width={50}
              height={30}
            />
          </MobileMenuButton>
        </LogoContainer>

        <NavbarLinks>
          <Link href={"/about"}>
            <NavbarAnimatedLinks>About Us</NavbarAnimatedLinks>
          </Link>
          
          {userData.isLoggedIn ? (
          <>
            <Link href={"/events"}>
            <NavbarAnimatedLinks>My Events</NavbarAnimatedLinks>
          </Link>
          <NavbarBtn onClick={handleLogout}>Logout</NavbarBtn>
          </>
          ) : (
            <Link href={"/login"}>
              <NavbarBtn>Login/Register</NavbarBtn>
            </Link>
          )}
          
        </NavbarLinks>

        {mobileMenuOpen && (
          <MobileMenu>
            <div>
              <NavbarAnimatedLinks onClick={() => navigateTo("/about")}>
                About Us
              </NavbarAnimatedLinks>
              <NavbarAnimatedLinks onClick={() => navigateTo("/events")}>
                My Events
              </NavbarAnimatedLinks>
              {userData.isLoggedIn ? (
                <NavbarAnimatedLinks onClick={handleLogout}>
                  Logout
                </NavbarAnimatedLinks>
              ) : (
                <NavbarBtn onClick={() => navigateTo("/login")}>
                  Login/Register
                </NavbarBtn>
              )}
            </div>
          </MobileMenu>
        )}
      </NavbarStyle>
    </>
  );
};

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    justify-content: space-around;
  }
`;

const NavbarStyle: React.FC<NavbarStyleProps> = styled.nav<NavbarStyleProps>`
  position: relative;
  padding-left: 10%;
  padding-right: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #f3d8b6;
  filter: drop-shadow(0px 1px 5px #000000);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  ${(props) =>
    props.$mobileMenuOpen &&
    css`
      @media (max-width: 768px) {
        height: auto;
      }
    `}
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
    display: none;
  }
`;
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
    transform: rotate(3deg);
  }
  50% {
    transform: rotate(-3deg);
  }
`;
const StyledImage = styled(Image)`
  width: 150px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${swing} 2s ease-in-out, ${swingWithDelay} 4s linear infinite;
`;
const BurgerIcon = styled(Image)`
  width: 40px;
  height: 25px;
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

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const MobileMenuButton = styled.div`
  display: none;
  cursor: pointer;
  width: 30px;
  height: 20px;
  flex-direction: column;
  div {
    width: 100%;
    height: 3px;
    background-color: #f64a45;
    margin: 3px 0;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  width: 100%;
  background-color: #f3d8b6;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 100;
  overflow: hidden;
  text-align: center;
  color: #f64a45;
  padding: 10px;
`;

export default Navbar;
