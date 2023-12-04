import { createRouter, expressWrapper } from "next-connect";
import onError from "../../../middleware/errors";
import {
  getCustomerById,
} from "../../../controllers/CustomerController";
import { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getCustomerById)

const handler = router.handler({
  onError: onError,
});

export default handler;
