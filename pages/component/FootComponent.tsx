import { Layout, Row, Col, Typography, Divider, Image } from "antd";
import {
  GithubOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
// import logo from 'path/to/your/logo';

const { Footer } = Layout;
const { Text, Paragraph } = Typography;

const AppFooter = () => {
  return (
    <Footer style={{ backgroundColor: "#2c3e50", color: "white" }}>
      <Row justify="center" align="top" gutter={[16, 16]}>
        <Col md={8} lg={8}>
          <div>
            {/* <Image src={logo} alt="Book Store App" preview={false} /> */}
            <Text strong>Article-PDF</Text>
          </div>
          <Paragraph>
            Article-PDF is an online web application where the customer can read
            articles online. Through this website, users can search for an
            articles its information and later can add it to the shopping cart
            and finally purchase for own it.
          </Paragraph>
        </Col>
        <Col md={8} lg={8}>
          <div>
            <Text strong>Products</Text>
          </div>
          <Paragraph>
            <a href="#">Articles</a>
          </Paragraph>
        </Col>
        <Col md={8} lg={8}>
          <div>
            <Text strong>Contact</Text>
          </div>
          <Paragraph>
            <MailOutlined /> thumomm10@gmail.com
          </Paragraph>
          <Paragraph>
            <PhoneOutlined /> +8412345678
          </Paragraph>
          <div style={{ textAlign: "right" }}>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ display: "inline-block", marginRight: "8px" }}>
                <a href="#">
                  <GithubOutlined
                    style={{ fontSize: "1.5em", color: "white" }}
                  />
                </a>
              </li>
              <li style={{ display: "inline-block", marginRight: "8px" }}>
                <a href="#">
                  <LinkedinOutlined
                    style={{ fontSize: "1.5em", color: "white" }}
                  />
                </a>
              </li>
              <li style={{ display: "inline-block" }}>
                <a href="#">
                  <InstagramOutlined
                    style={{ fontSize: "1.5em", color: "white" }}
                  />
                </a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
