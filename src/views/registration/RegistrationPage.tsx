import { useForm } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { registerSuccess, clearError } from "../../store/slices/authSlice";
import { useRegisterMutation } from "../../store/api/authApi";
import darkShapeImg from "../../assets/images/dark_shape.svg";
import shape1Image from "../../assets/images/shape1.svg";
import shape2Image from "../../assets/images/shape2.svg";
import shape3Image from "../../assets/images/shape3.svg";
import darkShape1Image from "../../assets/images/dark_shape1.svg";
import darkShape2Image from "../../assets/images/dark_shape2.svg";
import registrationImage from "../../assets/images/registration.png";
import registration1Image from "../../assets/images/registration1.png";
import logoImage from "../../assets/images/logo.svg";
import googleImage from "../../assets/images/google.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RegistrationPage() {
  const dispatch = useDispatch();
  const { error: authError } = useSelector((state: RootState) => state.auth);
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const { values, handleChange } = useForm({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!(values.firstName as string).trim()) {
      alert("First name is required");
      return;
    }

    if (!(values.lastName as string).trim()) {
      alert("Last name is required");
      return;
    }

    // Validate passwords match
    if ((values.password as string) !== (values.confirmPassword as string)) {
      alert("Passwords do not match");
      return;
    }

    // Validate terms accepted
    if ((values.agreeTerms as boolean) !== true) {
      alert("You must agree to the terms and conditions");
      return;
    }

    try {
      const response = await register({
        first_name: (values.firstName as string).trim(),
        last_name: (values.lastName as string).trim(),
        email: values.email as string,
        password: values.password as string,
        name: `${(values.firstName as string).trim()} ${(values.lastName as string).trim()}`,
      }).unwrap();

      if (response.user) {
        const responseAny = response as any;

        dispatch(
          registerSuccess({
            user: response.user,
            token: responseAny?.tokens?.accessToken || responseAny?.token || "",
            refreshToken:
              responseAny?.tokens?.refreshToken ||
              responseAny?.refresh_token ||
              "",
          }),
        );

        // Navigate to feed after successful registration

        toast.success("Registration successful! Redirecting to feed...");
        navigate("/");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
        err?.data?.error?.message ||
        err.message ||
        "Registration failed. Please try again.",
      );
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const errorMessage = error
    ? typeof error === "object" &&
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
      ? (error.data as { message: string }).message
      : "Registration failed. Please try again."
    : authError;
  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src={shape1Image} alt="" className="_shape_img" />
        <img src={darkShapeImg} alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src={shape2Image} alt="" className="_shape_img" />
        <img
          src={darkShape1Image}
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_shape_three">
        <img src={shape3Image} alt="" className="_shape_img" />
        <img
          src={darkShape2Image}
          alt=""
          className="_dark_shape _dark_shape_opacity"
        />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src={registrationImage} alt="Image" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src={registration1Image} alt="Image" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src={logoImage} alt="Image" className="_right_logo" />
                </div>
                <p className="_social_registration_content_para _mar_b8">
                  Get Started Now
                </p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">
                  Registration
                </h4>
                <button
                  type="button"
                  className="_social_registration_content_btn _mar_b40"
                >
                  <img src={googleImage} alt="Image" className="_google_img" />{" "}
                  <span>Register with google</span>
                </button>
                <div className="_social_registration_content_bottom_txt _mar_b40">
                  {" "}
                  <span>Or</span>
                </div>
                <form
                  className="_social_registration_form"
                  onSubmit={handleRegisterSubmit}
                >
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control _social_registration_input"
                          name="firstName"
                          value={values.firstName as string}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="form-control _social_registration_input"
                          name="lastName"
                          value={values.lastName as string}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control _social_registration_input"
                          name="email"
                          value={values.email as string}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control _social_registration_input"
                          name="password"
                          value={values.password as string}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">
                          Repeat Password
                        </label>
                        <input
                          type="password"
                          className="form-control _social_registration_input"
                          name="confirmPassword"
                          value={values.confirmPassword as string}
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
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input
                          className="form-check-input _social_registration_form_check_input"
                          type="checkbox"
                          name="agreeTerms"
                          id="flexRadioDefault2"
                          checked={values.agreeTerms === true}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        <label
                          className="form-check-label _social_registration_form_check_label"
                          htmlFor="flexRadioDefault2"
                        >
                          I agree to terms & conditions
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          className="_btn1"
                          disabled={isLoading}
                        >
                          {isLoading ? "Registering..." : "Register now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={handleNavigateToLogin}
                          style={{
                            background: "none",
                            border: "none",
                            color: "inherit",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Sign In
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
  );
}
