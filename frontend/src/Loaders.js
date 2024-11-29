import { redirect } from "react-router-dom";

export function secureRouteLoader() {
  if (!localStorage.getItem("userInfo")) return redirect("/");
  return null;
}

export function homePageLoader() {
  if (localStorage.getItem("userInfo")) return redirect("/chats");
  return null;
}
