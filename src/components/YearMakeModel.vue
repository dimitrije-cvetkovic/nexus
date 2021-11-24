<template>
<v-container fluid class="fill-height" :style="{background: $vuetify.theme.themes['light'].background}">
        <v-row class="text-center" justify="center" align="center">
          <v-card
            elevation="8"
            bordered
            outlined
            :loading="loading"
            class="mx-auto"
            max-width="500"
          >
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-card-title>Get an instant quote or call now!</v-card-title>
            <v-autocomplete
              v-model="selectedYear"
              :items="years"
              :search-input.sync="search"
              cache-items
              class="mx-4"
              flat
              hide-no-data
              hide-details
              label="Year"
              @click="getAllVehiclesYears()"
            ></v-autocomplete>
            <v-autocomplete
              v-model="selectedMake"
              :disabled="!yearsSearchedAlready"
              :items="makes"
              :search-input.sync="searchMake"
              cache-items
              class="mx-4"
              flat
              :no-data-text="makes.length == 0 ? 'There are no makes for this search' : 'Type at least one letter to start searching' "
              hide-details
              label="Make"
            ></v-autocomplete>
            <v-autocomplete
              v-model="selectedModel"
              :disabled="!yearsSearchedAlready || !selectedMake"
              :items="models"
              :search-input.sync="searchModel"
              class="mx-4 mb-4"
              flat
              :no-data-text="makes.length > 0 && models.length == 0 ? 'There are no models for this year and make' : 'Type at least one letter to start searching' "
              hide-details
              label="Model"
            ></v-autocomplete>
            <v-btn class="px-xl mb-4" @click="showVehicleDetails()" :disabled="!selectedModel">Vehicle Details</v-btn>
            <v-alert
              v-model="alert"
              v-if="selectedModelDescription"
              class="ma-3 mt-0"
              color="deep-purple"
              dark
            >
              <div class="text-h6">
                <p><span>Model:</span> <b>{{selectedModelDescription.model}}</b></p>
                <p><span>Original Model:</span> <b>{{selectedModelDescription.original_model}}</b></p>
                <p><span>Vehicle Type:</span> <b>{{selectedModelDescription.vehicle_type}}</b></p>
                <p><span>Body Type:</span> <b>{{selectedModelDescription.body_type}}</b></p>
                <p><span>Type:</span> <b>{{selectedModelDescription.type}}</b></p>
                <p><span>Vehicle Id:</span> <b>{{selectedModelDescription.vehicle_id}}</b></p>
              </div>
            </v-alert>
          </v-card>

        </v-row>
</v-container>
</template>

