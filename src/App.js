import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Detail from "./pages/Detail";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
function App() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    PasswordConfirm: "",
  });
  return (
    // 페이지 이동에 사용되는 Route 태그를 위해선 Routes로 먼저 감싸야 한다.
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* path="/"이기 때문에 '<주소>/'인 주소로 접속할 경우 Main 컴포넌트가 화면에 보여지게 된다.  */}
        {/* Main 컴포넌트에 todos를 전달 */}
        <Route path="/" element={<Main />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route
          path="/signup"
          element={<Signup inputs={inputs} setInputs={setInputs} />}
        />

        <Route
          path="/login"
          element={<Login inputs={inputs} setInputs={setInputs} />}
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
