import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Main from "./pages/Main";
import CreateEmployee from "./pages/CreateEmployee";

import { useGetMeQuery } from "./redux/api/authApi";
import { useDispatch } from "react-redux";
import { setAdmin } from "./redux/slices/userSlice";
import { useEffect } from "react";

import { initSocket, connectSocket, disconnectSocket } from "./socketClient";

const App = () => {
  const dispatch = useDispatch();

  const { data } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const user = data?.user;

  useEffect(() => {
    if (user) {
      dispatch(setAdmin(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = initSocket();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    connectSocket();

    return () => {
      socket.off("connect");
      disconnectSocket();
    };
  }, [user?._id]);

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/create-employee" element={<CreateEmployee />} />
    </Routes>
  );
};

export default App;