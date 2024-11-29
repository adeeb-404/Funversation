import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { setSelectedChat } from "../../store/Chat";
import { useState } from "react";
import UserListItem from "../UserAvatar/UserListItem";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const dispatch = useDispatch();
  const toast = useToast();

  const user = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChats);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleRemove(u) {
    if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/chat/groupRemove", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: u._id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      u._id === user._id
        ? dispatch(setSelectedChat())
        : dispatch(setSelectedChat(data));
      setFetchAgain(() => !fetchAgain);
      fetchMessages();
      setLoading((prev) => false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(() => false);
    }
  }
  async function handleAddUser(u) {
    if (selectedChat.users.find((ele) => ele._id === u._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/chat/groupAdd", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          chatId: selectedChat._id,
          userId: u._id,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      dispatch(setSelectedChat(data));
      setFetchAgain(() => !fetchAgain);
      setLoading((prev) => false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(() => false);
    }
  }

  async function handleRename() {
    if (!groupChatName) {
      toast({
        title: "Please enter new Group name!",
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      return;
    }
    try {
      setRenameLoading(true);
      const response = await fetch("/api/chat/rename", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          chatId: selectedChat._id,
          chatName: groupChatName,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      dispatch(setSelectedChat(data));
      setFetchAgain((prev) => !fetchAgain);
      setRenameLoading((prev) => false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading((prev) => false);
    }
    setGroupChatName("");
  }

  async function handleSearch(query) {
    setSearch((prev) => query);
    if (!query) return;
    try {
      setLoading((prev) => true);
      const response = await fetch(`/api/user?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      console.log(data);
      setLoading((prev) => false);
      setSearchResult((prev) => data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatname}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((ele) => (
                <UserBadgeItem
                  key={ele._id}
                  user={ele}
                  handleFunction={() => handleRemove(ele)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName((prev) => e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult.map((ele) => (
                <UserListItem
                  key={ele._id}
                  user={ele}
                  handleFunction={() => handleAddUser(ele)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
