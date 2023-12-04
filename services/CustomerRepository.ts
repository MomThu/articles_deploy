import { toNumber } from "lodash";
import { FindOptions } from "sequelize";
import { Customer } from "../connectDB";
import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export class CustomerRepository extends Customer {
  public static findAllRaw = async (options?: FindOptions) => {
    const datas = await Customer.findAll(options);
    return datas;
  };

  public static addCustomer = async (data: any) => {
    const checkCusExist = await Customer.findOne({
      where: { email: data?.email },
    });
    if (checkCusExist) {
      return {
        error: true,
        message: "Email already exist!",
      };
    }
    const encryptData = {
      ...data,
      password: await bcrypt.hash(data?.password, 10),
      role: 2,
    };
    try {
      const customer = await Customer.create(encryptData);
      return {
        error: false,
        message: "Create account scuccess!",
      };
    } catch (err) {
      return {
        error: true,
        message: "Create account failed!",
      };
    }
  };

  public static updateInfo: any = async (data: any) => {
    const customer = await Customer.findByPk(data?.id);
    if (customer) {
      await customer.update({
        ...data,
      });
      await customer.save();
      return {
        error: false,
        message: "Update successful!",
      };
    } else {
      return {
        error: true,
        message: "Account does not exist!",
      };
    }
  };

  public static resetPassword = async (
    cusId: string,
    password: string,
    resetString: string
  ) => {
    const customer = await Customer.findOne({
      where: {
        id: toNumber(cusId),
        reset: resetString,
      },
    });
    if (customer) {
      try {
        const passwordHash = await bcrypt.hash(password, 10);
        await customer.update({
          password: passwordHash,
        });
        await customer.save();
        return {
          error: false,
          message: "Update password failed!",
        };
      } catch (err) {
        console.log(err, "errrrr");
      }
    } else {
      return {
        error: false,
        message: "Account does not exist!",
      };
    }
  };

  public static changePassword = async (
    cusId: number,
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      const customer = await Customer.findOne({
        where: {
          id: cusId,
        },
      });
      if (customer && (await bcrypt.compare(oldPassword, customer?.password))) {
        try {
          const newPasswordHash = await bcrypt.hash(newPassword, 10);
          await customer.update({
            password: newPasswordHash,
          });
          await customer.save();
          return {
            error: false,
            message: "Update password success!",
          };
        } catch (err) {
          return {
            error: true,
            message: "Update password failed!",
          };
        }
      } else {
        return {
          error: true,
          message: "Mật khẩu không chính xác. Vui lòng thử lại!",
        };
      }
    } catch (err) {
      return {
        error: true,
        message: "Update password failed!",
      };
    }
  };

  private static generateResetString = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  public static sendEmailToResetPassword = async (
    data: string,
    redirectUri: string
  ) => {
    const customer = await Customer.findOne({
      where: { email: data },
    });
    try {
      const adminEmail = "articlethu@gmail.com";
      const password = "vanl rlye nepn smfd";
      const transport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: adminEmail,
          pass: password,
        },
      });

      // calculate data to include in email content
      const userId = customer.id;
      const resetString = this.generateResetString(10);
      await customer.update({
        reset: resetString,
      });
      await customer.save();
      const urlReset = `${redirectUri}?userId=${userId}&resetString=${resetString}`;

      await transport.sendMail(
        {
          to: customer.email,
          subject: "RETSET PASSWORD",
          text: "Plaintext version of the message",
          html: `<p>Visit the following link to reset your password <a target="_blank" href="${urlReset}">Rest password Proteam</a></p>`,
        },
        (error, info) => {
          console.log(error);
        }
      );
      return {
        error: false,
        message: "Please check your email to get new password!",
      };
    } catch (error) {
      return {
        error: true,
        message: "Can not send email",
      };
    }
  };

  public static login: any = async (data: any) => {
    const customer = await Customer.findOne({
      where: { email: data?.email },
    });
    if (
      customer &&
      (await bcrypt.compare(data?.password, customer?.password))
    ) {
      return {
        error: false,
        user: {
          id: customer?.id,
          email: customer?.email,
          full_name: customer?.full_name,
          role: customer?.role,
        },
        message: "Login successful!",
      };
    } else {
      return {
        error: true,
        message: "Email or password is incorrect!",
      };
    }
  };
}
