import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        themes: {
            light: {
                primary: colors.indigo.lighten1,
                secondary: colors.orange.darken2,
                accent: colors.shades.black,
                // error: colors.red.accent3,
            },
            dark: {
                primary: colors.indigo.darken4,
                secondary: colors.orange,
            },
        },
    },
});
