<template>
  <div>
    <date-picker v-model="now" />
  </div>
</template>

<script>
import DatePicker from "@/components/DatePicker";

export default {
  name: "Exemple",
  components: { DatePicker },
  data() {
    return {
      now: new Date()
    };
  }
};
</script>

<style scoped></style>
