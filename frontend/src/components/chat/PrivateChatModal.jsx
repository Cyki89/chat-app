import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import useAxiosPrivate from "../../hooks/axios/useAxiosPrivate";
import useAxiosFunction from "../../hooks/axios/useAxiosFunction";

import Select from "../forms/Select";
import ServerErrors from "../forms/ServerErrors";
import SubmitButton from "../forms/SubmitButton";

const PrivateChatModal = ({ user, setLocalChats }, ref) => {
  const [show, setShow] = useState(false);
  const [memberId, setMemberId] = useState(0);

  const navigate = useNavigate();
  const [options, setOptions] = useState(() => [
    { id: 1, username: "user1" },
    { id: 2, username: "user2" },
    { id: 3, username: "user3" },
    { id: 4, username: "user4" },
    { id: 5, username: "user5" },
  ]);

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
        participants: [user.id, memberId],
      },
    });
  };

  useEffect(() => {
    if (!response) return;

    setLocalChats((prev) => [response, ...prev]);
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
            title="Select Useer"
            value={memberId}
            setValue={(e) => {
              setMemberId(e.target.value);
            }}
            options={options}
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
