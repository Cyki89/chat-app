import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { useAuth } from "../../context/AuthContext";
import { useChatsContext } from "../../context/ChatsContext";

import useAxiosPrivate from "../../hooks/axios/useAxiosPrivate";
import useAxiosFunction from "../../hooks/axios/useAxiosFunction";

import Select from "../forms/Select";
import ServerErrors from "../forms/ServerErrors";
import SubmitButton from "../forms/SubmitButton";

const PrivateChatModal = ({}, ref) => {
  const { user } = useAuth();
  const { localChats, setLocalChats, chatUsers } = useChatsContext();

  const [show, setShow] = useState(false);
  const [memberId, setMemberId] = useState(0);

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const [response, error, loading, axiosFetch] = useAxiosFunction();

  useImperativeHandle(ref, () => ({
    openModal: () => setShow(true),
  }));

  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    if (memberId === 0) return;

    e.preventDefault();
    axiosFetch({
      axiosInstance: axiosPrivate,
      method: "POST",
      url: "/chat/api/",
      requestConfig: {
        is_group_chat: false,
        participants: [user.id, memberId],
      },
    });
  };

  useEffect(() => {
    if (!response) return;

    if (localChats.every((chat) => chat.uuid !== response.uuid)) {
      setLocalChats((prev) => [response, ...prev]);
    }
    setMemberId(0);
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
          <Select
            title="Select User"
            value={memberId}
            setValue={(e) => {
              setMemberId(e.target.value);
            }}
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

export default forwardRef(PrivateChatModal);
