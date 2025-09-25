import request from '@/utils/request'

//分类：
//获取文章分类列表
export const articleChannelService = () => request.get('/my/cate/list')

//新增文章分类
export const articleAddChannelService = (data) => request.post('/my/cate/add', data)

//修改文章分类
export const articleEditChannelService = (data) => request.put('/my/cate/info', data)

//删除文章分类
export const articleDeletChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: {
      id,
    },
  })

//管理：
export const artGetListService = (params) => request.get('/my/article/list', { params })

//获取文章详细信息

export const articleGetDitailService = (id) => request.get('/my/article/info', { params: { id } })

//发布文章
export const artAddDtaiService = (data) => request.post('/my/article/add', data)
