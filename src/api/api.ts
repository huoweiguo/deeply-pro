import { POST } from '../utils/http.ts'

// 
const baseUrl = '/api';


// 提交支付信息
export const submit = (data: any) => POST(baseUrl+'/cashin/payment/submit', data)



// 获取订单状态
export const getstatus = (sn: string) => POST(baseUrl+'/cashin/payment/status', {sn})



// 获取订单信息
export const getinfo = (sn: string) => POST(baseUrl+'/cashin/payment/info', {sn})
