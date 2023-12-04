/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Header from "../component/HeadComponent";

const { Title } = Typography;

interface FormResetPassword {
  newPassword: string;
  confirmNewPassword: string;
  email?: string;
  resetString?: string;
}

const ResetPasswordPage: React.FC = () => {
  const router = useRouter();

  const [spending, setSpending] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const [form] = Form.useForm<FormResetPassword>();
  const { userId, resetString } = router.query;

  const handleSubmit = async () => {
    try {
      const data = await form.validateFields();
      setSpending(true);
      handleResetPassword(data);
    } catch (error) {
      // console.log(error);
    }
  };

  const handleResetPassword = async (data: any) => {
    try {
      const apiURL = `/api/authentication/resetpassword`;
      const response = await axios.post(apiURL, {
        cusId: userId,
        resetString: resetString,
        password: data?.newPassword,
      });
      if (!response.data?.error) {
        setSpending(false);
        setIsResetSuccess(true);
      } else {
        notification.error({ message: "Password reset failed" });
        setSpending(false);
      }
    } catch (error) {
      notification.error({ message: "Password reset failed" });
      setSpending(false);
    }
  };

  const handleClickLogin = () => {
    router.push("/auth/signin");
  };

  return (
    <div>
      <header className="sticky top-0 z-50">
        <Header signined={false} isAdmin={true} />
      </header>
      <div className="h-[100vh] flex flex-col justify-center bg-[#001524]">
        {spending ? (
          <Space size="large" className="flex justify-center">
            <Spin size="large" className="text-black" />
          </Space>
        ) : !isResetSuccess ? (
          <Row className="flex justify-center">
            <Col className="bg-white flex flex-col py-8 px-20 rounded-xl shadow-xl max-w-[528px]">
              <Title className="text-center text-[40px] leading-[48px] font-bold mb-8">
                Reset Password
              </Title>

              <Form form={form}>
                <Form.Item
                  name={"newPassword"}
                  labelAlign="left"
                  required
                  rules={[
                    { required: true, message: "Please input new password!" },
                  ]}
                >
                  <Input.Password placeholder="New password" size="large" />
                </Form.Item>
                <Form.Item
                  name={"confirmNewPassword"}
                  labelAlign="left"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The passwords does not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    placeholder="Confirm new password"
                    size="large"
                  />
                </Form.Item>
              </Form>

              <Button
                block
                type="primary"
                className="mt-5"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Col>
          </Row>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[500px] text-center bg-gray-700 text-white p-8 rounded-md">
              <h2 className="md:text-[32px] leading-10 mb-6">Password Reset</h2>
              <p className="mb-4">{`Your password has been reset successfully.`}</p>
              <p className="mb-4">{`You may now login`}</p>
              <div className="flex justify-center">
                <Button onClick={handleClickLogin}>Login</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
