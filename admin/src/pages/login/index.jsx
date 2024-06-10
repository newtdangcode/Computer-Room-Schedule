import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "../../components/loading";
import yup from "../../utils/yupGlobal";
import styles from "./styles.module.css";
import loginImg from "../../assets/img/login.png";
import authAPI from "../../api/authAPI.js";
import { setUserSuccess, setUserFail } from "../../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const schema = yup.object().shape({
    username: yup.string().required("Vui lòng nhập Username của bạn "),
    password: yup.string().required("Vui lòng nhập mật khẩu của bạn"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    const { username, password } = data;
    try {
      setIsLoading(true);
      const response = await authAPI.login(username, password);
      dispatch(setUserSuccess(response.data));
      console.log(response.data);
      navigate("/", { replace: true });
    } catch(error) {
      dispatch(setUserFail());
      setIsError(true);
      setErrorMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className="w-3/5">
          <img src={loginImg} alt="login.jpeg" className="w-full h-full object-cover inline-block" />
        </div>
        <div className="w-2/5 p-12">
          <div className="h-full">
            <h1 className="text-[28px] font-semibold mb-6 text-primary">PTITHCM Computer Room Schedule</h1>
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Đăng Nhập</h1>
            {isError && (
              <div className="my-4 py-3 px-4 bg-red-100 border-[1px] border-[#ff424f33]">
                <p className="text-[#222222]">Đăng nhập không thành công. {errorMessage}</p>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="username"
                  placeholder="username"
                  className={`${
                    errors.username ? "border-red-500" : ""
                  } block w-full h-12 px-3 py-1 text-sm rounded-md border-[1px] border-gray-200 bg-gray-100 focus:outline-none focus:bg-transparent`}
                  {...register("username")}
                />
                {errors.username && <p className="text-red-500 text-sm">{`*${errors.username.message}`}</p>}
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm text-gray-700">
                  Mật Khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  className={`${
                    errors.password ? "border-red-500" : ""
                  } block w-full h-12 px-3 py-1 text-sm rounded-md border-[1px] border-gray-200 bg-gray-100 focus:outline-none focus:bg-transparent`}
                  {...register("password")}
                />
                {errors.password && <p className="text-red-500 text-sm">{`*${errors.password.message}`}</p>}
              </div>
              <button
                disabled={isLoading}
                className={`${
                  isLoading ? "cursor-not-allowed" : ""
                } w-full bg-primary text-white text-sm py-4 rounded-md`}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Loading size={30} />
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>
              {/* <div className=" flex pt-5 justify-start pl-2 items-center w-full h-full">
                <Link to="/forget-password" className="underline text-sm text-primary">
                  Quên mật khẩu?
                </Link>
              </div> */}

             
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
