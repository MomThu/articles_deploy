import { Button, Col, Image, Row, Typography, notification } from "antd";
import axios from "axios";
import { get } from "lodash";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";

import {
    MailOutlined,
    PhoneOutlined
} from "@ant-design/icons";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Header from "../component/HeadComponent";

const { Text, Title } = Typography;

const User = (props) => {
  const router = useRouter();

  const [user, setUser] = useState();

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

  const gotoUpdateInfo = () => {
    router.push("/user/updateInfo");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50">
        <Header
          isAdmin={get(props, "user.role", 0) === 1 ? true : false}
          signined={get(props, "sessionId", "") ? true : false}
        />
      </header>
      <Row className="mt-10 ml-10">
        <Col md={4} offset={2}>
          <div className="flex flex-row">
            <Image src={"/user.png"} alt="user" preview={false} />
          </div>
        </Col>
        <Col>
          <div className="mt-10">
            <Title level={1}>{get(user, "full_name", "")}</Title>
            <div className="mt-1">
              <MailOutlined /> {get(user, "email", "")}
            </div>
            <div className="mt-1">
              <PhoneOutlined /> {get(user, "phone", "")}
            </div>
          </div>
          <div className="mt-1">
            <Button onClick={gotoUpdateInfo}>Cập nhật thông tin cá nhân</Button>
          </div>
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
