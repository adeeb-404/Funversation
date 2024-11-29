import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChats, setSelectedChat } from "../store/Chat";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogic";
import GroupChatModal from "./miscellanious/GroupChatModal";

function MyChats({ fetchAgain }) {
  const toast = useToast();
  const dispatch = useDispatch();

  const [loggedUser, setLoggedUser] = useState(false);
  const user = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chat.chats);
  const selectedChat = useSelector((state) => state.chat.selectedChats);

  const fetchChats = useCallback(
    async function fetchChats() {
      try {
        const response = await fetch("/api/chat", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        dispatch(setChats(data));
      } catch (err) {
        toast({
          title: "Error occured!",
          description: "Failed to load the chats",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    },
    [toast, user.token, dispatch]
  );

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchChats, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "23px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "12px", md: "17px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() =>
                  selectedChat === chat
                    ? dispatch(setSelectedChat(false))
                    : dispatch(setSelectedChat(chat))
                }
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroup
                    ? getSender(loggedUser, chat.users)
                    : chat.chatname}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;

// 11-> 4:18
