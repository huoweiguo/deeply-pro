<template>
  <div class="container-home">
    <h1 class="home-time">{{ expireTime }}</h1>
    <div class="home-time-description">Time remaining for payment</div>
    <div class="home-amount">
      <div class="home-amount-key">
        <p>Amount Payable:</p>
        <p>قابل ادائیگی رقم</p>
      </div>
      <div class="home-amount-value">PKR {{ orderInfo.amount }}</div>
    </div>
    <div class="recharge-change">
      <div class="recharge-text">
        <p>Select Channel</p>
        <p>چینل منتخب کریں۔</p>
      </div>
      <div class="recharge-selcet-item" :class="{ 'recharge-first': orderInfo.payMethod.length == 1 }">

        <template v-if="orderInfo.payMethod.length">
          <div class="recharge-selcet-item-icon" v-for="item in orderInfo.payMethod" :key="item.code"
            @click="form.code = item.code" :class="{ 'active-icon': form.code === item.code }">
            <img src="@/assets/images/jazzcash.png" alt="JAZZCASH" v-if="item.code === 'JAZZCASH'" />
            <img src="@/assets/images/easypaisa.png" alt="EASYPAISA" v-if="item.code === 'EASYPAISA'" />
            <img src="@/assets/images/radio_blue.png" class="checked-icon" alt="checked"
              v-if="item.code === form.code" />
            <img src="@/assets/images/radio_gray.png" class="checked-icon" alt="unchecked" v-else />
          </div>
        </template>
      </div>
    </div>
    <div class="recharge-change border-top-none">
      <div class="recharge-text">
        <p>Wallet Account Number</p>
        <p>والیٹ اکاؤنٹ نمبر</p>
      </div>
      <input type="text" class="recharge-input" v-model="form.acc" placeholder="03XXXXXXXXX" />
      <div class="contact_us">Contact us: <a
          href="mailto:thethirdoceanreport@gmail.com">thethirdoceanreport@gmail.com</a>
      </div>
    </div>
    <div class="error-msg-container">
      <div class="error-msg" v-if="errorStatus">Note: {{ showErrorMsg }}
      </div>
    </div>
    <!-- <div class="recharge-change border-top-none">
      <div class="recharge-text">
        <p>CNIC</p>
        <p></p>
      </div>
      <input type="text" class="recharge-input" placeholder="Enter your cnic number" />
    </div> -->
    <!-- <div class="contact-us">Contact us：xxxxxxx</div> -->
    <button class="recharge-btn" :class="{ 'disabled': loading == true }" :disabled="loading"
      @click="doSubmit">Submit</button>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from "vue";
import { getinfo, getstatus, submit } from "@/api/api";
import { useRouter } from "vue-router";
import { getRemainingTime } from "@/utils/tools";
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const errorMsg = ref('Account number must start with 03 and be exactly 11 digits long.');
const router = useRouter();
const errorStatus = ref(false);
const loading = ref(false);
const expireTime = ref('00:00');
const toast = useToast();
const timer = ref(null);
const time = ref(0);
const showErrorMsg = ref(errorMsg);
const orderInfo = ref({
  payMethod: [],
});


const orderId = router.currentRoute.value.params.sn || "";
const form = ref({
  sn: orderId,
  code: "",
  acc: "",
});

// 获取订单状态
getstatus(orderId).then((res) => {
  if (res.data.status === 200) {
    if (res.data.data.orderStatus !== 'PENDING') {
      router.push(`/message/${orderId}`);
    }
  }
});

// 获取支付方式
getinfo(orderId).then(async (res) => {
  if (res.data.status === 200) {
    orderInfo.value = res.data.data || {}
    if (orderInfo.value.payMethod.length) {
      form.value.code = orderInfo.value.payMethod[0]?.code
    }
  }
});

// 获取订单信息
getinfo(orderId).then((res) => {
  if (res.data.status === 200) {
    orderInfo.value = res.data.data || {}
    if (orderInfo.value.payMethod.length) {
      form.value.code = orderInfo.value.payMethod[0]?.code
    }
    // res.data.data.expTime * 1000 1741339066544
    clearInterval(timer.value);
    timer.value = setInterval(() => {
      let remaining = getRemainingTime(res.data.data.expTime * 1000);
      if (remaining.diff < 0) {
        clearInterval(timer.value);
      } else {
        expireTime.value = `${remaining.minutes}:${remaining.seconds}`;
      }
    }, 1000);
  }
});



onUnmounted(() => {
  clearInterval(timer.value);
});



