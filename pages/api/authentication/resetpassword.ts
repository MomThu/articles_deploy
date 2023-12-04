import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { resetPassword } from "../../../controllers/CustomerController";
import onError from "../../../middleware/errors";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.post(resetPassword);

const handler = router.handler({
  onError: onError,
});

export default handler;
