import { toNumber } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { ArticleRepository } from "../services";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const getAllArticles = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const pageSize = Number(req.query.pageSize);
    const currentPage = Number(req.query.currentPage);
    let { data, totalArticles } = await ArticleRepository.getAllArticle(
      currentPage,
      pageSize
    );
    res.status(200).json({
      error: false,
      data: data,
      total: totalArticles,
    });
  } catch (err) {
    throw err;
  }
};

const getArticleById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const articleId = req.query.id;
    let data = await ArticleRepository.findByPk(toNumber(articleId));
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const searchArticle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const keyword = req.query.keyword;
    const pageSize = Number(req.query.pageSize);
    const currentPage = Number(req.query.currentPage);
    let { data, totalArticles } = await ArticleRepository.searchArticle(
      keyword,
      currentPage,
      pageSize
    );
    res.status(200).json({
      error: false,
      data: data,
      total: totalArticles,
    });
  } catch (err) {
    throw err;
  }
};

const searchBoughtArticle = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    const keyword = req.query.keyword;
    const pageSize = Number(req.query.pageSize);
    const currentPage = Number(req.query.currentPage);
    let { data, totalArticles } = await ArticleRepository.searchBoughtArticle(
      cusId,
      keyword,
      currentPage,
      pageSize
    );
    res.status(200).json({
      error: false,
      data: data,
      total: totalArticles,
    });
  } catch (err) {
    throw err;
  }
};

const getBoughtArticle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    const pageSize = Number(req.query.pageSize);
    const currentPage = Number(req.query.currentPage);    
    let { data, totalArticles } = await ArticleRepository.getArticleBought(
      cusId,
      currentPage,
      pageSize
    );
    res.status(200).json({
      error: false,
      data: data,
      total: totalArticles,
    });
  } catch (err) {
    throw err;
  }
};

const getArticleByAuthor = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { author } = req.query;
    let data = await ArticleRepository.getArticleByAuthor(author);
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const getPermissionArticle = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { article } = req.query;
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    let data = await ArticleRepository.getPermissionArticle(cusId, article);
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const getArticleByPermission = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { permission } = req.query;
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    let data = await ArticleRepository.getArticleByPermission(
      cusId,
      permission
    );
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const updateArticlePermission = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { permission, article } = req.body;
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    if (!cusId) {
      res.status(401).json({
        error: true,
        message: "You need to login for payment action!",
      });
    }
    let data = await ArticleRepository.updateArticlePermission(
      cusId,
      article,
      permission
    );
    res.status(200).json({
      error: false,
      message: "Buy successfully!",
    });
  } catch (err) {
    throw err;
  }
};

const addArticle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let article = req.body;
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    const role = session?.user.role;
    if (!cusId || role !== 1) {
      res.status(401).json({
        error: true,
        message: "You are not authorized!",
      });
    } else {
      let data = await ArticleRepository.addArticle(article);
      if (data?.error) {
        res.status(500).json({
          error: false,
          message: data?.message,
        });
      } else {
        res.status(200).json({
          error: false,
          message: "Upload Successful!",
        });
      }
    }
  } catch (err) {
    throw err;
  }
};

export {
  getAllArticles,
  getArticleByAuthor,
  getArticleById,
  getArticleByPermission,
  getPermissionArticle,
  searchArticle,
  updateArticlePermission,
  addArticle,
  searchBoughtArticle,
  getBoughtArticle,
};
