import React, { Fragment, useState } from "react";
import Header from "../common/Header";
import Container from "../common/Container";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editTodo } from "../redux/slices/todosSlice";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios";

export default function Edit() {
  const dispatch = useDispatch();
  const queryClient = new useQueryClient();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery("posts", async () => {
    const response = await axios.get("http://localhost:4000/posts");
    return response.data;
  });

  const findId = data.find((item) => item.id === id);

  const [editedTodo, setEditedTodo] = useState({
    title: findId ? findId.title : "",
    content: findId ? findId.content : "",
  });
  const mutation = useMutation(
    async () => {
      // 수정할 데이터 생성
      const updatedTodo = {
        ...findId,
        title: editedTodo.title,
        content: editedTodo.content,
      };
      // 백엔드 API 호출
      await axios.put(`http://localhost:4000/posts/${id}`, updatedTodo);
      return updatedTodo;
    },
    {
      onSuccess: (data) => {
        // 수정 완료 후, Redux store 업데이트 및 캐시된 데이터 업데이트
        dispatch(editTodo(data));
        queryClient.invalidateQueries("posts");
        navigate("/");
      },
    }
  );
  if (isLoading) {
    return <div>데이터 가져오는 중임</div>;
  }
  if (isError) {
    return <div>{error.message}</div>;
  }
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync();
    } catch (error) {
      // 에러 처리
    }
  };

  return (
    <Fragment>
      <Header />

      <Container>
        <form
          style={{
            height: "600px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
          onSubmit={submitHandler}
        >
          <div>
            <input
              value={editedTodo.title}
              onChange={(e) => {
                setEditedTodo({ ...editedTodo, title: e.target.value });
              }}
              style={{
                width: "100%",
                height: "60px",
                fontSize: "18px",
                borderRadius: "12px",
                border: "1px solid lightgrey",
                padding: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div
            style={{
              height: "400px",
            }}
          >
            <textarea
              value={editedTodo.content}
              onChange={(e) =>
                setEditedTodo({ ...editedTodo, content: e.target.value })
              }
              style={{
                resize: "none",
                height: "100%",
                width: "100%",
                fontSize: "18px",
                borderRadius: "12px",
                border: "1px solid lightgrey",
                padding: "12px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              height: "40px",
              border: "none",
              color: "white",
              borderRadius: "12px",
              backgroundColor: "orange",
              cursor: "pointer",
            }}
          >
            수정하기
          </button>
        </form>
      </Container>
    </Fragment>
  );
}
