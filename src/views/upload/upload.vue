<template>
    <div class='upload'>
        <el-card shadow="hover" class="card">
            <div slot="header" class="clearfix">
                <span style="display:block;margin-bottom:10px;">亚马逊产品上传</span>
                <span>注意：只有您"通过"且"上架"的产品才可以传到亚马逊</span>
            </div>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="产品级别">
                    <!-- <el-checkbox-group v-model="form.type" @change="checkgroup">
                        <el-checkbox label="全部" name="type"></el-checkbox>
                        <el-checkbox label="重点" name="type"></el-checkbox>
                        <el-checkbox label="原创" name="type"></el-checkbox>
                        <el-checkbox label="海外" name="type"></el-checkbox>
                        <el-checkbox label="抓取" name="type"></el-checkbox>
                        <el-checkbox label="下载" name="type"></el-checkbox>
                    </el-checkbox-group> -->
                    <el-radio-group v-model="form.type" @change="checkgroup">
                        <el-radio :label="1" value="全部">全部</el-radio>
                        <el-radio :label="2" value="重点">重点</el-radio>
                        <el-radio :label="3" value="原创">原创</el-radio>
                        <el-radio :label="4" value="海外">海外</el-radio>
                        <el-radio :label="5" value="抓取">抓取</el-radio>
                        <el-radio :label="6" value="下载">下载</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="产品编号">
                    <el-input clearable @change="checkgroup1" v-model="form.productId" size="medium" placeholder="请输入产品编号" class="ipt"></el-input>
                </el-form-item>
                <el-form-item label="限制条数">
                    <el-input clearable @change="iptChange" v-model="form.limitNumber" size="medium" placeholder="上传最大数量，最大检索数量为100" class="ipt"></el-input>
                </el-form-item>
                <el-form-item label="产品日期">
                    <div class="block">
                        <el-date-picker
                        v-model="form.productDate"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="产品排序">
                    <el-radio-group v-model="form.radio" @change="radioChange">
                        <el-radio value="产品编号从小到大" :label="1">产品编号从小到大</el-radio>
                        <el-radio value="产品编号从大到小" :label="2">产品编号从大到小</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择账户">
                    <el-select v-model="form.region" placeholder="请选择账户"  size="medium" clearable  class="ipt" @change="selectChange">
                        <el-option
                            v-for="item in accountsArr"
                            :key="item.id"
                            :label="item.accountNickname"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="处理天数" >
                    <el-input clearable @change="iptChange1" v-model="form.processDays" size="medium" placeholder="从订单付款到发货的处理天数（1-30）" class="ipt"></el-input>
                </el-form-item>
                 <el-form-item label="产品分类">
                        <el-cascader
                        v-model="form.productType"
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="cpSelect"
                        size="medium"
                        class="ipt"
                        clearable
                        :disabled="this.prohibit"
                        style="width:630px;"
                       ></el-cascader>
                    <span @click="dialogHistory" class="cur"><i class="el-icon-s-operation"></i>历史</span>
                </el-form-item>
                <el-form-item label="亚马逊分类">
                    <el-cascader
                        ref="cascaderAddr"
                        v-model="form.classifyType"
                        :options="gainclassifyList"
                        :props="{ expandTrigger: 'hover' }"
                        @change="classifyList"
                        size="medium"
                        class="ipt"
                        clearable
                        :disabled="this.prohibit"
                        style="width:630px;"
                       ></el-cascader>
                    <span @click="lookupClick" class="cur"><i class="el-icon-s-grid"></i>查找</span>
                </el-form-item>
                <div class="txt">
                    <p class="way">{{amazonWay}}</p>
                    <p class="node">{{amazonId}}</p>
                </div>
                <el-form-item label="上传模板">
                    <el-select v-model="form.uploadTemplate" size="medium"  class="ipt" clearable @change="scSelect1" placeholder="Home/Home（家居）">
                        <el-option label="Home/Home（家居）" value="Home/Home（家居）"></el-option>
                        <el-option label="Spzorts/SportingGoods（户外）" value="Spzorts/SportingGoods（户外）"></el-option>
                        <el-option label="Health/PersonalCareAppliances（个护）" value="Health/PersonalCareAppliances（个护）"></el-option>
                    </el-select>
                </el-form-item>
                <div class="txt">暂时只支持HOME/HOME模板</div>
                </el-form>
        </el-card>
         <el-card shadow="hover" class="card">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="厂商名称" >
                    <el-input v-model="form.factoryName" size="medium" placeholder="将覆盖产品本身的厂商名称"  class="ipt" clearable @change="cjName"></el-input>
                </el-form-item>
                <el-form-item label="厂商编号"  >
                    <el-input v-model="form.factoryNo" size="medium" placeholder="将覆盖产品本身的厂商编号" class="ipt" clearable @change="cjNumber"></el-input>
                </el-form-item>
                <el-form-item label="产品品牌"  >
                    <el-input v-model="form.productBrand" size="medium" placeholder="将覆盖产品本身的品牌名称" class="ipt" clearable @change="cjipt"></el-input>
                </el-form-item>
                <el-form-item label="标题前缀" >
                    <el-input v-model="form.titlePrefix" size="medium" placeholder="选填" class="ipt" clearable @change="titleFirst"></el-input>
                </el-form-item>
                <el-form-item label="标题后缀">
                    <el-input v-model="form.titleSuffix" size="medium" placeholder="选填" class="ipt" clearable @change="titleLast"></el-input>
                </el-form-item>
                 <div class="txt1">关 键 字： 通用关键字，通用关键字将覆盖产品的关键字，关键字总共不可以超过230个字符，单行不可以超过180个字符</div>
                <el-form-item class="txtarea">
                    <el-input type="textarea" @change="txtChange" placeholder="输入内容不超过230个字" v-model="form.desc" style="width:350px" class="txtarea" maxlength="230"></el-input>
                </el-form-item>
                <div class="txt2">添加描述 : 在产品的详细描述之外，再添加一些通用的描述，主要为了增加变化。</div>
                <el-form-item label="插入前面">
                    <el-input placeholder="请输入内容" @change="txtChange1" type="textarea" v-model="form.descPrefix" size="medium"  style="width:350px;" class="txtarea"></el-input>
                </el-form-item>
                <el-form-item label="插入后面">
                    <el-input placeholder="请输入内容" @change="txtChange" type="textarea" v-model="form.descSuffix" size="medium"  style="width:350px;" class="txtarea"></el-input>
                </el-form-item>
                <el-form-item label="描述标签">
                    <el-radio-group v-model="form.resource" @change="mstitle">
                        <el-radio label="< br />分隔" value="< br />分隔"></el-radio>
                        <el-radio label="< p >分隔" value="< p >分隔"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="onSubmit" plain class="submit">提交</el-button>
        </el-card>
        <!-- 点击历史弹窗 -->
        <el-dialog
            :title="title"
            :width="'70%'"
            :visible.sync="histvisible"
            :close-on-click-modal="false"
            >
            <el-table
                border
                :data="historyArray"
                style="width: 100%"
                height="350">
                    <el-table-column
                        prop="producttype"
                        label="我的分类"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="amazonproducttype"
                        label="分类">
                    </el-table-column>
                    <el-table-column
                        prop="uploadTemplate"
                        label="XSD"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="选择"
                        width="120"
                        align="center">
                        <template slot-scope="scope">
                            <el-button
                            @click.native.prevent="deleteRow(scope.row)"
                            type="text"
                            size="small"
                            class="btn">
                            <img src="../../assets/choice.jpg" alt="">
                            </el-button>
                        </template>
                    </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 点击查找 -->
        <el-dialog :width="'70%'" title="亚马逊分类：点击子类中的数字查看下一级，点击对勾进行选择。" :visible.sync="dialogTableVisible">
            <el-form>
                <el-form-item>
                    <el-input class="contentProOth" placeholder="搜索" v-model="inputOther" @change="getiptContent">
                        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item class="form_item">
                    <span class="position">位置：全部分类</span>
                    <span class="record">共有 {{this.tableData.length}} 条记录</span>
                </el-form-item>
            </el-form>
            <el-table
            :data="tableData"
            style="width: 100%"
            @expand-change="onRowClickp"
            height="350">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table
                            :data="scope.row.children"
                            style="width: 90%"
                            @expand-change="onRowClick"
                            height="150">
                        <el-table-column
                            prop="value"
                            label="中文名称"
                            width="200">
                        </el-table-column>
                        <el-table-column
                            prop="nodeid"
                            label="分类节点ID"
                            width="150">
                        </el-table-column>
                        <el-table-column
                            prop="label"
                            label="分类名称"
                            width="225">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="110"
                            align="center">
                        <template slot-scope="scope">
                            <el-button
                            @click.native.prevent="getRow(scope.row)"
                            type="text"
                            size="small"
                            class="btn">
                                <img src="../../assets/choice.jpg" alt="">
                            </el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="value"
                    label="中文名称"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="nodeid"
                    label="分类节点ID">
                    </el-table-column>
                    <el-table-column
                    prop="label"
                    label="分类名称"
                    width="250">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="120"
                            align="center">
                        <template slot-scope="scope" >
                            <el-button
                            v-show="scope.row.haschild == true"
                            @click.native.prevent="getRow(scope.row)"
                            type="text"
                            size="small"
                            class="btn">
                                <img src="../../assets/choice.jpg" alt="">
                            </el-button>
                        </template>
                        </el-table-column>
                </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {gettingUser,productList,getamazon,amazonUpload,amazonhistory,amazonlookup,amazonsearch} from '../../api/index.js'
