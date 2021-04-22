import React from "react";
import SidePanel from "./SidePanel/SidePanel";
import MainPanel from "./MainPanel/MainPanel";
import { useSelector } from "react-redux";

function ChatPage() {
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "300px" }}>
        <SidePanel />
      </div>
      <div style={{ width: "100%" }}>
        {/* key값을 줘야 firebase에서 줌 (이유는 모름) */}
        <MainPanel key={currentChatRoom && currentChatRoom.id} />
      </div>
    </div>
  );
}

export default ChatPage;
