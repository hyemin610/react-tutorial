import React from "react";
import Header from "../common/Header";
import Container from "../common/Container";
import { auth } from "../firebase";
import { setUser } from "../redux/slices/userSlice";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function Signup({ inputs, setInputs }) {
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
  const signUp = async (event) => {
    event.preventDefault();

    // 회원가입 유효성 검사
    // 비밀번호가 6자리 이상인지 확인
    if (inputs.password.length < 6) {
      alert("비밀번호는 6자리 이상이어야 합니다.");
      return;
    }
    // 이메일 창이 비어있는지 확인
    if (!inputs.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    // 비밀번호, 비밀번호 창 둘다 채워져 있는지 확인
    if (!inputs.password || !inputs.PasswordConfirm) {
      alert("비밀번호와 비밀번호 확인을 모두 입력해주세요.");
      return;
    }
    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (inputs.password !== inputs.PasswordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password
      );
      console.log("user", userCredential.user);
      // 회원가입 완료 시 이메일을 리듀서에 저장
      dispatch(setUser(inputs.email));
      alert("회원가입되었습니다.");
      navigate("/");
    } catch (error) {
      // 참고 문서: https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#error-codes_3
      if (error.code === "auth/email-already-in-use") {
        return alert("이미 존재하는 이메일입니다.");
      }

      if (error.code === "auth/invalid-email") {
        return alert("이메일 형식이 적절하지 않습니다.");
      }

      if (error.code === "auth/weak-password") {
        return alert("비밀번호는 최소 6자리 이상이어야 합니다.");
      }

      if (error.code === "auth/operation-not-allowed") {
        return alert("휴면 계정입니다. 관리자에게 문의하세요.");
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
                value={inputs.email}
                name="email"
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
              <input
                placeholder="비밀번호 확인"
                value={inputs.PasswordConfirm}
                name="PasswordConfirm"
                onChange={changeHandler}
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
                onClick={signUp}
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
                회원가입하기
              </button>
            </div>
            <div
              style={{
                width: "360px",
              }}
            >
              <button
                onClick={signUp}
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
                로그인하러 가기
              </button>
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}
