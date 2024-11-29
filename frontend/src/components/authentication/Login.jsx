import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/User.js";

function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function submitHandler() {
    setLoading(true);
    if (!password || !email) {
      toast({
        title: "Empty fields.",
        description: "Please fill all fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      toast({
        title: "Login Successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      dispatch(setUser(data));
      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      return navigate("/chats");
    } catch (err) {
      // console.log(err);
      toast({
        title: "Error occured!",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail((prev) => "guest@example.com");
          setPassword(() => "123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
}

export default Login;
