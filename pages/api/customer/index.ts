import { createRouter, expressWrapper } from "next-connect";
import onError from "../../../middleware/errors";
import {
  getAllCustomers,
  register,
} from "../../../controllers/CustomerController";
import { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();
router.get(getAllCustomers);
router.post(register);

const handler = router.handler({
  onError: onError,
});

export default handler;
