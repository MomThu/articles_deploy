import {
  Button,
  Checkbox,
  Col,
  Empty,
  Row,
  Typography,
  notification,
} from "antd";
import axios from "axios";
import { get, max, size } from "lodash";
import { useEffect, useState } from "react";
import Header from "../component/HeadComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import CartComponent from "../component/CartComponent";
import { useRouter } from "next/router";
import PaymentComponent from "../component/PaymentComponent";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { DollarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Payment = (props) => {
  const router = useRouter();

  const [article, setArticle] = useState([]);
  const [permissionCheck, setPermissionCheck] = useState<any>(0);
  const [price, setPrice] = useState(0);
  const [paid, setPaid] = useState(0);

  const fetchData = async () => {
    try {
      const id = router?.query.id;
      const apiURL = `/api/pdf`;
      const { data } = await axios.get(`${apiURL}?article=${id}`);
      setArticle(get(data, "data", {}));
      if (get(data, "data.permission", 0) === 1) {
        setPaid(get(data, "data.article.price", 0) * 0.5);
      } else if (get(data, "data.permission", 0) === 2) {
        setPaid(get(data, "data.article.price", 0) * 0.75);
      } else if (get(data, "data.permission", 0) === 3) {
        setPaid(get(data, "data.article.price", 0));
      }
    } catch (err) {
      notification.error({ message: err ? err : "Error!" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePayment = async () => {
    try {
      const id = router?.query.id;
      const apiURL = `/api/article/payment`;
      try {
        const { data } = await axios.patch(`${apiURL}`, {
          article: Number(id),
          permission: permissionCheck,
        });
        if (!data?.error) {
          notification.success({ message: data?.message });
          router.push(`/article?article=${router?.query.id}`)
        }
      } catch (err) {
        notification.error({
          message: err ? get(err, "response.data.message", "") : "Error!",
        });
      }
    } catch (err) {
      notification.error({ message: err ? err.toString() : "Error!" });
    }
  };

  const options = [
    {
      label: "Đọc",
      value: 1,
      disabled: get(article, "permission", 0) ? true : false,
    },
    {
      label: "In",
      value: 2,
      disabled: get(article, "permission", 0) > 1 ? true : false,
    },
    {
      label: "Tải về",
      value: 3,
      disabled: get(article, "permission", 0) > 2 ? true : false,
    },
  ];

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setPermissionCheck(max(checkedValues));
    setPrice(
      permissionCheck === 1
        ? get(article, "article.price", 0) * 0.5
        : permissionCheck === 2
        ? get(article, "article.price", 0) * 0.75
        : permissionCheck === 3
        ? get(article, "article.price", 0)
        : 0
    );
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50">
        <Header
          isAdmin={get(props, "user.role", 0) === 1 ? true : false}
          signined={get(props, "sessionId", "") ? true : false}
        />
      </header>
      <Row className="mt-10">
        <Col md={18} offset={3}>
          <Title level={3}>Thanh toán</Title>
        </Col>
      </Row>

      <div className="mt-10">
        <Row className="justify-center">
          <Col md={18}>
            <PaymentComponent item={get(article, "article", {})} />
          </Col>
        </Row>
      </div>

      <Row className="mt-10 justify-center">
        <Col md={18}>
          <div>
            <Title level={4}>Thanh toán cho các quyền: </Title>
          </div>
          <Checkbox.Group
            options={options}
            onChange={onChange}
            className="my-5 gap-20"
          >
            <div>
              <Checkbox
                value={1}
                disabled={get(article, "permission", 0) ? true : false}
              >
                Đọc
              </Checkbox>
            </div>
            <div>
              <Checkbox
                value={2}
                disabled={get(article, "permission", 0) > 1 ? true : false}
              >
                In
              </Checkbox>
            </div>
            <div>
              <Checkbox
                value={3}
                disabled={get(article, "permission", 0) > 2 ? true : false}
              >
                Tải về
              </Checkbox>
            </div>
          </Checkbox.Group>
          <div className="flex flex-row gap-2">
            <div>
              <Title level={5}>
                Tổng tiền: {" "}
              </Title>
            </div>
            <div>
              <Title level={5}>
                {permissionCheck === 1
                  ? get(article, "article.price", 0) * 0.5 - paid
                  : permissionCheck === 2
                  ? get(article, "article.price", 0) * 0.75 - paid
                  : permissionCheck === 3
                  ? get(article, "article.price", 0) - paid
                  : 0}{" "}
                VND
              </Title>
            </div>
            {/* <DollarOutlined /> */}
          </div>
          <div>
            <Button
              disabled={get(article, "permission") === 3 ? true : false}
              onClick={() => handlePayment()}
            >
              Thanh toán
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Payment;

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
