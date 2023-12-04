import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import onError from "../../../middleware/errors";
import { getCartsByCus } from "../../../controllers/CartController";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getCartsByCus);

const handler = router.handler({
  onError: onError,
});

export default handler;
