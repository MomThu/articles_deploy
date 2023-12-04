import React, { useEffect, useState } from "react";
import SearchComponent from "./SearchComponent";
import axios from "axios";
import { get, size } from "lodash";
import { Col, Empty, Pagination, Row, notification } from "antd";
import ArticleComponent from "./ArticleComponent";

const HomeComponent = ({ signined }) => {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalArticles, setTotalArticles] = useState(0);


  const apiURL = `/api/article`;

  const fetchNewData = async (keyword, currentPage, pageSize) => {
    try {
      if (size(keyword)) {
        const { data } = await axios.get(`${apiURL}/search`, {
          params: {
            keyword: keyword,
            currentPage: currentPage,
            pageSize: pageSize,
          }
        });
        console.log(data.data, "dataa");
        setArticles(get(data, "data", []));
        setTotalArticles(get(data, "total", 0));
      } else {
        const { data } = await axios.get(`${apiURL}`, {
          params: {
            currentPage: currentPage,
            pageSize: pageSize
          }
        });
        console.log(data.data, "dataa");
        setArticles(get(data, "data", []));
        setTotalArticles(get(data, "total", 0));
      }
    } catch (err) {
      notification.error({ message: err ? err : "Error!" });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setPageSize(10);
    fetchNewData(keyword, 1, 10);
  }, [keyword]);


  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    fetchNewData(keyword, page, size);
  };


  return (
    <div>
      <SearchComponent setKeyword={(data) => setKeyword(data)} isAdmin={false} />
      <div>
        {size(articles) ?
          articles.map((item, index) => (
            <Row style={{ padding: "10px" }} className="justify-center" key={item?.id}>
              <Col md={18}>
                <ArticleComponent item={item} role={signined ? 2 : 0} />
              </Col>
            </Row>
          )) : <div className="justify-center m-10">
            <Empty />
          </div>}
      </div>
      <div className="justify-center m-10">
        <Pagination 
          showSizeChanger
          current={currentPage}
          pageSize={pageSize}
          total={totalArticles}
          onChange={handlePageChange}
          />
      </div>

    </div>
  );
};

export default HomeComponent;
