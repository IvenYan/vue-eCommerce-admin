<template>
    <div class="menu">
        <Menu />
        <main ref="container">
            <div id="header">
                <top-menu />
            </div>
            <div :style="{'height':centerHeight}" class="mainCenter">
                <router-view />
            </div>
        </main>
    </div>
</template>
<script>
import Menu from '../../components/basic/menu';
import TopMenu from '../../components/basic/topMenu';
import {mapActions} from 'vuex';
export default {
    name: 'system',
    components: {
        TopMenu,
        Menu
    },
    data () {
        return {
            collapse: true,
            centerHeight:null
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.setHeight()
        })
    },
    methods: {
        ...mapActions(['changeHeight']),
        setHeight:function(){
            const containerHeight = this.$refs['container'].clientHeight
            const headerHeight = window.getComputedStyle(document.getElementById('header')).height.slice(0, -2)
            this.centerHeight=containerHeight-headerHeight+'px';
            this.changeHeight({height:containerHeight-headerHeight-20});
        },
        isCollapse () {
            this.collapse = !this.collapse;
        }
    }
};
</script>
<style>
.menu{
    width:100%;
    height:100%;
    background:#f2f2f2;
    display:flex;
}
main{
    display:inline-block;
    width:100%;
}
.mainCenter{
    padding: 20px 20px 0 20px;
    overflow-y: auto;
    color:#606266;
}
</style>
