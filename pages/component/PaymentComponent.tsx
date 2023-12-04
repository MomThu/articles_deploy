import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Typography } from "antd";
import { size } from "lodash";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const { Text, Title, Paragraph } = Typography;
const { Meta } = Card;

const PaymentComponent = ({ item }) => {
  const router = useRouter();

  const gotoPayment = () => {
    router.push("/payment");
  };
  return (
    <div>
      <Card>
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
              <div>
                <Text>{moment(item?.date).format("DD/MM/YYYY")}</Text>
              </div>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default PaymentComponent;
