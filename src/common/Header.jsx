import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { unsetUser } from "../redux/slices/userSlice";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.user.email);

  const LogOut = async (e) => {
    e.preventDefault();
    await signOut(auth); // email을 null로 만들어줌
    dispatch(unsetUser());
  };

  return (
    <header
      style={{
        height: "100px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px 0 24px",
      }}
    >
      <h1
        style={{
          color: "gray",
          cursor: "pointer",
        }}
      >
        <FaHome onClick={() => navigate("/")} />
      </h1>
      {userEmail !== null ? (
        <div style={{ display: "flex" }}>
          <div>{userEmail}님</div>
          <button
            onClick={LogOut}
            style={{
              border: "none",
              padding: "5px",
              borderRadius: "3px",
              backgroundColor: "rgb(202, 209, 252)",
              color: "white",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            로그아웃하기
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      )}
    </header>
  );
}
