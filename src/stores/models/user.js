import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token
    const UserInfo = ref({})
    const setToken = (t) => (token.value = t) // 设置 token

    const removeToken = () => {
      token.value = ''
    }

    const getUserInfo = async () => {
      const res = await userGetInfoService()
      UserInfo.value = res.data.data
    }

    const setUserInfo = (obj) => {
      UserInfo.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      getUserInfo,
      UserInfo,
      setUserInfo,
    }
  },
  {
    persist: true, // 持久化
  },
)
