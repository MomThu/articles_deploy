import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Typography } from "antd";
import { size } from "lodash";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const { Text, Title, Paragraph } = Typography;
const { Meta } = Card;

const CartComponent = ({ item }) => {
  const router = useRouter();

  const gotoPayment = () => {
    router.push(`/payment/${item?.id}`)
  }
  return (
    <div>
      <Card>
        <div>
          <Text>{moment(item?.date).format("DD/MM/YYYY")}</Text>
        </div>
        <Meta
          title={
            <Link href={{ pathname: "/article", query: { article: item?.id } }}>
              <Title level={4}>{item?.title}</Title>
            </Link>
          }
          description={
            <div>
              <div>
                <Paragraph
                  ellipsis={{ rows: 2, expandable: false }}
                  type="secondary"
                >
                  {item?.abstract}
                </Paragraph>
              </div>
              <div>
                <Text>{item?.journal_name}</Text>
              </div>
            </div>
          }
        />
        <div className="flex flex-col items-end">
          <Button type="primary" onClick={gotoPayment}>Thanh toán</Button>
        </div>
      </Card>
    </div>
  );
};

export default CartComponent;
