import { useEffect } from "react";

import { useChatsContext } from "../../context/ChatsContext";
import useAxiosFunction from "../../hooks/axios/useAxiosFunction";
import useAxiosPrivate from "../../hooks/axios/useAxiosPrivate";

import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";

const UploadedFile = ({ file }) => {
  const axios = useAxiosPrivate();

  const { setFiles } = useChatsContext();
  const [response, error, loading, axiosFetch] = useAxiosFunction();

  const deleteFile = (e) => {
    axiosFetch({
      axiosInstance: axios,
      method: "delete",
      url: `/chat/api/attachments/${file.id}/`,
    });
  };

  useEffect(() => {
    if (response !== null || error?.response?.status === 405) {
      setFiles((prev) =>
        prev.filter((uploadedFfile) => uploadedFfile.id !== file.id)
      );
    }
  }, [response, error]);

  return (
    <Card bg="dark" className="file-thumbnail bg-light-black py-2 pl-2 pr-4">
      <a href={file.file_url} className="text-nowrap mr-4">
        {file.name}
      </a>
      <CloseButton
        variant="white"
        className="btn-close ml-1"
        onClick={deleteFile}
        disabled={loading}
      />
    </Card>
  );
};

export default UploadedFile;
