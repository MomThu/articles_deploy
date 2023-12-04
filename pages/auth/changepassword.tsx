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
import { get } from "lodash";

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
      const apiURL = `/api/authentication/changepassword`;
      const response = await axios.post(apiURL, {
        oldPassword: data?.oldPassword,
        newPassword: data?.newPassword,
      });
      if (!response.data?.error) {
        setSpending(false);
        setIsResetSuccess(true);
        notification.success({
          message: get(response, "message", "") || "Password reset successful",
        });
        router.push("/auth/signin")
      } else {
        notification.error({
          message: get(response, "message", "") || "Password reset failed",
        });
        setSpending(false);
      }
    } catch (error) {      
      notification.error({
        message: get(error, "response.data.message", "") || "Password reset failed",
      });
      setSpending(false);
    }
  };

  return (
    <div>
      <header className="sticky top-0 z-50">
        <Header signined={true} isAdmin={false} />
      </header>
      <div className="h-[100vh] flex flex-col justify-center">
        {spending ? (
          <Space size="large" className="flex justify-center">
            <Spin size="large" className="text-black" />
          </Space>
        ) : (
          <Row className="flex justify-center">
            <Col className="bg-white flex flex-col py-8 px-20 rounded-xl shadow-xl max-w-[528px]">
              <Title className="text-center text-[40px] leading-[48px] font-bold mb-8">
                Change Password
              </Title>

              <Form form={form}>
                <Form.Item
                  name={"oldPassword"}
                  labelAlign="left"
                  required
                  rules={[
                    {
                      required: true,
                      message: "Please input current password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Old password" size="large" />
                </Form.Item>
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
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
