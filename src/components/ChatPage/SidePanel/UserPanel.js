import React, { useRef } from "react";
import { IoIosChatboxes } from "react-icons/io";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../../firebase";
import mime from "mime-types"; // THe ultimate javascript content-type utility(확장자 추출 모듈)
import { setPhotoURL } from "../../../redux/actions/user_action";

function UserPanel() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const inputOpenImageRef = useRef();

  const handleLogout = () => {
    firebase.auth().signOut(); // logOut 함수
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click(); // Upload Panel 사용
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];

    // 방법 1. metadata = file.type
    // metadata = {contentType: "image/png"}
    const metadata = { contentType: mime.lookup(file.name) };

    try {
      //스토리지에 파일 저장하기
      let uploadTaskSnapshot = await firebase
        .storage()
        .ref()
        .child(`user_image/${user.uid}`) // user_image라는 폴더 안에 user.uid로 저장
        .put(file, metadata);

      let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

      // 프로필 이미지 수정
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL,
      });

      dispatch(setPhotoURL(downloadURL)); // redux store에 있는 photoURL 수정

      //데이터베이스 유저 이미지 수정
      await firebase
        .database()
        .ref("users")
        .child(user.uid)
        .update({ image: downloadURL });

      //   console.log("uploadTaskSnapshot", uploadTaskSnapshot);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      {/* Logo */}
      <h3 style={{ color: "white" }}>
        <IoIosChatboxes /> Chat App
      </h3>

      <div style={{ display: "flex", marginBottom: "1rem" }}>
        {/* Image */}
        <Image
          src={user && user.photoURL}
          style={{ width: "30p", height: "30px", marginTop: "3px" }}
          roundedCircle
        />

        {/* Dropdown Button */}
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: "transparent", border: "0px" }}
            id="dropdown-basic"
          >
            {user && user.displayName}
          </Dropdown.Toggle>

          {/* Dropdown Item */}
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <input // Upload Panel
        onChange={handleUploadImage}
        accept="image/jpeg, image/png, image/jpg" // 확장자
        style={{ display: "none" }}
        ref={inputOpenImageRef} // 디자인을 새로 설정하기위해 ref사용
        type="file"
      />
    </div>
  );
}

export default UserPanel;