<script>
export default {
  name: "YearMakeModel",

  data: () => ({
    loading: false,
    years: [],
    search: null,
    selectedYear: null,
    yearsSearchedAlready: null,
    searchMake: null,
    selectedMake: null,
    makes: [],
    searchModel: null,
    selectedModel: null,
    modelsDescriptions: [],
    alert: false
  }),
    watch: {
      search (val) {
        val && val !== this.selectedYear && this.searchYearsAPI(val)
      },
      selectedYear () {
        this.clearMakes();
        this.clearModels();
        this.searchMakeAPI('')
      },
      searchMake (val) {
        val && val !== this.selectedMake && this.searchMakeAPI(val)
      },
      selectedMake () {
        this.clearModels();
        this.searchModelsAPI('');
      },
      searchModel (val) {
        val && val !== this.selectedModel && this.searchModelAPI(val)
      }
    },
    computed: {
      selectedModelDescription () {
        return this.selectedModel ? this.modelsDescriptions.find(fullModel => 
          fullModel.year == this.selectedYear && 
          fullModel.make === this.selectedMake &&
          fullModel.model === this.selectedModel) : null
      },
      models() {
        debugger;
        return this.modelsDescriptions.length > 0 ? this.modelsDescriptions.map(x => x.model) : []
      }
    },
    methods: {
      clearMakes() {
        this.selectedMake = null;
        this.makes = [];
      },
      clearModels() {
        this.selectedModel = null;
        this.modelsDescriptions = [];
        this.alert = false;
      },
      getAllVehiclesYears() {
        this.searchYearsAPI('');
      },
      searchYearsAPI (v) {
        this.loading = true
        if(!this.yearsSearchedAlready) {
          this.$axios.get('https://rateengine.ship.cars/v2/vehicles/years/?token=5cbe12fb62f4941267d623499a2a4fd5948fd3ef')
              .then(response => {
                  if (response.status == 200) {
                        this.yearsSearchedAlready = response.data.map(x => x.year);
                        this.years = response.data.map(x => x.year).filter(year => {
                          //return (year || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
                          return (year || '').toString().startsWith(v)
                        }).map(x => x.toString())
                  }
                  this.loading = false
              })
              .catch((e) => {
                  console.error(e.message);
                  console.error(e.request);
                  this.loading = false
              });
        }
        else {
          this.years = this.yearsSearchedAlready.filter(year => {
            return (year || '').toString().startsWith(v)
          }).map(x => x.toString())
          this.loading = false
        }
      },
      searchMakeAPI (v) {
        this.loading = true
        this.$axios.get(`https://rateengine.ship.cars/v2/vehicles/makes/?year=${this.selectedYear}&token=5cbe12fb62f4941267d623499a2a4fd5948fd3ef`)
            .then(response => {
                if (response.status == 200) {
                      this.makes = response.data.map(x => x.make).filter(make => {
                        return (make || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
                      })
                }
                this.loading = false
            })
            .catch((e) => {
                console.error(e.message);
                console.error(e.request);
                this.loading = false
            });
      },
      searchModelsAPI (v) {
        this.loading = true
        const $self = this;
        this.$axios.get(`https://rateengine.ship.cars/v2/vehicles/models/?year=${this.selectedYear}&make=${this.selectedMake}&token=5cbe12fb62f4941267d623499a2a4fd5948fd3ef`)
            .then(response => {
                if (response.status == 200) {
                      //I am doing this filtering again on the client side, because server side returns more years than it should!
                      //e.g. year=2022 and make = Acura -> both 2021 and 2022 are returned
                      $self.modelsDescriptions = response.data.filter(fullModel => 
                        fullModel.year == $self.selectedYear && 
                        fullModel.make === $self.selectedMake &&
                        (fullModel.model || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1);
                }
                $self.loading = false
            })
            .catch((e) => {
                console.error(e.message);
                console.error(e.request);
                this.loading = false
            });
      },
      showVehicleDetails() {
        this.alert = true
      }
    // getAllVehiclesYears() {
    //         this.$axios.get('https://rateengine.ship.cars/v2/vehicles/years/?token=5cbe12fb62f4941267d623499a2a4fd5948fd3ef')
    //             .then(response => {
    //                 if (response.status == 200) {
    //                   debugger;
    //                     if (!response.data) {
    //                         //(response.data.data);
    //                     }
    //                 }
    //             })
    //             .catch((e) => {
    //                 console.error(e.message);
    //                 console.error(e.request);
    //             });
      /* FOR SOME REASON PROXY FOR rateengine.ship.cars is not working, while easily working on other apis (e.g. https://api.github.com/)
            // this.$axios.get(
            //               '/api/v2/vehicles/years/',
            //               {
            //                 params: {
            //                   token:JSON.stringify('5cbe12fb62f4941267d623499a2a4fd5948fd3ef')
            //                 }
            //               }
            //           )
            //           .then(response => {
            //               if (response.status == 200) {
            //                 debugger;
            //                   if (!response.data) {
            //                       //(response.data.data);
            //                   }
            //               }
            //           })
            //           .catch((e) => {
            //               console.error(e.message);
            //               console.error(e.request);
            //           });
      */
    //}
  }
};
</script>
