import React from "react";
import Header from "../common/Header";
import Container from "../common/Container";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useQueryClient } from "react-query";
import { removeTodo } from "../redux/slices/todosSlice"; // addRemoveSlice에서 removeTodo 액션을 가져옴
import axios from "axios";
export default function Detail() {
  //로그인한 이메일주소를 가져오기 위해 리덕스 상태를 가져온다.
  const userEmail = useSelector((state) => state.user.email);

  const dispatch = useDispatch();
  const queryClient = new useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery("posts", async () => {
    const response = await axios.get("http://localhost:4000/posts");
    return response.data;
  });
  // {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("posts");
  //   },
  if (isLoading) {
    return <div>데이터 가져오는 중임</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }

  const handleRemoveTodo = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        // 서버에서 해당 할일 데이터 삭제
        await axios.delete(`http://localhost:4000/posts/${id}`);
        // Redux store에서 해당 할일 제거
        dispatch(removeTodo(id));
        // 캐시된 데이터를 업데이트하여 화면에 변경 사항 반영
        queryClient.invalidateQueries("posts");
        navigate("/");
      } catch (error) {
        // 에러 처리
      }
    }
  };

  const findId = data.find((item) => item.id === id);

  if (!findId) {
    // id에 해당하는 할일이 없는 경우에 대한 처리
    return (
      <>
        <Header />
        <Container>
          <h2>해당 할일을 찾을 수 없습니다.</h2>
        </Container>
      </>
    );
  }

  console.log(id);
  return (
    <>
      <Header />

      <Container>
        <h1
          style={{
            border: "1px solid lightgray",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          {findId.title}
        </h1>
        <div
          style={{
            height: "400px",
            border: "1px solid lightgray",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          {findId.content}
        </div>
        {findId.author === userEmail ? (
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <button
              onClick={() => {
                navigate(`/edit/${findId.id}`);
              }}
              style={{
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: "orange",
                color: "white",
                cursor: "pointer",
                marginRight: "6px",
              }}
            >
              수정
            </button>
            <button
              onClick={() => {
                if (findId.author !== userEmail) {
                  alert("삭제 권한이 없습니다.");
                  return; //리턴으로 막아줌
                }
                handleRemoveTodo(findId.id); // 삭제 버튼을 누를 때 handleRemoveTodo 함수 호출
              }}
              style={{
                border: "none",
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: "red",
                color: "white",
                cursor: "pointer",
              }}
            >
              삭제
            </button>
          </div>
        ) : null}
      </Container>
    </>
  );
}
