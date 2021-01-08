<template>
  <div v-click-outside class="_calendar">
    <label>
      <input type="text" :value="formatDate" />
    </label>

    <div class="pannel" v-if="isVisible">
      <div class="pannel-nav">
        <span @click="preYear">&lt;</span>
        <span @click="preMonth">&lt;&lt;</span>
        <span>{{ time.year }}年</span>
        <span>{{ time.month + 1 }}月</span>
        <span @click="nextMonth">&gt;&gt;</span>
        <span @click="nextYear">&gt;</span>
      </div>
      <div class="pannel-content">
        <div class="days">
          <span v-for="i in weekDays" class="cell" :key="i">{{ i }} </span>
          <div v-for="i in 6" :key="i">
            <span
              v-for="j in 7"
              :key="j"
              class="cell cell-day"
              @click="chooseDate(visibeDays[(i - 1) * 7 + (j - 1)])"
              :class="[
                {
                  noCurrentMonth: !isCurrentMonth(
                    visibeDays[(i - 1) * 7 + (j - 1)]
                  )
                },
                { today: isToDay(visibeDays[(i - 1) * 7 + (j - 1)]) },
                { select: isSelect(visibeDays[(i - 1) * 7 + (j - 1)]) }
              ]"
            >
              {{ visibeDays[(i - 1) * 7 + (j - 1)].getDate() }}
            </span>
          </div>
        </div>
      </div>
      <div class="pannel-footer"></div>
    </div>
  </div>
</template>

<script>
import { getDate, getYearMonthDay } from "@/utils/date";

export default {
  name: "Dateicker",
  props: {
    value: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    let { year, month } = getYearMonthDay(this.value);
    return {
      weekDays: ["日", "一", "二", "三", "四", "五", "六"],
      time: { year, month },
      isVisible: false
    };
  },
  computed: {
    visibeDays() {
      const DAY = 60 * 60 * 1000 * 24;
      // 先获取当前是周几
      let { year, month } = getYearMonthDay(
        getDate(this.time.year, this.time.month, 1)
      );
      // 获取当前月份的第一天
      let currentFirstDay = getDate(year, month, 1);
      // 获取当前是周几 ，把天数向前移动对应的天数
      let week = currentFirstDay.getDay();
      let startDay = currentFirstDay - week * DAY;
      // 循环42天
      let arr = [];
      for (let i = 0; i < 42; i++) {
        arr.push(new Date(startDay + i * DAY));
      }
      return arr;
    },
    formatDate() {
      let { year, month, day } = getYearMonthDay(this.value);
      return `${year}-${month + 1}-${day}`;
    }
  },
  methods: {
    focus() {
      this.isVisible = true;
    },
    blur() {
      this.isVisible = false;
    },
    isCurrentMonth(date) {
      let { year, month } = getYearMonthDay(new Date());
      let { year: y, month: m } = getYearMonthDay(date);
      return year === y && month === m;
    },
    isToDay(date) {
      let { year, month, day } = getYearMonthDay(new Date());
      let { year: y, month: m, day: d } = getYearMonthDay(date);
      return year === y && month === m && day === d;
    },
    chooseDate(date) {
      this.time = getYearMonthDay(date);
      this.$emit("input", date);
    },
    isSelect(date) {
      let { year, month, day } = getYearMonthDay(this.value);
      let { year: y, month: m, day: d } = getYearMonthDay(date);
      return year === y && month === m && day === d;
    },
    preMonth() {
      // 获取当年的年月
      let d = getDate(this.time.year, this.time.month, 1);
      d.setMonth(d.getMonth() - 1);
      this.time = getYearMonthDay(d);
    },
    nextMonth() {
      // 获取当请的年月
      let d = getDate(this.time.year, this.time.month, 1);
      d.setMonth(d.getMonth() + 1);
      this.time = getYearMonthDay(d);
    },
    preYear() {
      let d = getDate(this.time.year, this.time.month, 1);
      d.setFullYear(d.getFullYear() - 1);
      this.time = getYearMonthDay(d);
    },
    nextYear() {
      let d = getDate(this.time.year, this.time.month, 1);
      d.setFullYear(d.getFullYear() + 1);
      this.time = getYearMonthDay(d);
    }
  },
  directives: {
    clickOutside: {
      bind(el, bindings, vnode) {
        let handler = e => {
          if (el.contains(e.target)) {
            if (vnode.context.isVisible === false) {
              vnode.context.focus();
            }
          } else {
            if (vnode.context.isVisible === true) {
              vnode.context.blur();
            }
          }
        };
        el.handler = handler;
        document.addEventListener("click", handler);
      },
      unbind(el) {
        document.removeEventListener("click", el.handler);
      }
    }
  }
};
</script>

<style scoped lang="scss">
._calendar {
  position: relative;
  user-select: none;
  .pannel {
    width: 32 * 7px;
    position: absolute;
    margin: auto;
    background-color: #fff;
    box-shadow: 2px 2px 8px 2px rgba(0, 0, 0, 0.3);
    .pannel-nav {
      width: 100%;
      height: 30px;
      display: inline-flex;
      justify-content: space-around;
      align-items: center;
    }
    .pannel-content {
      .cell {
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        &.cell-day:hover {
          border: 1px solid #42b983;
          border-radius: 4px;
        }
        &.noCurrentMonth {
          color: grey;
        }
        &.today {
          background-color: #00eaff;
          color: #fff;
          border-radius: 4px;
        }
        &.select {
          border: 1px solid #42b983;
          border-radius: 4px;
        }
      }

      .pannel-footer {
        height: 30px;
      }
    }
  }
}
</style>
