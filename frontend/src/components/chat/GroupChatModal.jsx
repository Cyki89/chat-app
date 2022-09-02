import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useChatsContext } from "../../context/ChatsContext";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import useAxiosPrivate from "../../hooks/axios/useAxiosPrivate";
import useAxiosFunction from "../../hooks/axios/useAxiosFunction";

import Input from "../forms/Input";
import MultiSelect from "../forms/MultiSelect";
import ServerErrors from "../forms/ServerErrors";
import SubmitButton from "../forms/SubmitButton";

const GroupChatModal = ({}, ref) => {
  const { user } = useAuth();
  const { setLocalChats, chatUsers } = useChatsContext();

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [participants, setParticipants] = useState();

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const [response, error, loading, axiosFetch] = useAxiosFunction();

  useImperativeHandle(ref, () => ({
    openModal: () => setShow(true),
  }));

  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosFetch({
      axiosInstance: axiosPrivate,
      method: "POST",
      url: "/chat/api/",
      requestConfig: {
        name: name,
        is_group_chat: true,
        participants: [user.id, ...participants],
      },
    });
  };

  useEffect(() => {
    if (!response) return;
    setLocalChats((prev) => [response, ...prev]);
    setShow(false);
    navigate(`/chat/${response.uuid}`);
  }, [response]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="bg-light-black">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="fg-white">New Conversation</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="fs-11">
          <Input
            title={"Group Chat title"}
            value={name}
            error={error?.response?.data.name}
            setValue={(e) => setName(e.target.value)}
            placeholder={"Chat Name"}
          />
          <MultiSelect
            title="Add User"
            setValue={setParticipants}
            options={chatUsers}
            optionName="username"
            error={error.response?.data?.participants}
          />
          <ServerErrors error={error} />
        </Modal.Body>
        <Modal.Footer>
          <SubmitButton title="Add" loading={loading} disabled={loading} />
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default forwardRef(GroupChatModal);
