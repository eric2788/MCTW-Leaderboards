import Vue from 'vue'
import Vuetify, {VTextField, VIcon} from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
    iconfont: 'md' || 'fa5',
    components: {VTextField, VIcon}
});
