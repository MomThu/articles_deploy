import React from "react";
import { Form, Input, Button, Col, Row, Typography, notification } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../component/HeadComponent";
import { get } from "lodash";

const { Title, Text } = Typography;

const Register = () => {
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const apiURL = `/api/authentication/register`;
      const { data } = await axios.post(`${apiURL}`, {
        ...values,
      });
      if (!data?.error) {
        await notification.success({ message: "Register successful!" });
        router.push("/auth/signin");
      }
    } catch (err) {
      notification.error({
        message: err ? err.response.data?.message : "Register failed!",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <header className="sticky top-0 z-50">
        <Header signined={false} isAdmin={true} />
      </header>
      <div className="h-[100vh] flex flex-col justify-center bg-[#001524]">
        <Row className="flex justify-center">
          <Col md={12} className="bg-white py-8 px-20 rounded-xl shadow-xl">
            <Title className="text-center text-[40px] leading-[48px] font-bold mb-8">
              Register
            </Title>
            <div className="justify-center">
              <Form
                name="registrationForm"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                labelCol={{ md: 8, xs: 24 }}
                labelWrap
                wrapperCol={{ md: 16, xs: 24 }}
                labelAlign="left"
              >
                <Form.Item
                  label="Full Name"
                  name="full_name"
                  rules={[
                    { required: true, message: "Please enter your full name!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    {
                      type: "email",
                      message: "Please enter a valid email address!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters long!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter your phone!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item className="w-full">
                  <div className="flex flex-col items-center w-full">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="items-center"
                    >
                      Register
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              <div>
                <Text>
                  Did you have an account?{" "}
                  <Link
                    href={{ pathname: "/auth/signin" }} // Replace with your actual forgot password page
                    style={{ color: "#1890ff", textDecoration: "underline" }}
                  >
                    Signin
                  </Link>
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;
