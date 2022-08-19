import Form from "../forms/Form";
import useSelectRoom from "../../hooks/chat/useSelectRoom";

const INPUTS = [
  {
    title: "Room Name",
    name: "roomName",
  },
];

const SelectChatRoom = () => {
  return (
    <Form
      useFunc={useSelectRoom}
      formData={{ roomName: "" }}
      formTitle={"Select Room"}
      submitBtnTitle={"Join"}
      inputs={INPUTS}
    />
  );
};

export default SelectChatRoom;
