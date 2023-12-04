import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { get } from "lodash";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Header from "../component/HeadComponent";

const { Text, Title } = Typography;

const User = (props) => {
  const router = useRouter();

  const [user, setUser] = useState({});

  useEffect(() => {
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const id = props.user.id;
      const apiURL = `/api/customer/${id}`;
      const { data } = await axios.get(`${apiURL}`);      
      setUser(get(data, "data", {}));
    } catch (err) {
      notification.error({ message: err ? err : "Error!" });
    }
  };
  console.log(user);
  

  const onFinish = async (value) => {
    try {
      const apiURL = `/api/authentication/updateInfo`;
      const { data } = await axios.patch(`${apiURL}`, {
        ...value,
        id: props.user.id
      });
      // setUser(get(data, "data", {}));
    } catch (err) {
      notification.error({ message: err ? err : "Error!" });
    }
    router.push("/user");
  };
  
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50">
        <Header
          isAdmin={get(props, "user.role", 0) === 1 ? true : false}
          signined={get(props, "sessionId", "") ? true : false}
        />
      </header>
      <Row className="mt-10 justify-center">
        <Col md={4}>
          <div className="flex flex-row">
            <Image src={"/user.png"} alt="user" preview={false} />
          </div>
        </Col>
      </Row>

      <div className="text-center mb-10">
        <Title level={4}>Cập nhật thông tin cá nhân</Title>
      </div>

      <Row className="justify-center">
        <Col md={12}>
          <Form
            name="registrationForm"
            onFinish={onFinish}
            labelCol={{ md: 8, xs: 24 }}
            labelWrap
            wrapperCol={{ md: 16, xs: 24 }}
            labelAlign="left"
            initialValues={{ remember: true }}
          >
            <Form.Item label="Full Name" name="full_name" initialValue={user?.full_name}>
              <Input />
            </Form.Item>

            <Form.Item label="Phone" name="phone" initialValue={user?.phone}>
              <Input />
            </Form.Item>

            <Form.Item className="w-full">
              <div className="flex flex-col items-center w-full">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="items-center"
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default User;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session)
    return {
      props: {
        sessionId: session.id,
        user: session.user,
      },
    };
  return {
    props: {},
  };
}
