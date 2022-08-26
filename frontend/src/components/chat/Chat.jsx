import { useState } from "react";
import { Outlet } from "react-router-dom";

import useMediaQuery from "../../hooks/useMediaQuery";
import useEffectOnce from "./../../hooks/useEffectOnce";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ChatSideBar from "./ChatSideBar";

const Chat = () => {
  const [sidePanelVisible, setSidePanelVisible] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  const showSidePanel = (e) => {
    setSidePanelVisible(true);
  };
  const hideSidePanel = (e) => {
    setSidePanelVisible(false);
  };

  useEffectOnce(() => {
    if (isLargeScreen) setSidePanelVisible(true);
  }, [isLargeScreen]);

  return (
    <Row className="w-100">
      {(isLargeScreen || sidePanelVisible) && (
        <Col md={{ order: 1, span: 5 }} lg={4}>
          <ChatSideBar hideSidePanel={hideSidePanel} />
        </Col>
      )}
      {(isLargeScreen || !sidePanelVisible) && (
        <Col md={{ order: 2, span: 7 }} lg={8}>
          <Outlet context={{ showSidePanel }} />
        </Col>
      )}
    </Row>
  );
};

export default Chat;
