<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <v-toolbar-title class="headline text-uppercase">
                <span>PolyCalc</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <span class="health-helper" v-if="topValueShow">{{localTopBarValue}}</span>

            <v-spacer></v-spacer>

            <div class="dark-light-icon">
                <v-icon v-if="$vuetify.theme.dark">mdi-weather-night</v-icon>
                <v-icon v-if="!$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
            </div>
            <v-switch class="dark-light-switch" v-model="$vuetify.theme.dark" color="secondary"></v-switch>
            <v-btn class="github-link" href="https://github.com/danhogan/polycalc" target="_blank" text>
                <span class="mr-2">Github</span>
                <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <router-view @topBarValue="topValueChange" @showTopBar="topValueToggle" @hideTopBarMessage="hideBarTrigger"></router-view>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",
    data() {
        return {
            localTopBarValue: 10,
            topValueShow: false
        };
    },
    methods: {
        topValueChange(newValue){
            this.localTopBarValue = newValue;
        },
        topValueToggle(health){
            this.localTopBarValue = health;
            this.topValueShow = true;
        },
        hideBarTrigger(){
            this.topValueShow = false;
        }
    }
};
</script>

<style lang="scss" scoped>
    #app .dark-light-switch {
        padding-top: 1.5em;
    }

    #app .col {
        padding-top: 0;
    }

    .dark-light-icon {
        margin-right: 1em;
        padding-top: 0.25em;
    }

    @media only screen and (max-width: 600px) {
        .github-link, .dark-light-icon {
            display: none;
        }
    }
</style>
