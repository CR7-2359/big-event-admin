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
