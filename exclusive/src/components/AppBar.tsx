import React, { FunctionComponent } from "react";
import { useState } from "react";
import { AppBar as W95AppBar, Toolbar, Button, List, ListItem } from "react95";

interface Props {
  onConnect: () => void;
}

export const AppBar: FunctionComponent<Props> = ({ onConnect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = () => {
    setIsOpen(false);
    onConnect();
  };

  return (
    <W95AppBar>
      <Toolbar>
        <Button
          variant="menu"
          active={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          File
        </Button>
        {isOpen && (
          <List
            style={{
              position: "absolute",
              left: "0",
              top: "100%",
            }}
          >
            <ListItem onClick={handleConnect}>Connect</ListItem>
          </List>
        )}
      </Toolbar>
    </W95AppBar>
  );
};
