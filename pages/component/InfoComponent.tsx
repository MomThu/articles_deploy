import { CaretDownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Typography } from 'antd';
import { isEmpty } from 'lodash';
import { getServerSession } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FaUser, FaUserEdit } from 'react-icons/fa';
import { authOptions } from '../api/auth/[...nextauth]';

const { Text } = Typography;
type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  key: React.Key,
  label: React.ReactNode,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return { key, icon, children, label, type } as MenuItem;
};

const InfoSystem = () => {      
  const router = useRouter();

  const handleLogout = useCallback((): void => {
    Modal.confirm({
      title: "Xác nhận",
      okText: "Đồng ý",
      autoFocusButton: null,
      content: "Bạn có chắc muốn đăng xuất ?",
      onOk: () => signOut({ callbackUrl: "/" }),
    });
  }, []);

  const gotoProfile = () => {
    router.push("/user")
  }

  const gotoChangePassword = () => {
    router.push("/auth/changepassword")
  }

  const gotoBought = () => {
    router.push("/article/bought")
  }

  const items = useMemo(
    (): MenuItem[] => [
      getItem(
        'dropdown-profile',
        <Text className="font-medium hover:text-primary" onClick={gotoProfile}>
          <FaUser className="mr-2" />
          Thông tin cá nhân
        </Text>
      ),
      getItem(
        'dropdown-post',
        <Text className="font-medium hover:text-primary" onClick={gotoBought}>
          <FaUser className="mr-2" />
          Bài báo đã mua
        </Text>
      ),
      getItem(
        'dropdown-change-password',
        <Text className="font-medium hover:text-primary" onClick={gotoChangePassword}>
          <FaUserEdit className="mr-2" />
          Đổi mật khẩu
        </Text>
      ),
      getItem(
        'dropdown-logout',
        <Text className="font-medium hover:text-primary" onClick={handleLogout}>
          <LogoutOutlined className="mr-2" />
          Logout
        </Text>
      ),
    ],
    [gotoProfile, gotoChangePassword, handleLogout, gotoBought]
  );

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight">
        <UserOutlined className="text-white hover:text-sky-700" />
      </Dropdown>
    </>
  );
};

export default InfoSystem;
