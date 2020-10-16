import React from "react";
import { Content } from "./components/Content";
import { Loading } from "./components/Loading";
import { Queue } from "./components/Queue";
import { AppBar } from "./components/AppBar";
import { Bye } from "./components/Bye";
import { useSocket } from "./hooks/useSocket";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import {
  styleReset,
  Window,
  Panel,
  Toolbar,
  WindowHeader,
  Button,
  WindowContent,
  Hourglass,
} from "react95";
import original from "react95/dist/themes/original";
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import { useState } from "react";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
  ${styleReset}
`;

const Wrapper = styled.div`
  min-height: 100vh;
  background: teal;
  .window-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: "";
      position: absolute;
      background: black;
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .window {
    width: 80vw;
    height: 80vh;
    position: absolute;
    left: 10vw;
    top: 10vh;
  }
  .footer {
    display: flex;
    width: calc(100% - 10px);
    position: absolute;
    bottom: 0.2rem;
    left: 5px;
    padding: 0.15rem 0.25rem;
  }
`;

export const App = () => {
  return (
    <div
      style={{
        minHeight: 600,
      }}
    >
      <GlobalStyles />
      <ThemeProvider theme={original}>
        <Wrapper>
          <Main />
        </Wrapper>
      </ThemeProvider>
    </div>
  );
};

const Main = () => {
  const [showWindow, setShowWindow] = useState(false);
  const [showScaryMessage, setShowScaryMessage] = useState(true);

  const handleConnection = () => {
    setShowWindow(true);
    setTimeout(() => {
      setShowScaryMessage(false);
    }, 5000);
  };

  const footerMessage = showScaryMessage ? (
    <>
      <Hourglass size={20} style={{ marginRight: "0.1rem" }} />
      <span>Transferring all your data...</span>
    </>
  ) : (
    "Upload complete"
  );

  const content = showWindow ? (
    <Window className="window">
      <WindowHeader className="window-header">
        <span>AmazingContent.exe</span>
        <Button onClick={() => setShowWindow(false)}>
          <span className="close-icon" />
        </Button>
      </WindowHeader>
      <Toolbar>
        <Button variant="menu" size="sm" disabled>
          File
        </Button>
        <Button variant="menu" size="sm" disabled>
          Edit
        </Button>
        <Button variant="menu" size="sm" disabled>
          Save
        </Button>
      </Toolbar>
      <WindowContent>
        <SiteContent />
      </WindowContent>
      <Panel variant="well" className="footer">
        {footerMessage}
      </Panel>
    </Window>
  ) : null;

  return (
    <>
      <AppBar onConnect={handleConnection} />
      {content}
    </>
  );
};

const SiteContent = () => {
  const { clientState } = useSocket();

  if (!clientState) {
    return <Loading />;
  }

  if (clientState.type === "queue") {
    return <Queue position={clientState.position} />;
  }

  if (clientState.type === "up") {
    return <Content />;
  }

  if (clientState.type === "bye") {
    return <Bye />;
  }

  return null;
};