const doSubmit = () => {
  const mobileExp = /^(03)[0-9]{9}$/;
  loading.value = true;
  errorStatus.value = false;
  if (!form.value.code) {
    showErrorMsg.value = "Please select a payment method";
    errorStatus.value = true;
    loading.value = false;
    return;
  }
  if (!form.value.acc) {
    showErrorMsg.value = "Please input Wallet Account Number";
    errorStatus.value = true;
    loading.value = false;
    return;
  }
  if (!mobileExp.test(form.value.acc)) {
    showErrorMsg.value = errorMsg.value;
    errorStatus.value = true;
    loading.value = false;
    return;
  }
  submit(form.value).then((res) => {
    loading.value = false;
    if (res.data.status == 200) {

      if (res.data.data.payLink) {
        window.location.href = res.data?.data?.payLink;
      } else {
        router.push(`/message/${orderId}`);
      }

    } else {
      showErrorMsg.value = res.data.msg
      errorStatus.value = true
      //toast.error(res.data.msg);
    }
  });
};
</script>

<style lang="scss">
.v-toast {
  font-size: 16px !important;
  bottom: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}
</style>

<style lang="scss" scoped>
.container-home {
  padding: 0.4rem;
  box-sizing: border-box;

  .contact_us {
    padding: 0.2rem 0;
    font-size: 0.28rem;
    color: #252525;
    font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
    font-weight: 500;

    a {
      color: #252525;
      text-decoration: none;
    }
  }

  .home-time {
    color: #ff0505;
    font-size: 0.55rem;
    font-weight: 500;
    line-height: 0.77rem;
    margin-bottom: 0.1rem;
    text-align: center;
    margin-top: 0.3rem;
  }

  .home-time-description {
    font-size: 0.33rem;
    text-align: center;
    margin-bottom: 0.4rem;
    line-height: 0.46rem;
    font-weight: 500;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  }

  .error-msg-container {
    height: 45px;
  }

  .error-msg {
    font-size: 0.26rem;
    color: #ff0505;
  }

  .home-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f0f5f9;
    border-radius: 0.08rem;
    padding: 0.4rem;
    margin-bottom: 0.4rem;

    .home-amount-key {
      display: flex;
      flex-direction: column;

      p {
        line-height: 0.4rem;

        &:first-child {
          font-size: 0.28rem;
          font-weight: 500;
          margin-bottom: 0.1rem;
        }

        &:last-child {
          font-weight: bold;
          font-size: 0.23rem;
          font-family: Geeza Pro Bold;
        }
      }
    }

    .home-amount-value {
      font-size: 0.5rem;
      line-height: 0.7rem;
      font-weight: 500;
    }
  }

  .recharge-change {
    padding-top: 0.4rem;
    border-top: 1px solid rgba(151, 151, 151, 0.2);

    .recharge-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;

      p {
        color: rgba(37, 37, 37, 0.8);

        &:first-child {
          font-size: 0.32rem;
          font-weight: 500;
        }

        &:last-child {
          font-size: 0.23rem;
          font-weight: bold;
          font-family: Geeza Pro Bold;
        }
      }
    }

    .recharge-selcet-item {
      display: flex;
      justify-content: space-between;

      .recharge-selcet-item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45%;
        height: 1.2rem;
        background-color: #f0f5f9;
        border: 1px solid #fff;

        img {
          height: 0.61rem;
          width: 0.77rem;
        }

        img.checked-icon {
          margin-left: 0.5rem;
          width: 0.35rem;
          height: 0.35rem
        }
      }
    }

    .recharge-first {
      justify-content: center !important;
    }

    .active-icon {
      background-color: #ffffff !important;
      box-shadow: 0px 0px 0.26rem -1px rgba(31, 92, 183, 0.4);
      border: 1px solid rgba(30, 95, 185, 0.5) !important;
    }

    .recharge-input {
      display: block;
      width: 100%;
      height: 0.7rem;
      border: 1px solid rgba(189, 189, 189, 0.4);
      padding: 0 0.1rem;
      box-sizing: border-box;
      outline: none;

      &:focus {
        box-shadow: 0px 0px 0.06rem 0.02rem rgba(31, 92, 183, 0.4);
        border: 1px solid rgba(30, 95, 185, 0.4);
      }
    }
  }

  .border-top-none {
    border-top: none !important;
  }

  .contact-us {
    color: rgba(37, 37, 37, 0.8);
    font-size: 0.28rem;
    margin-top: 0.16rem;
    margin-bottom: 0.95rem;
    font-weight: 600;
    line-height: 0.4rem;
  }

  .recharge-btn {
    background-color: #1296DB;
    color: #fff;
    height: 0.8rem;
    outline: none;
    border-radius: 0.4rem;
    border: none;
    width: 100%;
    font-size: 0.3rem;
    font-weight: 600;
  }

  .recharge-btn.disabled {
    background-color: #ccc;
  }
}
</style>