import { connect } from 'net';
export default {
    data(){
        return{
            amazonproduct:[],
            inputValue:'',//搜搜内容
            amazonaccountName:'', //账户名称
            historyArray:[], //历史弹窗数据
            amazonWay:'亚马逊分类路径',
            amazonId:'亚马逊节点id',
            submitType:{},
            title:'标题',
            histvisible:false,
            dialogTableVisible:false,
            prohibit:false,
            accountsArr:[],
            options:[],     //存放产分类数据
            gainclassifyList:[],    //存放亚马逊分类数据
            inputOther:'',  //查找弹窗搜索
            tableData: [],
            form: {
                type: 3,       //产品级别
                productId:'',      //产品编号
                limitNumber:'',       //限制条数
                processDays: '',       //处理天数
                region: '',     //选择账户
                productDate:[],          //产品日期
                radio: '',          //产品排序
                uploadTemplate:'Home/Home（家居）',         //上传模板
                factoryName:'',           //厂商名称
                factoryNo:'',           //厂商编号
                productBrand:'',           //产品品牌
                titlePrefix:'',           //标题前缀
                titleSuffix:'',           //标题后缀
                descPrefix:'',           //插入前面
                descSuffix:'',           //插入后面
                desc: '',           //关键字
                productType:[],         //产品分类
                classifyType:[],         //亚马逊分类
                resource: '< br />分隔',       //描述标签
            },
        }
    },
    mounted () {
        this.judgeContent();
        this.selectionAccounts();
        this.handleFocus();
        // this.getamazon();
        this.initClassifyListJson();
    },
    methods:{
        // 初始化亚马逊分类
        initClassifyListJson(){
                // console.log("正在测试1");
            const classifyUrl='/static/amazonClassifyv2.json';    // windows,linux
            
            this.$http.get(classifyUrl).then(res=>{
                this.gainclassifyList=res;
                // console.log("正在测试");
            });
            
        },
        // 历史弹窗选择
        deleteRow(scope) {
            this.histvisible = false;
        },
        // 判断账户是否有内容
        judgeContent(){
            if (this.form.region == '') {
                this.prohibit = true;
            } else {
                this.prohibit = false;
            }
        },
        // 提交按钮内容
        onSubmit() {
            this.submitType  = {
                level: this.form.type,       //    产品级别
                limitNumber: this.form.limitNumber,        //    限制条数
                productDate: this.form.productDate,       //    产品日期
                productSort: this.form.radio,        //    产品排序-在用
                productId: this.form.productId,         //    产品编号-在用
                amazonAccountId: this.form.region,  //    选择账户-在用
                processDays: this.form.processDays,        //    处理天数-在用
                prodductTypeList: this.form.productType,       //    产品分类-在用
                amazonProductTypeList: this.form.classifyType,  //    亚马逊分类-在用
                uploadTemplate: this.form.uploadTemplate,     //    上传模板
                factoryName: this.form.factoryName,          //    厂商名称-在用
                factoryNo: this.form.factoryNo,            //    厂商编号-在用
                productBrand: this.form.productBrand,          //    产品品牌
                titlePrefix: this.form.titlePrefix,           //    标题前缀
                titleSuffix: this.form.titleSuffix,           //    标题后缀
                keyWords: this.form.desc,               //    关键字
                descPrefix: this.form.descPrefix,            //    前面描述
                descSuffix: this.form.descSuffix,            //    后面描述
                descTag: this.form.resource,            //    描述标签
           };
            amazonUpload(this.submitType).then((res) => {
                if(res.status == 200){
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    this.clearFrom();
                }
            }).catch((error) => {
                this.$message.error('提交失败');
            }).then(() => {

            });

        },
        // 清空form
        clearFrom(){
            this.amazonWay = '亚马逊分类路径',
            this.amazonId = '亚马逊节点id',
            this.form = {
                type: 3,       //产品级别
                productId:'',      //产品编号
                limitNumber:'',       //限制条数
                processDays: '',       //处理天数
                region: '',     //选择账户
                productDate:'',          //产品日期
                radio: '',          //产品排序
                uploadTemplate:'Home/Home（家居）',         //上传模板
                factoryName:'',           //厂商名称
                factoryNo:'',           //厂商编号
                productBrand:'',           //产品品牌
                titlePrefix:'',           //标题前缀
                titleSuffix:'',           //标题后缀
                descPrefix:'',           //插入前面
                descSuffix:'',           //插入后面
                desc: '',           //关键字
                productType:[],         //产品分类
                classifyType:[],         //亚马逊分类
                resource: '< br />分隔',       //描述标签
            }
        },
        // 产品级别内容
        checkgroup (val) {
            this.form.type = val;
        },
        // 产品编号内容
        checkgroup1(vals){
            this.form.productId = vals;
        },
        // 限制条数内容
        iptChange(value){
            this.form.limitNumber = value;
        },
        // 产品排序内容
        radioChange(value){
            this.form.radio = value;
        },
        // 选择账户内容
        selectChange(value) {
            this.form.region = value;
            this.judgeContent();
        },
        // 处理天数内容
        iptChange1(value) {
            this.form.processDays = value;
        },
        // 产品分类内容
        cpSelect(value){
            this.form.productType = value;
        },
        // 点击亚马逊分类内容
        classifyList(value){
            console.log("正在测试2"+JSON.stringify(value));
            this.form.classify = value;
            var ids = [];
            for(var i=0;i<value.length;i++){
                var id = this.getmapResult(value[i])[0].id;
                ids.push(id)
            }
            this.amazonWay=value.join(',')
            console.log(JSON.stringify(this.amazonWay));
            this.amazonId=ids.join(',')
        },
        getmapResult(type){
            var arr = [];
            for(var i=0;i<this.gainclassifyList.length;i++){
                arr.push(this.gainclassifyList[i])
                if(this.gainclassifyList[i].children!=null){
                    for(var j=0;j<this.gainclassifyList[i].children.length;j++){
                        arr.push(this.gainclassifyList[i].children[j])
                        if(this.gainclassifyList[i].children[j].children){
                            for(var m=0;m<this.gainclassifyList[i].children[j].children.length;m++){
                                arr.push(this.gainclassifyList[i].children[j].children[m])
                            }
                        }
                    }
                }
            }
            var data = arr.filter(function(item){
                return item.label == type;
            })
            return data;
        },
        // 上传模板内容
        scSelect1(value){
            this.form.uploadTemplate = value;
        },
        // 厂家名称
        cjName(value){
            this.form.factoryName = value;
        },
        // 厂家编号
        cjNumber(value){
            this.form.factoryNo = value;
        },
        // 产品品牌
        cjipt(value){
            this.form.productBrand = value;
        },
        // 标题前缀
        titleFirst(value){
            this.form.titlePrefix = value;
        },
        // 标题后缀
        titleLast(value){
            this.form.titleSuffix = value;
        },
        //关键字内容
        txtChange(value){
            this.form.desc = value;
        },
        //插入前面
        txtChange1(value){
            this.form.descPrefix = value;
        },
        //插入后面
        txtChange2(value){
            this.form.descSuffix = value;
        },
        // 描述标签
        mstitle(value){
            this.form.resource = value;
        },
        // 获取账户列表
        selectionAccounts(){
            const params = { };
            gettingUser(params).then((data) => {
                this.accountsArr = data;
            }).catch((error) => {
            }).then(() => {
            });
        },
        // 获取产品分类内容
        handleFocus(){
            const params = { };
            productList(params).then((res) => {
                this.options = res;
            }).catch((error) => {
            }).then(() => {
            });
        },
        // 获取马亚讯分类内容-- yankun 注释掉
        // getamazon(){
        //     const params = { };
        //     this.$http.get('/ecommerce-backend/json/amazonClassifyv2.json').then(res=>{
        //         this.gainclassifyList = res;
        //     })
        //     // getamazon(params).then((res) => {
        //     //     this.gainclassifyList = res;
        //     // }).catch((error) => {
        //     // }).then(() => {
        //     // });
        // },
        // 历史弹框
        dialogHistory(){
            if(this.form.region ==''){
                this.$message({
                    message: '请选择账户！',
                    type: 'warning'
                });
            }else{
                this.getHistoryCntent();
                this.title='已上传'+this.amazonaccountName+'的分类列表'
                this.histvisible = true;
            }
        },
        // 获取历史弹窗内容
        getHistoryCntent(){
            const params = {
                counts: 10,
                amazonAccountId: this.form.region
            };
            amazonhistory(params).then((res) => {
                this.amazonaccountName = res[0].amazonaccountName;
                this.historyArray = res;
            }).catch((error) => {
            }).then(() => {
            });
        },
        // 获取历史弹窗某一行的数据
        deleteRow(rows){
            this.histvisible = false;
            this.form.processDays = rows.processdays;      //处理天数
            this.form.productType = rows.producttypeList;      //产品分类
            this.form.classifyType = rows.amazonproducttypeList;    //亚马逊分类
            this.form.factoryName  = rows.factoryname;   //厂商名称
            this.form.productBrand = rows.productbrand;   //产品品牌
            var ids = [];
            for(var i=0;i<rows.amazonproducttypeList.length;i++){
                var id = this.getmapResult(rows.amazonproducttypeList[i])[0].id;
                ids.push(id)
            }
            this.amazonWay=rows.amazonproducttypeList.join(',');
            this.amazonId=ids.join(',');
        },
        // 显示查找弹窗
        lookupClick(){
            this.getlookupClick();
            this.dialogTableVisible = true;
        },
        // 获取查找数据
        getlookupClick(){
            const params = {};
            amazonlookup(params).then((res) => {
                this.tableData = res;
            }).catch((error) => {
            }).then(() => {
            });
        },
        // 获取搜索内容
        getiptContent (value) {
            this.inputValue = value;
        },
        // 查找弹窗中的搜索
        onSearch(){
            console.log(this.inputValue)
            const params = {
                searchName: this.inputValue
            };
            amazonsearch(params).then((res) => {
                this.tableData = res;
            }).catch((error) => {
            }).then(() => {
            });
        },
        onRowClickp (row, expandedRows) {
            var arr = [];
            arr.push(row.label)
            this.amazonproduct=arr
        },
        onRowClick (row, expandedRows) {
            var arr = this.amazonproduct;
            arr.push(row.label)
            this.amazonproduct=arr
        },
        getRow(rows) {
            this.dialogTableVisible = false;
            this.amazonproduct.push(rows.label);
            this.form.classifyType = this.amazonproduct;    //亚马逊分类
            var ids = [];
            for(var i=0;i<this.amazonproduct.length;i++){
                var id = this.getmapResult(this.amazonproduct[i])[0].id;
                ids.push(id)
            }
            this.amazonWay=this.amazonproduct.join(',');
            this.amazonId=ids.join(',');
        }
    }
};
</script>
<style>
    .ipt{
        width: 270px;
    }
    .el-form-item {
        margin-bottom: 10px;
    }
    .txt{
        color: #8888;
        margin-left: 100px;
        margin-bottom: 10px;
    }
    .txt1{
        color: red;
        margin-left: 30px;
    }
    .txt2{
        margin-left: 30px;
    }
    .txtarea{
        margin-top: 10px;
    }
    .card{
        width: 930px;
        margin-left: 20px;
        height: 700px;
    }
    .submit{
        margin-left: 45%;
        margin-top: 40px;
    }
    .contentProOth {
        width: 240px!important;
        margin-top: -25px;
    }
    .el-dialog__title{
        font-size:14px;
    }
    .position{
        float: left;
    }
    .record{
        float: right;
    }
    .form_item{
        margin-top: -20px;
    }
    .cur{
        cursor: pointer;
    }
    .btn img{
        width: 25px;
        height: 25px;
    }
</style>
