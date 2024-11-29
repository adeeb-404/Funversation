//fixes:
// 1.If admin leaves group none can add...
// 2.Notificatoin from same person should show once

//features
// notification must store offline too

import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import { secureRouteLoader, homePageLoader } from "./Loaders.js";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    loader: homePageLoader,
  },
  { path: "/chats", element: <ChatPage />, loader: secureRouteLoader },
]);

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ChakraProvider>
  );
}

export default App;
