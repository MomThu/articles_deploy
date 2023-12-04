import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import crypto from "crypto";
import { GetServerSideProps } from "next";
import { get } from "lodash";

import {
  DocumentAskPasswordEvent,
  PdfJs,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";

import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const Pdf: any = ({ pdf }) => {
  const canvasRef = useRef(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const decrypt = (encryptedText, key, iv) => {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  };

  const getPdf = async () => {
    try {
      const key = "12345612345612345612345612345612";
      const realPassword = decrypt(
        get(pdf, "encryptedPassword", ""),
        key,
        get(pdf, "iv_value", "")
      );
      return realPassword;
    } catch (err) {}
  };

  const handleAskPassword = (e: DocumentAskPasswordEvent) => {
    try {
      // const key = "12345612345612345612345612345612";
      // const realPassword = decrypt(
      //   get(pdf, "encryptedPassword", ""),
      //   key,
      //   get(pdf, "iv_value", "")
      // );
      e.verifyPassword('password');
    } catch (err) {
      
    }
  };

  useEffect(() => {
    getPdf();
  }, []);
  return (
    <div>
      <div>Abstract: {get(pdf, "article.abstract", "")}</div>
      {get(pdf, "permission", 0) === 1 ? (
        <div>Read</div>
      ) : get(pdf, "permission", 0) === 2 ? (
        <div>Print</div>
      ) : get(pdf, "permission", 0) === 3 ? (
        <div>Download</div>
      ) : (
        <div>None</div>
      )}
      {/* <canvas ref={canvasRef}></canvas> */}
      {/* <div>
        <Document
          file={"pdfviewer.pdf"}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <p>Page {pageNumber} of {numPages}</p>
      </div> */}
      <Worker workerUrl="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js">
        <div
          style={{
            height: "100%",
          }}
        >
          <Viewer
            fileUrl="https://pdfarticlebucket.s3.ap-southeast-1.amazonaws.com/3441baacf45c543bdce486c13"
            plugins={[defaultLayoutPluginInstance]}
            onDocumentAskPassword={handleAskPassword}
            transformGetDocumentParams={(options: PdfJs.GetDocumentParams) => {
              return Object.assign({}, options, {
                disableRange: false,
                disableStream: true,
              });
            }}
          />
        </div>
      </Worker>
    </div>
  );
};

export default Pdf;


