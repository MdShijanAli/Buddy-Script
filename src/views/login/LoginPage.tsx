import { useForm } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { loginSuccess, clearError } from "../../store/slices/authSlice";
import { useLoginMutation } from "../../store/api/authApi";
import shape1 from "../../assets/images/shape1.svg";
import darkShape from "../../assets/images/dark_shape.svg";
import shape2 from "../../assets/images/shape2.svg";
import darkShape1 from "../../assets/images/dark_shape1.svg";
import shape3 from "../../assets/images/shape3.svg";
import darkShape2 from "../../assets/images/dark_shape2.svg";
import loginImg from "../../assets/images/login.png";
import logoImg from "../../assets/images/logo.svg";
import googleImg from "../../assets/images/google.svg";
import { toast } from "react-toastify";

interface LoginPageProps {
  onNavigate: (page: "login" | "registration" | "feed") => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const dispatch = useDispatch();
  const { error: authError } = useSelector((state: RootState) => state.auth);
  const [login, { isLoading, error }] = useLoginMutation();

  const { values, handleChange } = useForm({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (response.user) {
        dispatch(
          loginSuccess({
            user: response.user,
            token: response.access_token || response.token || "",
            refreshToken: response.refresh_token,
          }),
        );

        // Navigate to feed after successful login
        setTimeout(() => onNavigate("feed"), 500);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(
        err?.data?.error?.message ||
          err.message ||
          "Login failed. Please try again.",
      );
    }
  };

  const handleNavigateToRegistration = () => {
    onNavigate("registration");
  };

  const errorMessage = error
    ? typeof error === "object" &&
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
      ? (error.data as { message: string }).message
      : "Login failed. Please try again."
    : authError;

  return (
    <div>
      <section className="_social_login_wrapper _layout_main_wrapper">
        <div className="_shape_one">
          <img src={shape1} alt="" className="_shape_img" />
          <img src={darkShape} alt="" className="_dark_shape" />
        </div>
        <div className="_shape_two">
          <img src={shape2} alt="" className="_shape_img" />
          <img
            src={darkShape1}
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        <div className="_shape_three">
          <img src={shape3} alt="" className="_shape_img" />
          <img
            src={darkShape2}
            alt=""
            className="_dark_shape _dark_shape_opacity"
          />
        </div>
        <div className="_social_login_wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="_social_login_left">
                  <div className="_social_login_left_image">
                    <img src={loginImg} alt="Image" className="_left_img" />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <div className="_social_login_content">
                  <div className="_social_login_left_logo _mar_b28">
                    <img src={logoImg} alt="Image" className="_left_logo" />
                  </div>
                  <p className="_social_login_content_para _mar_b8">
                    Welcome back
                  </p>
                  <h4 className="_social_login_content_title _titl4 _mar_b50">
                    Login to your account
                  </h4>
                  <button
                    type="button"
                    className="_social_login_content_btn _mar_b40"
                  >
                    <img src={googleImg} alt="Image" className="_google_img" />{" "}
                    <span>Or sign-in with google</span>
                  </button>
                  <div className="_social_login_content_bottom_txt _mar_b40">
                    {" "}
                    <span>Or</span>
                  </div>
                  <form className="_social_login_form">
                    <div className="row">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control _social_login_input"
                            name="email"
                            value={values.email as string}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control _social_login_input"
                            name="password"
                            value={values.password as string}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                    {error && (
                      <div className="alert alert-danger _mar_b20">
                        {errorMessage}
                      </div>
                    )}
                    <div className="row">
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="form-check _social_login_form_check">
                          <input
                            className="form-check-input _social_login_form_check_input"
                            type="radio"
                            name="rememberMe"
                            id="flexRadioDefault2"
                            checked={values.rememberMe === true}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                          <label
                            className="form-check-label _social_login_form_check_label"
                            htmlFor="flexRadioDefault2"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
                        <div className="_social_login_form_left">
                          <p className="_social_login_form_left_para">
                            Forgot password?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                        <div className="_social_login_form_btn _mar_t40 _mar_b60">
                          <button
                            type="submit"
                            className="_social_login_form_btn_link _btn1"
                            onClick={handleLoginSubmit}
                            disabled={isLoading}
                          >
                            {isLoading ? "Logging in..." : "Login now"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_login_bottom_txt">
                        <p className="_social_login_bottom_txt_para">
                          Dont have an account?{" "}
                          <button
                            type="button"
                            onClick={handleNavigateToRegistration}
                            style={{
                              background: "none",
                              border: "none",
                              color: "inherit",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Create New Account
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
