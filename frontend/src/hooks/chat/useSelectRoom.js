import { useNavigate } from "react-router-dom";

const useSelectRoom = () => {
  const navigate = useNavigate();

  const selectRoom = (data) => {
    navigate(`/chat/${data.roomName}`);
  };

  return [selectRoom, false, false];
};

export default useSelectRoom;
