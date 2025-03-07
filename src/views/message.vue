<template>
  <div class="message-container">
    <div class="message-item-icon">
      <img src="../assets/images/check-icon.png" class="status-icon" />
      <h2>Payment failed</h2>
      <h4>
        <p>Please wait for the process</p>
        <p>finish,lt'll take minutess</p>
      </h4>
    </div>
    <div class="message-list">
      <div class="message-list-text">
        <span>Order ID</span>
        <span>ORDERU</span>
      </div>
      <div class="message-list-text">
        <span>Amount</span>
        <span>PKR 1.00</span>
      </div>
      <div class="message-list-text">
        <span>Wallet account</span>
        <span>2343xxxx7890</span>
      </div>
      <div class="message-list-text">
        <span>CNIC</span>
        <span>192939192</span>
      </div>
      <div class="message-list-text">
        <span>Date</span>
        <span>Jan 25，2023 17:00</span>
      </div>
      <div class="message-list-text">
        <span>Reference</span>
        <span>6421</span>
      </div>
    </div>
    <div class="message-state">State</div>
    <ul class="message-state-list">
      <li>Repayment has been submitted</li>
      <li class="error-state">Wait for processing（About 1-3 minutes）</li>
      <li class="error-state">Go back to your app and check ststus</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getstatus } from "@/api/api";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const orderState = ref({});
const orderId = router.currentRoute.value.params.orderId;

// 获取订单状态
getstatus(orderId).then((res) => {
  if (res.data.status === 200) {
    orderState.value = res.data.data;
  }
});
</script>

<style lang="scss" scoped>
.message-container {
  padding: 0.4rem;

  .message-item-icon {
    display: flex;
    flex-direction: column;
    align-items: center;

    .status-icon {
      width: 3rem;
      height: 2.7rem;
    }

    h2 {
      font-weight: 500;
      font-size: 0.5rem;
      color: #2258b0;
      line-height: 0.7rem;
      margin-bottom: 0.8rem;
    }

    h4 {
      font-weight: 500;
      font-size: 0.28rem;
      color: rgba(0, 0, 0, 0.5);
      line-height: 0.4rem;
      text-align: center;
      margin-bottom: 0.8rem;
    }
  }

  .message-list {
    .message-list-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 0.8rem;

      span {
        font-weight: 500;
        font-size: 0.28rem;
        line-height: 0.4rem;

        &:first-child {
          color: #949494;
        }

        &:last-child {
          color: #2258b0;
          font-size: 0.26rem;
        }
      }
    }
  }

  .message-state {
    color: #2258b0;
    font-size: 0.28rem;
    margin: 0.4rem 0;
    text-align: center;
  }

  .message-state-list {
    li {
      position: relative;
      height: 0.4rem;
      line-height: 0.4rem;
      font-weight: 500;
      font-size: 0.28rem;
      color: #000000;
      list-style: none;
      padding-left: 0.5rem;
      background: url(../assets/images/correct.png) 0 0 no-repeat;
      background-size: 0.4rem 0.4rem;
      margin-bottom: 0.6rem;

      &::after {
        content: "";
        display: block;
        position: absolute;
        left: 0.2rem;
        top: 0.4rem;
        height: 0.55rem;
        border-left: 1px dashed #2258b0;
      }

      &.error-state {
        background: url(../assets/images/error.png) 0 0 no-repeat;
        background-size: 0.4rem 0.4rem;
        color: #ea4235;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
