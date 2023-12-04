import { FindOptions, QueryTypes, Op } from "sequelize";
import {
  Article,
  ArticleAuthor,
  ArticlePermission,
  Author,
  Customer,
  Pdf,
} from "../connectDB";
import { get, size, uniq } from "lodash";

export class ArticleRepository extends Article {
  public static getAllArticle = async (
    currentPage?: number,
    pageSize?: number
  ) => {
    const datas = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
          // attributes: [""]
        },
      ],
    });
    const totalArticles = datas.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const resultArray = [];
    for (let i = 0; i < totalArticles; i++) {
      if (i >= startIndex && i < endIndex) {
        resultArray.push(datas[i]);
      }
    }
    return { data: resultArray, totalArticles: totalArticles };
  };

  public static findById = async (id: number) => {
    const datas = await Article.findByPk();
    const authors = await this.sequelize.query(
      `SELECT * FROM article_author JOIN authors ON article_author.author_id = authors.id WHERE article_author.article_id = ${id}`,
      { type: QueryTypes.SELECT }
    );
    return {
      ...datas,
      authors: authors,
    };
  };

  public static searchArticle = async (
    keyword?: string | string[],
    currentPage?: number,
    pageSize?: number
  ) => {
    const dataByTitle = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
        },
      ],
      where: {
        title: { [Op.like]: `%${keyword}%` },
      },
    });
    const dataByAbstract = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
        },
      ],
      where: {
        abstract: { [Op.like]: `%${keyword}%` },
      },
    });
    const dataByJournal = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
        },
      ],
      where: {
        journal_name: { [Op.like]: `%${keyword}%` },
      },
    });
    const dataByAuthor: any = await this.sequelize.query(
      `SELECT articles.* FROM authors 
      JOIN article_author ON authors.id = article_author.author_id 
      JOIN articles ON articles.id = article_author.article_id 
      WHERE authors.fullname LIKE '%${keyword}%'`,
      { type: QueryTypes.SELECT }
    );
    const dataSearch = dataByTitle
      .concat(dataByAbstract)
      .concat(dataByJournal)
      .concat(dataByAuthor);

    const uniqueArray = [];

    dataSearch.forEach((item) => {
      if (!uniqueArray.some((uniqueItem) => uniqueItem.id === item.id)) {
        uniqueArray.push(item);
      }
    });

    const totalArticles = uniqueArray.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const resultArray = [];
    for (let i = 0; i < totalArticles; i++) {
      if (i >= startIndex && i < endIndex) {
        resultArray.push(uniqueArray[i]);
      }
    }

    return { data: resultArray, totalArticles: totalArticles };
  };

  public static getArticleByAuthor = async (authorId: string | string[]) => {
    const articles = await this.sequelize.query(
      `SELECT * FROM article_author JOIN articles JOIN authors ON article_author.article_id = articles.id WHERE article_author.author_id = ${authorId}`,
      { type: QueryTypes.SELECT }
    );
    return articles;
  };

  public static getPermissionArticle = async (
    cusId: number,
    articleId: string | string[]
  ) => {
    const permissions = await this.sequelize.query(
      `SELECT * FROM article_permission WHERE article_permission.article_id = ${articleId} AND article_permission.customer_id = ${cusId}`,
      { type: QueryTypes.SELECT }
    );
    return permissions;
  };

  public static getArticleByPermission = async (
    cusId: number,
    permission: string | string[]
  ) => {
    const permissions = await this.sequelize.query(
      `SELECT * FROM article_permission JOIN articles ON article_permission.article_id = articles.id WHERE article_permission.type_of_permission = ${permission} AND article_permission.customer_id = ${cusId}`,
      { type: QueryTypes.SELECT }
    );
    return permissions;
  };

  public static getArticleBought = async (
    cusId: number,
    currentPage?: number,
    pageSize?: number
  ) => {
    const datas = await this.sequelize.query(
      `SELECT * FROM article_permission JOIN articles ON article_permission.article_id = articles.id WHERE article_permission.type_of_permission > 0 AND article_permission.customer_id = ${cusId}`,
      { type: QueryTypes.SELECT }
    );
    const allArticles = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
        },
      ],
    });
    const result = datas.map((item) => {
      for (let i = 0; i < allArticles.length; i++) {
        if (get(item, "article_id", 0) == allArticles[i]?.id) {
          return {
            ...item,
            author: allArticles[i]?.author,
          };
        }
      }
    });
    const totalArticles = result.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const resultArray = [];
    for (let i = 0; i < totalArticles; i++) {
      if (i >= startIndex && i < endIndex) {
        resultArray.push(result[i]);
      }
    }
    return { data: resultArray, totalArticles: totalArticles };
  };

  public static searchBoughtArticle = async (
    cusId: number,
    keyword?: string | string[],
    currentPage?: number,
    pageSize?: number
  ) => {
    const datas = await this.sequelize.query(
      `SELECT * FROM article_permission JOIN articles ON article_permission.article_id = articles.id WHERE article_permission.type_of_permission > 0 AND article_permission.customer_id = ${cusId}`,
      { type: QueryTypes.SELECT }
    );
    console.log(datas, "datas here");

    const dataByTitle = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
        },
      ],
      where: {
        title: { [Op.like]: `%${keyword}%` },
      },
    });
    const dataByAbstract = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
        },
      ],
      where: {
        abstract: { [Op.like]: `%${keyword}%` },
      },
    });
    const dataByJournal = await Article.findAll({
      include: [
        {
          model: Author,
          through: { attributes: [] },
        },
      ],
      where: {
        journal_name: { [Op.like]: `%${keyword}%` },
      },
    });
    const dataByAuthor: any = await this.sequelize.query(
      `SELECT articles.* FROM authors 
      JOIN article_author ON authors.id = article_author.author_id 
      JOIN articles ON articles.id = article_author.article_id 
      WHERE authors.fullname LIKE '%${keyword}%'`,
      { type: QueryTypes.SELECT }
    );
    const dataSearch = dataByTitle
      .concat(dataByAbstract)
      .concat(dataByJournal)
      .concat(dataByAuthor);

    const uniqueArray = [];

    dataSearch.forEach((item) => {
      if (!uniqueArray.some((uniqueItem) => uniqueItem.id === item.id)) {
        uniqueArray.push(item);
      }
    });

    const dataMap = datas.map((item) => {
      for (let i = 0; i < uniqueArray.length; i++) {
        if (get(item, "article_id", 0) == uniqueArray[i]?.id) {
          return {
            ...item,
            author: uniqueArray[i]?.author,
          };
        }
      }
    });

    const result = dataMap.filter((item) => item);

    const totalArticles = result.length;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const resultArray = [];
    for (let i = 0; i < totalArticles; i++) {
      if (i >= startIndex && i < endIndex) {
        resultArray.push(result[i]);
      }
    }

    return { data: resultArray, totalArticles: totalArticles };
  };

  public static updateArticlePermission = async (
    cusId: number,
    articleId: number,
    permission: string | string[]
  ) => {
    const articlePermission = await ArticlePermission.findOne({
      where: {
        customer_id: cusId,
        article_id: articleId,
      },
    });
    if (!articlePermission || !size(articlePermission)) {
      const articlePermission = await ArticlePermission.create({
        article_id: articleId,
        customer_id: cusId,
        type_of_permission: Number(permission),
      });
      return articlePermission;
    }
    const updatePermission = await ArticlePermission.update(
      { type_of_permission: Number(permission) },
      {
        where: {
          customer_id: cusId,
          article_id: articleId,
        },
      }
    );
    return updatePermission;
  };

  public static addArticle = async (article: any) => {
    const checkExist = await Article.findOne({
      where: {
        title: article?.title,
      },
    });

    if (!checkExist) {
      const t = await this.sequelize.transaction();
      try {
        const articleCreated = await Article.create(
          {
            title: article?.title,
            abstract: article?.abstract,
            publish_date: article?.publish_date,
            journal_name: article?.journal_name,
          },
          { transaction: t }
        );

        const pdfCreated = await Pdf.create(
          {
            article_id: articleCreated?.id,
            file_name: article?.file_name,
            password: article?.password,
          },
          { transaction: t }
        );

        await Promise.all(
          article?.author.map(async (id) => {
            try {
              const articleAuthor = await ArticleAuthor.create(
                {
                  article_id: articleCreated?.id,
                  author_id: id,
                },
                { transaction: t }
              );
            } catch (err) {
              console.log(err, "err here");
            }
          })
        );

        await t.commit();
        return {
          error: false,
          message: "Created Successful!",
        };
      } catch (error) {
        console.log(error, "vao day");

        await t.rollback();
        return {
          error: true,
          message: "Create article failed!",
        };
      }
    } else {
      return {
        error: true,
        message: "Article already exist!",
      };
    }
  };
}
