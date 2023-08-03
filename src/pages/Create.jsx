import React from "react";
import Header from "../common/Header";
import Container from "../common/Container";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function Create() {
  const navigate = useNavigate();
  const queryClient = new useQueryClient();

  const userEmail = useSelector((state) => state.user.email);

  const [createTodo, setCreateTodo] = useState({
    title: "",
    content: "",
    author: userEmail,
  });
  const newTodo = {
    id: nanoid(),
    author: userEmail,
    ...createTodo,
  };

  const mutation = useMutation(
    async () => {
      await axios.post("http://localhost:4000/posts", {
        ...newTodo,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
      },
    }
  );

  const submitHandler = async (e) => {
    e.preventDefault();

    navigate("/");
  };
  return (
    <>
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
              value={createTodo.title}
              onChange={(e) => {
                setCreateTodo({ ...createTodo, title: e.target.value });
              }}
              placeholder="제목"
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
              value={createTodo.content}
              onChange={(e) => {
                setCreateTodo({ ...createTodo, content: e.target.value });
              }}
              placeholder="내용"
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
            onClick={() => {
              mutation.mutate();
            }}
            type="submit"
            style={{
              width: "100%",
              height: "40px",
              border: "none",
              color: "white",
              borderRadius: "12px",
              backgroundColor: "skyblue",
              cursor: "pointer",
            }}
          >
            추가하기
          </button>
        </form>
      </Container>
    </>
  );
}
