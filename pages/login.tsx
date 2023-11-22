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
        src="/assets/2.jpg"
            alt="celebration"
            width={1000}
            height={600}
            >
        </StyledImage>
            <LoginRegisterContainer>
              <h1>Log in, Sign up, and start inviting your friends!</h1>
    <LoginRegisterComp></LoginRegisterComp>
    </LoginRegisterContainer>
    </PageContainer>
    </>
  );
};

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
margin-bottom: -3%;
`;

const LoginRegisterContainer = styled.div`
margin-top: 12%;
display: flex;
gap: 10%;
justify-content: space-around;
align-items: center;
width: 50%;
position: absolute;
z-index:99;
h1 {
  color:white;
  font-size: 50px;
  text-align: center;
}
`;

export default LoginRegister;