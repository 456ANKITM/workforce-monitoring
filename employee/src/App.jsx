import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";

import { useGetMeQuery } from "./redux/api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/slices/userSlice";
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
      dispatch(setUser(user));
    }
  }, [user, dispatch]);

  // 🔥 SAME SOCKET LOGIC AS ADMIN
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
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
};

export default App;