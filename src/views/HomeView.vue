<template>
  <div class="container-home">
    <h1 class="home-time">28:18</h1>
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
      <div class="recharge-selcet-item">
        <div class="recharge-selcet-item-icon" :class="{ 'active-icon': form.code === orderInfo.payMethod[0].code }" @click="form.code = orderInfo.payMethod[0].code">
          <img src="@/assets/images/jazzcash.png" alt="jazzcash" />
        </div>
        <div class="recharge-selcet-item-icon" :class="{ 'active-icon': form.code === orderInfo.payMethod[1].code }" @click="form.code = orderInfo.payMethod[1].code">
          <img src="@/assets/images/easypaisa.png" alt="easypaisa" />
        </div>
      </div>
    </div>
    <div class="recharge-change border-top-none">
      <div class="recharge-text">
        <p>Wallet Account Number</p>
        <p>والیٹ اکاؤنٹ نمبر</p>
      </div>
      <input type="text" class="recharge-input" v-model="form.acc" placeholder="Enter your wallet account number" />
    </div>
    <div class="recharge-change border-top-none">
      <div class="recharge-text">
        <p>CNIC</p>
        <p></p>
      </div>
      <input type="text" class="recharge-input" placeholder="Enter your cnic number" />
    </div>
    <div class="contact-us">Contact us：xxxxxxx</div>
    <button class="recharge-btn" @click="doSubmit">Submit</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getinfo, submit } from "@/api/api";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const orderInfo = ref({
  payMethod: [],
});
const orderId = router.currentRoute.value.query.sn || "";
const form = ref({
  sn: orderId,
  code: "",
  acc: "",
});

// 获取订单信息
getinfo(orderId).then((res) => {
  if (res.data.status === 200) {
    orderInfo.value = res.data.data || {};
  }
});

const doSubmit = () => {
  loading.value = true;
  submit(form.value).then((res) => {
    loading.value = false;
    if (res.data.status == 200) {
      router.push(`/message/${orderId}`);
    } else {
      alert(res.data.msg);
    }
  });
};
</script>

<style lang="scss" scoped>
.container-home {
  padding: 0.4rem;
  box-sizing: border-box;

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

        img {
          height: 0.61rem;
          width: 0.77rem;
        }
      }
    }

    .active-icon {
      background-color: #ffffff !important;
      box-shadow: 0px 0px 0.26rem -1px rgba(31, 92, 183, 0.4);
      border: 1px solid rgba(30, 95, 185, 0.5);
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
    background-color: rgba(32, 50, 104, 0.5);
    color: #fff;
    height: 0.8rem;
    outline: none;
    border-radius: 0.4rem;
    border: none;
    width: 100%;
    font-size: 0.3rem;
    font-weight: 600;
  }
}
</style>
