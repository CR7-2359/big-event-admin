import request from '@/utils/request'

export const userRegisterServise = (username, password, repassword) => {
  return request.post('/api/reg', {
    username,
    password,
    repassword,
  })
}

export const userLoginServise = (username, password) => {
  return request.post('/api/login', {
    username,
    password,
  })
}
export const userGetInfoService = () => request.get('/my/userinfo')

export const userUpdateInfoService = (data) => request.post('/my/userinfo', data)
export const userUpdateAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })

//更新密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
