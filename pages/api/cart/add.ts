import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import onError from "../../../middleware/errors";
import { addToCart } from "../../../controllers/CartController";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.post(addToCart);

const handler = router.handler({
  onError: onError,
});

export default handler;
