import React, { useState } from "react";
import styled from "styled-components";
import LoginRegisterComp from "@/components/LoginRegisterComp";
import Image from "next/image";


const LoginRegister = () => {

  return (
    <>
    
    <PageContainer>
      <TopBar>
          <Image
            src="/assets/LOGOPNGBEIJE.png"
            alt="gathr logo"
            width={80}
            height={35}
          ></Image>
        </TopBar>
        <StyledImage 
        src="/assets/5.jpg"
            alt="celebration"
            width={1000}
            height={600}
            >
        </StyledImage>
            <LoginRegisterContainer>
              <LoginText>Log in, Sign up, and start inviting your friends!</LoginText>
    <LoginRegisterComp />
    </LoginRegisterContainer>
    </PageContainer>
    </>
  );
};
const LoginText = styled.h2`
 margin-right: 30px;
 font-size: 45px;
 text-align: center;
 color:white;

  @media screen and (max-width: 1280px) {
    margin-right: 0px;
 font-size: 45px;
    flex-direction: column;
    width: 80%;
  }

`;

const TopBar = styled.div`
  height: 50px;
  width: 100%;
  margin-top: 10%;
  background-color: #f64a45;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 30px 30px 0px 0px;
  filter: drop-shadow(0px 1px 1px #000000);
`;

const StyledImage = styled(Image)`
width: 100vw;
  height: 800px;
  object-fit: cover;
  margin-top: -10px;
`;

const PageContainer = styled.div`
margin-top: -9%;
background-color: #f3d8b6;
width: 100%;
height: auto;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 10px;
color: #f3d8b6;
overflow: hidden;
`;

const LoginRegisterContainer = styled.div`
margin-top: 12%;
display: flex;
justify-content: space-around;
align-items: center;
width: 50%;
position: absolute;
z-index:99;
gap: 10px;
h1 {
  color:white;
  font-size: 50px;
  text-align: center;
}

@media screen and (max-width: 1280px) {
    flex-direction: column;
    width: 80%;
  }

`;

export default LoginRegister;