import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Container from "../common/Container";
import { useSelector, useDispatch } from "react-redux";
import { removeTodo } from "../redux/slices/todosSlice";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

export default function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = new useQueryClient();
  const userEmail = useSelector((state) => state.user.email);
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
      } catch (error) {
        // 에러 처리
      }
    }
  };
  return (
    <>
      <Header />
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "12px",
          }}
        >
          <button
            onClick={() => {
              if (!userEmail) {
                alert("로그인 후 이용해주세요.");
                navigate("/login");
              } else {
                navigate("/create");
              }
            }}
            style={{
              border: "none",
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: "skyblue",
              color: "white",
              cursor: "pointer",
            }}
          >
            추가
          </button>
        </div>
        {data.map((post) => {
          return (
            <div
              key={post.id}
              style={{
                backgroundColor: "#EEEEEE",
                height: "100px",
                borderRadius: "24px",
                marginBottom: "12px",
                display: "flex",
                padding: "12px 16px 12px 16px",
              }}
            >
              <div
                onClick={() => {
                  navigate(`/detail/${post.id}`);
                }}
                style={{
                  flex: 4,
                  borderRight: "1px solid lightgrey",
                  cursor: "pointer",
                }}
              >
                <h2>{post.title}</h2>
                <p
                  style={{
                    width: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.content}
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  justifyContent: "space-around",
                  gap: "12px",
                }}
              >
                <div>{post.author}</div>
                <div>
                  <button
                    onClick={() => {
                      if (post.author !== userEmail) {
                        alert("수정 권한이 없습니다.");
                        return; //return을 써서 페이지가 전환되는 것을 막음.
                      }
                      navigate(`/edit/${post.id}`);
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
                      if (post.author !== userEmail) {
                        alert("삭제 권한이 없습니다.");
                        return; //리턴으로 막아줌
                      }
                      handleRemoveTodo(post.id); // 삭제 버튼을 누를 때 handleRemoveTodo 함수 호출
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
              </div>
            </div>
          );
        })}
      </Container>
    </>
  );
}
