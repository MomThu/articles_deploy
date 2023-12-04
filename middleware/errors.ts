import { NextApiRequest, NextApiResponse } from "next";

const onError = async (
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse,
//   next: () => void
) => {
  res.status(500).end(error.toString());
//   next();
};

export default onError;
