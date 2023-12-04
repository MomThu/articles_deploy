import { Button, Form, Input, Typography, message, notification } from "antd";
import axios from "axios";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../component/HeadComponent";

const { Title } = Typography;
interface FormLogin {
  email: string;
  password: string;
  csrfToken: any;
}

export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const [form] = Form.useForm<FormLogin>();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = {
        email: e.target.email.value,
        password: e.target.password.value,
        csrfToken: e.target.csrfToken.value,
      };
      const response = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (response?.error) {
        notification.error({ message: response?.error });
      } else {
        router.push("/");
      }
    } catch (error) {
      notification.error({ message: "Error!" });
    }
  };

  const handleClickForgetPassword = async () => {
    router.push("/forgetPassword");
  };

  return (
    <div>
      <header className="sticky top-0 z-50">
        <Header signined={false} isAdmin={true} />
      </header>
      <div className="h-[100vh] flex flex-col justify-center bg-[#001524]">
        <div className="flex justify-center">
          <div className="bg-white flex flex-col py-8 px-20 rounded-xl shadow-xl max-w-[528px]">
            <Title className="text-center text-[40px] leading-[48px] font-bold mb-8">
              Login
            </Title>
            <form onSubmit={handleSubmit}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

              <div style={{ marginBottom: "5%" }}>
                <label
                  htmlFor="email"
                  style={{ display: "block", marginBottom: "3%" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  style={{
                    width: "100%",
                    // padding: "3%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "0.5em",
                  }}
                />
              </div>

              <div style={{ marginBottom: "5%" }}>
                <label
                  htmlFor="password"
                  style={{ display: "block", marginBottom: "3%" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  style={{
                    width: "100%",
                    // padding: "3%",
                    boxSizing: "border-box",
                    border: "1px solid #ccc",
                    borderRadius: "0.5em",
                  }}
                />
              </div>

              {/* Forgot Password link */}
              <div style={{ marginBottom: "5%", textAlign: "right" }}>
                <Link
                  href={{ pathname: "/auth/forgetpassword" }} // Replace with your actual forgot password page
                  style={{ color: "#1890ff", textDecoration: "underline" }}
                >
                  Forgot Password?
                </Link>
              </div>

              <div style={{ marginBottom: "5%", textAlign: "right" }}>
                Do you not have an account?{" "}
                <Link
                  href={{ pathname: "/auth/register" }} // Replace with your actual forgot password page
                  style={{ color: "#1890ff", textDecoration: "underline" }}
                >
                  Register
                </Link>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#1890ff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "5px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
