import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Typography,
  message,
  notification,
} from "antd";
import axios from "axios";
import { get, isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Pdf from "../pdf";
import { GetServerSideProps } from "next";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import crypto from "crypto";
import {
  DocumentAskPasswordEvent,
  PdfJs,
  RenderPageProps,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import type {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Header from "../component/HeadComponent";
const { Text, Title } = Typography;
interface RemovePartsDefaultToolbarDefaultLayoutExampleProps {
  fileUrl: string;
}

const Article = (props) => {
  const router = useRouter();

  const [article, setArticle] = useState({});
  const [showPdf, setShowPdf] = useState(false);
  const [pdf, setPdf] = useState({});
  const [pdfUrl, setPdfUrl] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [type, setType] = useState(0);
  const [password, setPassword] = useState('');

  const transform1: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    Open: () => <></>,
    Print: () => <></>,
  });

  const transform2: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    Open: () => <></>,
  });

  const transform3: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Open: () => <></>,
  });

  const renderToolbar = (
    Toolbar: (props: ToolbarProps) => React.ReactElement
  ) => (
    <Toolbar>
      {renderDefaultToolbar(
        get(pdf, "permission") === 1
          ? transform1
          : get(pdf, "permission") === 2
            ? transform2
            : get(pdf, "permission") === 3
              ? transform3
              : null
      )}
    </Toolbar>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
  });
  const { renderDefaultToolbar } =
    defaultLayoutPluginInstance.toolbarPluginInstance;

  const renderPage = (props: RenderPageProps) => {
    return (
      <>
        {props.canvasLayer.children}
        <div
          style={{ userSelect: get(pdf, "permission") !== 3 ? "none" : "auto" }}
        >
          {props.textLayer.children}
        </div>
        {props.annotationLayer.children}
      </>
    );
  };

  useEffect(() => {
    fetchPdf();
  }, []);

  const fetchPdf = async () => {
    try {
      const id = router?.query.article;
      const apiURL = `/api/pdf`;
      const { data } = await axios.get(`${apiURL}?article=${id}`);
      setArticle(get(data, "data.article", {}));
      setPdf(get(data, "data", {}));
      if (data.data?.permission == 1 || data.data?.permission == 2 || data.data?.permission == 3) {
        const content = await axios.get(`/api/pdf/content/?name=${data.data?.file_name}`);
        setPdfUrl(content.data)
      }
    } catch (err) {
      notification.error({ message: err ? err : "Error!" });
    }
  };

  const handleAccess = () => {
    setShowPdf(true);
  };

  const decrypt = (encryptedText, key, iv) => {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key, "hex"),
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  };

  const handleAskPassword = (e: DocumentAskPasswordEvent) => {
    try {
      const key = props?.sessionId;
      const realPassword = decrypt(
        get(pdf, "encryptedPassword", ""),
        key,
        get(pdf, "iv_value", "")
      );
      if (realPassword) {
        e.verifyPassword(realPassword);
        setPassword(realPassword)
      }
    } catch (err) { }
  };

  const handleAddToCard = async () => {    
    if (!get(props, 'sessionId', '')) {
      notification.error({ message: "Bạn cần đăng nhập để thực hiện chức năng này!" })
    } else {
      try {
        const apiURL = `/api/cart/add`;
        const { data } = await axios.post(`${apiURL}`, {
          article: get(article, 'id', 0)
        });
        notification.success({ message: "Add to cart successful!" });
      } catch (err) {
        notification.error({
          message: err
            ? get(err, "response.data.message", "Loi day")
            : "Error!",
        });
      }
    }

  }

  const gotoPayment = () => {
    if (!get(props, 'sessionId', '')) {
      notification.error({ message: "Bạn cần đăng nhập để thực hiện chức năng này!" })
    } else {
      router.push(`/payment/${get(article, 'id', 0)}`)
    }
  }

  return (
    <div className="min-h-screen">
      <Header
        isAdmin={get(props, "user.role", 0) === 1 ? true : false}
        signined={get(props, "sessionId", "") ? true : false}
      />
      <Row className="justify-center mt-10">
        <Col md={18}>
          <div>
            <div>
              <Title className="text-center" level={3}>
                {get(article, "title", "")}
              </Title>
            </div>
            <div>
              <Title level={5}>Abstract</Title>
              <Text>{get(article, "abstract", "")}</Text>
            </div>
          </div>
          {!showPdf && !isEmpty(pdf) ? (
            <Button onClick={handleAccess}>Read PDF</Button>
          ) : !isEmpty(pdf) ? (
            <div>
              {get(pdf, "permission") === 3 ? (
                <b>Password: {password}</b>
              ) : (
                <div className="flex flex-row justify-end gap-10 my-5">
                  <Button onClick={gotoPayment}>
                    Cập nhật quyền với bài báo
                  </Button>
                  <Button onClick={handleAddToCard} icon={<ShoppingCartOutlined />}>Thêm vào giỏ hàng</Button>
                </div>
              )}
              {get(pdf, "permission", 0) ? (
                <Worker workerUrl="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
                  <div
                    style={{
                      height: "720px",
                      marginBottom: "100px",
                    }}
                  >
                    <Viewer
                      fileUrl={pdfUrl}
                      plugins={[defaultLayoutPluginInstance]}
                      onDocumentAskPassword={handleAskPassword}
                      renderPage={renderPage}
                      transformGetDocumentParams={(
                        options: PdfJs.GetDocumentParams
                      ) => {
                        return Object.assign({}, options, {
                          disableRange: false,
                          disableStream: true,
                        });
                      }}
                    />
                  </div>
                </Worker>
              ) : null}
            </div>
          ) : (
            <div>Article is not exist!</div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Article;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session)
    return {
      props: {
        sessionId: session.id,
        user: session.user
      },
    };
  return {
    props: {},
  };
}
