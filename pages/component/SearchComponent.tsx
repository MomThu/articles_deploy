import { AudioOutlined } from "@ant-design/icons";
import { Col, Row, Typography, Image, Input, notification } from "antd";
import axios from "axios";
import { get, size } from "lodash";
import React, { useEffect, useState } from "react";

const SearchComponent = ({ setKeyword, isAdmin }) => {
  const apiURL = `/api/article`;

  const handleSearch = (value) => {
    setKeyword(value);
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        {!isAdmin && (
          <Row justify="center" className="justify-center">
            <Col md={20}>
              <img src="/article.png" alt="banner image" />
            </Col>
          </Row>
        )}

        <Row justify="center" className="mt-5 flex">
          <Col md={12} xs={20}>
            <Input.Search
              placeholder="Search articles by title, abstract..."
              size="large"
              onSearch={handleSearch}
              allowClear
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SearchComponent;
