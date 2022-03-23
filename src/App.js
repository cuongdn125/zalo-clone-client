import { PublicRoute } from "components/PublicRouter";
import SlickIntroduce from "components/SlickIntroduce";
import LoginPage from "features/auth/login/LoginPage";
import RegisterPage from "features/auth/register/RegisterPage";
import Chat from "features/home/components/Chat";
import ContactSideBar from "features/home/components/Contact/ContactSideBar";
import ListFriend from "features/home/components/Contact/ListFriend";
import ListGroup from "features/home/components/Contact/ListGroup";
import ContentList from "features/home/components/ContentList";
import HomePage from "features/home/HomePage";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

// init();

function App() {
  //
  return (
    <Routes>
      {/* <PublicRoute> */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      {
        <Route path="/" element={<HomePage />}>
          <Route path="chats" element={<ContentList />}>
            <Route path=":chatId" element={<Chat />} />
            <Route index element={<SlickIntroduce />} />
          </Route>
          <Route path="contacts" element={<ContactSideBar />}>
            <Route path="list-add-friend" element={<ListFriend />} />
            <Route path="list-group" element={<ListGroup />} />
          </Route>
        </Route>
      }
    </Routes>
  );
}

export default App;
