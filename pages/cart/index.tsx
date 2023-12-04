import { Col, Empty, Row, Typography, notification } from "antd";
import axios from "axios";
import { get, size } from "lodash";
import { useEffect, useState } from "react";
import Header from "../component/HeadComponent";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import CartComponent from "../component/CartComponent";

const { Title } = Typography;

const Cart = (props) => {
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);

  const apiURL = `/api/cart`;

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${apiURL}`);
      setArticles(get(data, "data.data", []));
      setTotal(get(data, "data.total", []));
    } catch (err) {
      notification.error({ message: err ? err : "Error!" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <header className="sticky top-0 z-50">
        <Header
          isAdmin={get(props, "user.role", 0) === 1 ? true : false}
          signined={get(props, "sessionId", "") ? true : false}
        />
      </header>
      <Row className="mt-10">
        <Col md={18} offset={3}>
          <Title level={3}>Giỏ hàng</Title>
        </Col>
      </Row>
      <Row>
        <Col md={18} offset={3}>
          <Title level={4}>Số lượng: {total}</Title>
        </Col>
      </Row>

      <div className="mt-10">
        {size(articles) ? (
          articles.map((item, index) => (
            <Row className="justify-center mb-5" key={item?.id}>
              <Col md={18}>
                <CartComponent item={item} />
              </Col>
            </Row>
          ))
        ) : (
          <div className="justify-center m-10">
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

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
