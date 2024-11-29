import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import SideDrawer from "../components/miscellanious/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

function ChatPage() {
  const user = useSelector((state) => state.user);

  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default ChatPage;
