import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { ArticleRepository, AuthorRepository } from "../services";
import { toNumber } from "lodash";

const getAllAuthors = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let result = await AuthorRepository.getAllAuthor();
    res.status(200).json({
      error: false,
      data: result,
    });
  } catch (err) {
    throw err;
  }
};

const getAuthorById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let authorId = req.query.id;
    let data = await AuthorRepository.findById(toNumber(authorId));
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const getAuthorsByArticle = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { article } = req.query;
    let data = await AuthorRepository.getAuthorByArticle(article);
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const searchAuthor = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const keyword = req.query.keyword;
    let data = await AuthorRepository.searchAuthor(keyword);
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const addAuthor = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const author = req.body;
    let data = await AuthorRepository.addAuthor(author);
    if (data?.error) {
      res.status(401).json({
        error: true,
        message: data?.message,
      });
    } else {
      res.status(200).json({
        error: false,
        data: data,
        message: "Create successful!",
      });
    }
  } catch (err) {
    throw err;
  }
};

export {
  getAllAuthors,
  getAuthorById,
  searchAuthor,
  getAuthorsByArticle,
  addAuthor,
};
