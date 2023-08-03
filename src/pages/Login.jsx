import React from "react";
import Header from "../common/Header";
import Container from "../common/Container";
import { auth } from "../firebase";
import { setUser } from "../redux/slices/userSlice";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Login({ inputs, setInputs }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const changeHandler = (e) => {
    // input에 name 속성 꼭 넣어주세요. (모르겠으면 검색 혹은 질문하기)
    const { name, value } = e.target;
    setInputs((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const logIn = async (event) => {
    event.preventDefault();
    // 이메일 칸이 비어있을 때
    if (!inputs.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    // 비밀번호 칸이 비어있을 때
    if (!inputs.password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, inputs.email, inputs.password);

      dispatch(setUser(inputs.email)); //로그인시 사용자 이메일을 리듀서에 저장
      alert("로그인되었습니다.");
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error with signIn", errorCode, errorMessage);
      // 로그인 성공 후 필요한 작업 수행

      // 로그인 실패 시 에러 처리
      if (errorCode === "auth/invalid-email") {
        alert("적절한 이메일 형식이 아닙니다.");
      } else if (errorCode === "auth/wrong-password") {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (errorCode === "auth/user-not-found") {
        alert("존재하지 않는 계정입니다.");
      } else if (errorCode === "auth/user-disabled") {
        alert("휴면계정입니다. 관리자에게 문의하세요");
      }
      return alert("알 수 없는 에러입니다. 나중에 다시 시도해보세요.");
    }
    setInputs({
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Header />
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "600px",
            alignItems: "center",
          }}
        >
          <form>
            <div
              style={{
                width: "360px",
                marginBottom: "12px",
              }}
            >
              <input
                placeholder="이메일"
                type="email"
                name="email"
                value={inputs.email}
                onChange={changeHandler}
                required
                style={{
                  width: "100%",
                  height: "40px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid lightgrey",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div
              style={{
                width: "360px",
                marginBottom: "12px",
              }}
            >
              <input
                placeholder="비밀번호"
                type="password"
                value={inputs.password}
                name="password"
                onChange={changeHandler}
                required
                style={{
                  width: "100%",
                  height: "40px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid lightgrey",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div
              style={{
                width: "360px",
                marginBottom: "12px",
              }}
            >
              <button
                onClick={logIn}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  backgroundColor: "#78C1F3",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                로그인하기
              </button>
            </div>
            <div
              style={{
                width: "360px",
              }}
            >
              <div />

              <button
                onClick={() => {
                  navigate("/signup");
                }}
                style={{
                  width: "100%",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  backgroundColor: "#FF6969",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                회원가입하러 가기
              </button>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}
