import { useSelector, useDispatch } from "react-redux";
import { setSelectedChat } from "../store/Chat";
import { setNotification } from "../store/Notification.js";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic.js";
import ProfileModal from "./miscellanious/ProfileModal.jsx";
import UpdateGroupChatModal from "./miscellanious/UpdateGroupChatModal.jsx";
import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import ScrollableChat from "./ScrollableChat.jsx";
import io from "socket.io-client";
import { useRef } from "react";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChats);
  const notification = useSelector((state) => state.notification);
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const timeOutRef = useRef();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    setLoading(() => true);
    try {
      const response = await fetch(`/api/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessages(() => data);
      setLoading(() => false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Message",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [selectedChat, toast, user.token]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(() => true));
    socket.on("typing", () => setIsTyping(() => true));
    socket.on("stop typing", () => setIsTyping(() => false));
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          dispatch(setNotification([...notification, newMessageRecieved]));
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    });
    return () => {
      socket.off("message recieved");
    };
  });

  async function sendMessage(event) {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      event.preventDefault();
      try {
        setNewMessage(() => "");
        const response = await fetch("/api/message", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedChat._id,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        setMessages((prev) => [...prev, data]);
        socket.emit("new message", data);
      } catch (err) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  function typingHandler(e) {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(() => true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }

    timeOutRef.current = setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(() => false);
      }
    }, timerLength);
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => dispatch(setSelectedChat(false))}
            />
            {!selectedChat.isGroup ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatname.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {<ScrollableChat messages={messages} />}
              </div>
            )}
          </Box>
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message..."
              onChange={typingHandler}
              value={newMessage}
            />
          </FormControl>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
