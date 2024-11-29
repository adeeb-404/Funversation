/* eslint-disable no-unused-vars */
import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { setChats, setSelectedChat } from "../../store/Chat";
import { setNotification } from "../../store/Notification.js";
import { getSender } from "../../config/ChatLogic.js";

function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notification = useSelector((state) => state.notification);
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const navigator = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chat.chats);

  function handleClick() {
    localStorage.removeItem("userInfo");
    return navigator("/");
  }

  async function handleSearch() {
    if (!search) {
      toast({
        title: "Please enter something in search.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading((prev) => true);

      const response = await fetch(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      setLoading((prev) => false);
      setSearchResult((prev) => data);
    } catch (err) {
      toast({
        title: "Error occured!",
        description: "Failed to load search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  async function accessChat(userId) {
    setLoadingChat(true);
    try {
      const response = await fetch("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      if (!chats.find((c) => c._id === data._id))
        dispatch(setChats([data, ...chats]));
      dispatch(setSelectedChat(data));
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={{ base: "md", md: "xl" }} fontFamily="Work sans">
          Funversation
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <Box position="relative" display="inline-block">
                <IconButton
                  icon={<BellIcon />}
                  fontSize="24px"
                  variant="outline"
                  aria-label="Notifications"
                />
                {notification.length === 0 ? (
                  ""
                ) : (
                  <Badge
                    position="absolute"
                    bottom="0"
                    left="0"
                    transform="translate(-50%, 50%)"
                    colorScheme="red"
                    borderRadius="full"
                    px={2}
                    py={1}
                  >
                    {notification.length}
                  </Badge>
                )}
              </Box>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new Messages"}
              {notification.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    dispatch(setSelectedChat(noti.chat));
                    dispatch(
                      setNotification(notification.filter((n) => n !== noti))
                    );
                  }}
                >
                  {noti.chat.isGroup
                    ? `New message in ${noti.chat.chatname}`
                    : `New message from ${getSender(user, noti.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleClick}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch((prev) => e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((ele) => (
                <UserListItem
                  key={ele._id}
                  user={ele}
                  handleFunction={() => accessChat(ele._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
