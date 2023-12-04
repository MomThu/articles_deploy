import { message } from "antd";
import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { CustomerRepository } from "../services";
import { get, toNumber } from "lodash";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

const getAllCustomers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    let result = await CustomerRepository.findAll();
    res.status(200).json({
      error: false,
      data: result,
    });
  } catch (err) {
    throw err;
  }
};

const getCustomerById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cusId = req.query.id;
    let data = await CustomerRepository.findByPk(toNumber(cusId));
    data.password = "";
    res.status(200).json({
      error: false,
      data: data,
    });
  } catch (err) {
    throw err;
  }
};

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;
    const customer = await CustomerRepository.addCustomer({
      email: data?.email,
      full_name: data?.full_name,
      phone: data?.phone,
      password: data?.password,
    });
    if (customer?.error) {
      res.status(400).json({
        error: true,
        message: customer?.message,
      });
    }
    res.status(200).json({
      error: false,
      data: customer,
    });
  } catch (err) {
    throw err;
  }
};

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;
    const customer = await CustomerRepository.login({
      email: data?.email,
      password: data?.password,
    });
    if (customer?.error) {
      res.status(401).json({
        error: true,
        message: customer?.message,
      });
    }
    res.status(200).json({
      error: false,
      data: customer,
    });
  } catch (err) {
    throw err;
  }
};

const updateInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;
    const customer = await CustomerRepository.updateInfo({
      ...data,
    });
    if (customer?.error) {
      res.status(404).json({
        error: true,
        message: customer?.message,
      });
    }
    res.status(200).json({
      error: false,
      message: "Update successful!",
    });
  } catch (err) {
    throw err;
  }
};

// const forgetpassword = async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const { email } = req.body;
//     const customer = await CustomerRepository.findOne({
//       where: {
//         email: email,
//       },
//     });
//     res.status(200).json({
//       error: false,
//       message: "Update successful!",
//     });
//   } catch (err) {
//     res.status(404).json({
//       error: true,
//       message: err ? get(err, "message", "Error!") : "Error",
//     });
//   }
// };

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { cusId, password, resetString } = req.body;
    const customer = await CustomerRepository.resetPassword(
      cusId,
      password,
      resetString
    );
    if (customer?.error) {
      res.status(404).json({
        error: true,
        message: customer?.message,
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Reset successful!",
      });
    }
  } catch (err) {
    throw err;
  }
};

const forgetpassword = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;
    const customer = await CustomerRepository.sendEmailToResetPassword(
      data?.email,
      data?.redirectUri
    );
    if (customer?.error) {
      res.status(404).json({
        error: true,
        message: customer?.message,
      });
    }
    res.status(200).json({
      error: false,
      data: customer,
    });
  } catch (err) {
    throw err;
  }
};

const changePassword = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const cusId = session?.user.id;
    const { oldPassword, newPassword } = req.body;    
    const customer = await CustomerRepository.changePassword(
      cusId,
      oldPassword,
      newPassword
    );
    if (customer?.error) {
      res.status(404).json({
        error: true,
        message: customer?.message,
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Reset successful!",
      });
    }
  } catch (err) {
    throw err;
  }
};
export {
  getAllCustomers,
  getCustomerById,
  register,
  updateInfo,
  login,
  forgetpassword,
  resetPassword,
  changePassword
};
