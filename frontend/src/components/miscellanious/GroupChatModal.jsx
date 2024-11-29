import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { setChats } from "../../store/Chat";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chat.chats);

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

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

  async function handleSubmit() {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const response = await fetch("/api/chat/group", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      dispatch(setChats([data, ...chats]));
      onClose();
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      toast({
        title: "Failed to Create the Chat!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  function handleGroup(userToAdd) {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  function handleDelete(delUser) {
    setSelectedUsers((prev) => prev.filter((ele) => ele._id !== delUser._id));
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg:Adeeb, John, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((ele) => (
                <UserBadgeItem
                  key={ele._id}
                  user={ele}
                  handleFunction={() => handleDelete(ele)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((ele) => (
                  <UserListItem
                    key={ele._id}
                    user={ele}
                    handleFunction={() => handleGroup(ele)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
