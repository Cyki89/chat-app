import { useRef, useEffect } from "react";

import { useChatsContext } from "../../context/ChatsContext";
import useAxiosFunction from "../../hooks/axios/useAxiosFunction";
import useAxiosPrivate from "../../hooks/axios/useAxiosPrivate";
import useEventListener from "../../hooks/useEventListener";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

import Input from "../forms/Input";
import UploadedFile from "./UploadedFile";

const FilesUploadContainer = () => {
  const { files, setFiles } = useChatsContext();

  const orginalInputRef = useRef();
  const btnUploadRef = useRef();
  useEventListener(
    "click",
    (e) => {
      orginalInputRef.current.click();
    },
    btnUploadRef.current
  );

  const axios = useAxiosPrivate();
  const [response, error, loading, axiosFetch] = useAxiosFunction();
  const uploadFile = (e) => {
    axiosFetch({
      axiosInstance: axios,
      method: "post",
      url: "/chat/api/attachments/",
      requestConfig: { files: e.target.files[0] },
      requestExtraConfig: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    });
  };

  useEffect(() => {
    if (!response) return;

    setFiles((prev) => [...prev, response]);
  }, [response]);

  return (
    <>
      <Input
        title=""
        type={"file"}
        onInput={uploadFile}
        style={{
          width: "100%",
          paddingInline: "1em",
          display: "none",
        }}
        ref={orginalInputRef}
      />
      <Stack
        direction="horizontal"
        className="mt-2 file-upload-container mb-0"
        gap={0}>
        <div className="w-100">
          {files.map((file) => (
            <UploadedFile key={file.id} file={file} />
          ))}
        </div>
        <Button className="btn-chat" ref={btnUploadRef}>
          +
        </Button>
      </Stack>
    </>
  );
};

export default FilesUploadContainer;
