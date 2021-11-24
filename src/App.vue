<template>
  <v-app>
    <v-main>
      <YearMakeModel />
    </v-main>
  </v-app>
</template>

<script>
import YearMakeModel from "./components/YearMakeModel";

export default {
  name: "App",

  components: {
    YearMakeModel,
  },

  data: () => ({
    //
  }),
};
</script>
