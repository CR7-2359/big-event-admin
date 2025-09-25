<script setup>
import {articleChannelService} from '@/api/article'
import {ref,defineEmits,defineProps} from 'vue'
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null
  }
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async ()=>{
  const res = await articleChannelService()
  channelList.value = res.data.data
}
getChannelList()
</script>


<template>
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option
     v-for="(item) in channelList"
     :key="item.id"
     :label="item.cate_name"
     :value="item.id"
    >
    </el-option>

  </el-select>
</template>
