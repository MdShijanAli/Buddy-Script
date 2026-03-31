import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/css/common.css";
import "./assets/css/main.css";
import "./assets/css/responsive.css";
import "./App.css";
import LoginPage from "./views/login/LoginPage";
import RegistrationPage from "./views/registration/RegistrationPage";

function App() {
  return (
    <>
      {/* <LoginPage /> */}
      <RegistrationPage />
    </>
  );
}

export default App;
