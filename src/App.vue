<template>
    <v-app>
        <v-toolbar :class="style.toolbar" :dark="style.toolbar_dark" app>
            <v-toolbar-title class="headline">
                <span class="font-weight-bold">台灣創世神國度</span>
                <span class="font-weight-light"> - 百大排行榜</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="changePort" flat outline>刷新</v-btn>
        </v-toolbar>
        <v-content :class="style.content">
            <v-progress-linear :active="loading" :color="style.progress_color" class="ma-0" height="4px"
                               indeterminate></v-progress-linear>
            <v-container :pl-5="!isDestop" :pr-5="!isDestop" grid-list-md>
                <v-fab-transition v-if="!isDestop">
                    <v-speed-dial bottom fab
                                  fixed right transition="slide-y-reverse-transition" v-model="fab">
                        <v-btn
                                :color="style.represent_color"
                                :dark="style.represent_dark"
                                class="elevation-10"
                                fab
                                slot="activator"
                                v-model="fab"
                        >
                            <v-icon small>換色</v-icon>
                            <v-icon small>關閉</v-icon>
                        </v-btn>
                        <v-btn :color="sty.represent_color" :dark="sty.represent_dark" :key="i" @click="changeStyle(i)"
                               fab small v-for="(sty,i) in styles">{{sty.represent_text}}
                        </v-btn>
                    </v-speed-dial>
                </v-fab-transition>
                <v-card :class="style.card">
                    <v-card-title :class="style.card_title">
                        <v-layout :class="(isMobile ? 'column' : 'wrap')">
                            <v-text-field append-icon="search" dark label="搜索用戶名" v-model="search"></v-text-field>
                            <v-select :class="{'pl-5': !isMobile}" :items="server_list" @input="changePort" cache-items
                                      dark label="選擇伺服" v-model="selected_server"></v-select>
                        </v-layout>
                    </v-card-title>
                    <v-card-text>
                        <v-layout :class="isMobile ? 'column' : 'row wrap'">
                            <v-flex :key="index" :xs4="!isDestop" :xs6="isDestop"
                                    v-for="(data,index) in (selected_server !== '全服' ? database : all_database)">
                                <v-toolbar :class="style.in_toolbar" :dark="style.in_toolbar_dark" slot="header">
                                    <v-toolbar-title>{{data.type}}</v-toolbar-title>
                                </v-toolbar>
                                <v-data-table :custom-filter="filteredItems" :dark="style.datatable_dark"
                                              :headers="headers" :hide-actions="!isMobile" :item-key="index+'table'"
                                              :items="data.list" :pagination.sync="pagination[index]"
                                              :rows-per-page-items="rowsPerPageItems" :search="search"
                                              class="elevation-2" no-data-text="無可用數據" no-results-text="沒有找到匹配記錄"
                                              rows-per-page-text="每頁記錄數：">
                                    <v-progress-linear :color="style.progress_color" height="4px" indeterminate
                                                       slot="progress"></v-progress-linear>
                                    <template slot="items" slot-scope="props">
                                        <td>#{{isMobile ?
                                            (props.index+1+((pagination[index].page-1)*pagination[index].rowsPerPage)) :
                                            props.index+1}}
                                        </td>
                                        <td style="padding: 10px">
                                            <v-img :src="'https://crafatar.com/avatars/'+props.item.uuid"
                                                   alt="Loading..." width="50px"></v-img>
                                        </td>
                                        <td>{{props.item.player}}</td>
                                        <td>{{data.type.match('經濟') ? '$' : ''}} {{props.item.group!=null ?
                                            props.item.group : props.item.data}} {{data.type.match('領地') ? ' 格' : ''}}
                                        </td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                </v-card>
                <v-snackbar :timeout="5000" top v-model="update_fail">加載失敗，請稍候再嘗試
                    <v-btn @click="update_fail = false" color="red" flat>返回</v-btn>
                </v-snackbar>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>

    export default {
        name: 'App',
        data() {
            return {
                fab: false,
                style: {
                    content: ['grey', 'darken-3'],
                    card: ['grey', 'darken-2', 'elevation-5'],
                    card_title: ['grey', 'darken-4'],
                    toolbar: ['black'],
                    toolbar_dark: true,
                    datatable_dark: true,
                    in_toolbar_dark: true,
                    in_toolbar: ['black'],
                    represent_color: 'black',
                    represent_text: '黑',
                    represent_dark: true,
                    progress_color: 'yellow'
                },
                styles: [
                    {
                        //Dark Theme
                        content: ['grey', 'darken-3'],
                        card: ['grey', 'darken-2', 'elevation-5'],
                        card_title: ['grey', 'darken-4'],
                        toolbar: ['black'],
                        toolbar_dark: true,
                        datatable_dark: true,
                        in_toolbar_dark: true,
                        in_toolbar: ['black'],
                        represent_color: 'black',
                        represent_text: '黑',
                        represent_dark: true,
                        progress_color: 'yellow'
                    },
                    {
                        //Dark Blue
                        content: ['white'],
                        card: ['white', 'elevation-5'],
                        card_title: ['primary', 'darken-4'],
                        toolbar: ['primary', 'darken-4'],
                        toolbar_dark: true,
                        datatable_dark: false,
                        in_toolbar_dark: true,
                        in_toolbar: ['primary', 'darken-4'],
                        represent_color: 'primary darken-4',
                        represent_text: '深藍',
                        represent_dark: true,
                        progress_color: 'primary lighten-4'
                    },
                    {
                        //Dark Red
                        content: ['white'],
                        card: ['white', 'elevation-5'],
                        card_title: ['error', 'darken-4'],
                        toolbar: ['error', 'darken-4'],
                        toolbar_dark: true,
                        datatable_dark: false,
                        in_toolbar_dark: true,
                        in_toolbar: ['error', 'darken-4'],
                        represent_color: 'error darken-4',
                        represent_text: '深紅',
                        represent_dark: true,
                        progress_color: 'error lighten-4'
                    },
                    {
                        // Blue
                        content: ['white'],
                        card: ['white', 'elevation-5'],
                        card_title: ['primary', 'darken-1'],
                        toolbar: ['primary', 'darken-3'],
                        toolbar_dark: true,
                        datatable_dark: false,
                        in_toolbar_dark: true,
                        in_toolbar: ['primary', 'darken-2'],
                        represent_color: 'primary',
                        represent_text: '藍',
                        represent_dark: true,
                        progress_color: 'primary darken-4'
                    },
                    {
                        //Orange
                        content: ['white'],
                        card: ['white', 'elevation-5'],
                        card_title: ['warning', 'darken-1'],
                        toolbar: ['warning', 'darken-3'],
                        toolbar_dark: true,
                        datatable_dark: false,
                        in_toolbar_dark: true,
                        in_toolbar: ['warning', 'darken-2'],
                        represent_color: 'warning',
                        represent_text: '橙',
                        represent_dark: true,
                        progress_color: 'orange darken-4'
                    },
                    {
                        //Green
                        content: ['white'],
                        card: ['white', 'elevation-5'],
                        card_title: ['success', 'darken-1'],
                        toolbar: ['success', 'darken-2'],
                        toolbar_dark: true,
                        datatable_dark: false,
                        in_toolbar_dark: true,
                        in_toolbar: ['success', 'darken-4'],
                        represent_color: 'success',
                        represent_text: '綠',
                        represent_dark: true,
                        progress_color: 'green darken-4'
                    },
                    {
                        //Purple
                        content: ['white'],
                        card: ['white', 'elevation-5'],
                        card_title: ['purple', 'darken-1'],
                        toolbar: ['purple', 'darken-2'],
                        toolbar_dark: true,
                        datatable_dark: false,
                        in_toolbar_dark: true,
                        in_toolbar: ['purple', 'darken-4'],
                        represent_color: 'purple',
                        represent_text: '紫',
                        represent_dark: true,
                        progress_color: 'purple darken-4'
                    }
                ],
                database: [],
                all_database: [],
                selected_server: '',
                loading: false,
                update_fail: false,
                search: '',
                headers: [
                    {text: '名次', sortable: false},
                    {sortable: false},
                    {text: '玩家名稱', value: 'player'},
                    {text: '數據', value: 'data'}
                ],
                pagination: [
                    {
                        sortBy: 'data',
                        descending: true,
                        rowsPerPage: 100,
                    },
                    {
                        sortBy: 'data',
                        descending: true,
                        rowsPerPage: 100,
                    },
                    {
                        sortBy: 'data',
                        descending: true,
                        rowsPerPage: 100,
                    }
                ],
                rowsPerPageItems: [{text: 'All', value: 100}],
            }
        },
        methods: {
            async get_all_rank() {
                if (this.loading) return;
                this.all_database = [];
                let eco_list = [];
                let vip_list = [];
                let res_list = [];
                let eco_success = true;
                let vip_success = true;
                let res_success = true;
                window.console.log('getting all data...');
                this.loading = true;
                let servers = this.servers;
                for (let i = 0; i < servers.length; i++) {
                    let url = servers[i].url;
                    this.$axios.get(url + servers[i].port + '/economy').then(eco => {
                        eco_list.push(...eco.data);
                        //window.console.log(eco.data.length)
                    }).catch(() => {
                        eco_success = false;
                    });

                    this.$axios.get(url + servers[i].port + '/viprank').then(vip => {
                        vip_list.push(...vip.data);
                        //window.console.log(vip.data.length)
                    }).catch(() => {
                        vip_success = false;
                    });

                    this.$axios.get(url + servers[i].port + '/residence').then(res => {
                        res_list.push(...res.data);
                        //window.console.log(res.data.length)
                    }).catch(() => {
                        res_success = false;
                    });
                }
                window.console.log(eco_list.length + ' ' + vip_list.length + ' ' + res_list.length);
                if (!res_success || !vip_success || !eco_success) {
                    this.update_fail = true;
                }
                this.all_database.push(
                    {
                        type: "經濟排行",
                        list: eco_list
                    },
                    {
                        type: "VIP階級排行",
                        list: vip_list
                    },
                    {
                        type: "領地排行",
                        list: res_list
                    },);
                this.loading = false;

            },
            async get_rank(port, url) {
                if (this.loading) return;
                this.database = [];
                let eco_success = true;
                let res_success = true;
                let vip_success = true;
                window.console.log('getting data...');
                const link = url + port + '/';
                this.loading = true;
                this.$axios.get(link + 'economy').then(eco => {
                    this.database.push({
                        type: "經濟排行",
                        list: eco.data
                    });
                }).catch(() => {
                    eco_success = false;
                });

                this.$axios.get(link + 'viprank').then(vip => {
                    this.database.push({
                        type: "VIP階級排行",
                        list: vip.data
                    });
                }).catch(() => {
                    vip_success = false;
                });

                this.$axios.get(link + 'residence').then(res => {
                    this.database.push({
                        type: "領地排行",
                        list: res.data
                    });
                    this.loading = false;
                }).catch(() => {
                    res_success = false;
                    this.loading = false;
                });

                window.console.log('list length: ' + this.database.length);
                if (!res_success || !vip_success || !eco_success) this.update_fail = true;
            },
            filteredItems(items, search) {
                let result = items;
                if (search.length > 0) result = items.filter(data => data.player.match(search));
                return result
            },
            changePort() {
                if (this.selected_server !== '全服') {
                    let server = this.servers;
                    server = server.find(data => data.server === this.selected_server);
                    let port = server.port;
                    let url = server.url;
                    this.get_rank(port, url);
                } else {
                    this.get_all_rank();
                }
            },
            setDefault(val) {
                this.selected_server = val.server;
                this.get_rank(val.port, val.url)
            },
            changeStyle(index) {
                this.style = this.styles[index];
                window.localStorage.setItem("mctw_leaderboard_style", index + "");
            }
        },
        mounted() {
            if (this.isMobile) {
                this.rowsPerPageItems.unshift(20, 40);
                for (let i = 0; i < 3; i++) {
                    this.pagination[i].rowsPerPage = 20;
                }
            }
            let style = window.localStorage.getItem("mctw_leaderboard_style");
            if (style != null) {
                let index = Number.parseInt(style);
                this.style = this.styles[index];
            }
        },
        computed: {
            isMobile() {
                return this.$vuetify.breakpoint.mdAndDown;
            },
            isDestop() {
                return this.$vuetify.breakpoint.lgAndDown;
            },
            server_list() {
                let server = [];
                Array.from(this.servers).forEach(ser => server.push(ser.server));
                server.push('全服');
                return server;
            },
            servers() {
                return this.$store.state.servers;
            }
        },
        beforeCreate() {
            const servers = () => import('../public/json/servers.json');

            fetch("./json/servers.json").then(r => r.json()).then(data => {
                this.$store.commit('setServerList', data);
                this.setDefault(data[0]);
            }).catch(() => this.$store.commit('setServerList', servers));

        }
    }
</script>
<style scoped>
    * {
        font-family: "Microsoft JhengHei UI", serif;
    }
</style>
