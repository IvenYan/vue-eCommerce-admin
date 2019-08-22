<template>
    <div class="top-menus">
       <i class="el-icon-tickets" @click="collsped"></i>
       <span>
        {{title}}
       </span>
    </div>
</template>

<script>
    import bus from '../../tools/bus.js';
    import { mapState } from 'vuex';
    export default {
        name: 'topmenu',
        methods: {
            collsped () {
                bus.$emit('collapsed');
            }
        },
        computed: {
            ...mapState({
                title: state => state.title.title
            })
        }
    };
</script>

<style>
    .top-menus{
        background:#fff;
        height:55px;
        line-height:55px;
        box-shadow:0px 4px 24px 0px rgba(153,153,153,0.24);
    }
    .top-menus i{
        padding:0 20px;
    }
</style>