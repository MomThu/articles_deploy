import { toNumber } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { CartRepository } from "../services";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const getCartsByCus = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    let result = await CartRepository.getCartsByCusId(toNumber(cusId));
    res.status(200).json({
      error: false,
      data: {
        total: result.length,
        data: result,
      },
    });
  } catch (err) {
    throw err;
  }
};

const addToCart = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    const articleId = req.body.article;    
    let result = await CartRepository.addToCart(toNumber(cusId), toNumber(articleId));
    if (!result?.error) {
      res.status(200).json({
        error: false,
        message: result?.message
      });
    } else {
      res.status(400).json({
        error: false,
        message: result?.message
      });
    }
    
  } catch (err) {
    throw err;
  }
};

export { getCartsByCus, addToCart };
