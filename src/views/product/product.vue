<template>
    <div :style="{'height':height+'px'}" class="proWrapper">
        <el-row>
            <el-col :span="isshow?12:24">
                <el-row id="headerPro">
                    <el-col :span="24">
                        <el-form :inline="true">
                            <el-form-item>
                                <el-cascader
                                    v-model="query.valuecascader"
                                    :options="options"
                                    placeholder="全部分类"
                                    :clearable="true" 
                                    @clear="onSearch"
                                    >
                                </el-cascader>
                            </el-form-item>
                            <el-form-item>
                                <el-date-picker
                                    v-model="query.marray"
                                    type="daterange"
                                    align="right"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="query.valued" :clearable="true"  @clear="onSearch" placeholder="请选择">
                                    <el-option
                                    v-for="item in optionsd"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input
                                    class="contentPro"
                                    placeholder="产品编号"
                                    v-model="query.inputbh"
                                    :clearable="true"
                                    @clear="onSearch">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input class="contentProOths" placeholder="其他搜索" v-model="query.inputOther" :clearable="true" @clear="onSearch">
                                    <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="operate('add')">添加产品</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="24" class="tranSort">
                        <span v-for="(item,index) in auditData" :class="item.value==query.audit_status?'tranSortNow':''" @click="proSearch(item.value,'audit')">{{item.label}} <b v-if="(item.value==query.audit_status)">({{productNum.audit_status}})</b> </span>
                    </el-col>
                    <el-col :span="24" class="tranSort">
                        <span v-for="(item,index) in onsaleData" :class="item.value==query.onsale?'tranSortNow':''" @click="proSearch(item.value,'sale')">{{item.label}} <b v-if="(item.value==query.onsale)">({{productNum.onsale}})</b> </span>
                    </el-col>
                    <el-col :span="24" class="tranSort">
                        <span v-for="(item,index) in levelData" :class="item.value==query.level?'tranSortNow':''" @click="proSearch(item.value,'level')">{{item.label}} <b v-if="(item.value==query.level)">({{productNum.level}})</b> </span>
                    </el-col>
                </el-row>
                <el-row :style="{'height':height-headerHeight-footerHeight+'px'}" class="proContent">
                    <dl class="productItem" @click="operate('edit',item)" v-for="(item,index) in productData" :key="index">
                        <dt class="productImg">
                            
                            <img :src="'http://wechatcool.xyz/ecommerce_backend/images/'+item.picture" alt="">
                        </dt>
                        <dd class="productText">
                            <p>
                                <span>￥ <b>{{item.cost}}</b></span>
                                <span>+{{item.shippingCost}}</span>
                            </p>
                            <p>{{item.productTitle}}</p>
                        </dd>
                    </dl>
                </el-row>
                <el-row id="footerPro">
                    <el-pagination
                        @size-change="handlePage"
                        @current-change="handleCurPage"
                        :page-sizes="[20,50,100]"
                        :page-size="max"
                        layout="total, sizes, prev, pager, next"
                        :total="total"
                        style="margin:auto;"
                    ></el-pagination>
                </el-row>
            </el-col>
            <el-col :span="isshow?12:0">
                <div id="editTop">
                    <el-row  class="producBor">
                        <el-col :span="23">
                            <el-tag
                                v-for="tag in tagsData"
                                closable
                                :key="tag"
                                class="elTags"
                                :type="tag==checkedTag?'':'info'"
                                :disable-transitions="false"
                                @click="handleClick(tag)"
                                @close="handleClose(tag)">
                                {{tag}}
                            </el-tag>
                        </el-col>
                        <el-col :span="1" style="cursor:pointer;"><i class="el-icon-close" @click="onclose"></i></el-col>
                    </el-row>
                    <div v-if="isTop" class="producBor productInfoTop">
                        <span>产品编号：{{productId}}</span>
                        <span>添加时间：{{productTime}}</span>
                    </div>
                </div>
                <div :style="{'height':height-editTopHeight+'px'}" class="editWrapper">
                    <el-form :model="form.fields" :rules="form.rules" ref="form" class="proElForm">
                        <el-form-item>
                            <el-cascader
                                v-model="form.fields.productTypeIdsString"
                                :options="options"
                                placeholder="全部分类"
                                clearable
                                class="elCascaderEdit">
                            </el-cascader>
                        </el-form-item>
                        <el-form-item class="imgWrapperPro">
                            <template>
                                <viewer v-for="(item,index) in imgUrl" :key="index" :url="item" class="avatar">
                                    <i @click="ondelImg(index)" class="el-icon-remove-outline"></i>
                                    <img :src="item">
                                </viewer>
                                <el-upload
                                    action="http://148.70.219.244:8080/product/image/upload"
                                    list-type="picture-card"
                                    :show-file-list="false"
                                    :on-success="uploadSuccess">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </template>
                        </el-form-item>
                        <div class="textPrompt">设置过滤、侵权和屏蔽，亚马逊上传明细将自动标注“待删除”</div>
                        <el-form-item>
                            <el-form-item label="审核状态：">
                                <el-radio-group v-model="form.fields.auditStatus">
                                    <el-radio label="1">通过</el-radio>
                                    <el-radio label="2">待审核</el-radio>
                                    <el-radio label="3">过滤</el-radio>
                                    <el-radio label="4">侵权</el-radio>
                                    <el-radio label="5">屏蔽</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="上架下架：">
                                <el-radio-group v-model="form.fields.onsale">
                                    <el-radio label="1">上架</el-radio>
                                    <el-radio label="2">下架</el-radio>
                                    <el-radio label="3">失效</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item label="产品级别：">
                            <el-radio-group v-model="form.fields.level">
                                <el-radio label="1">重点</el-radio>
                                <el-radio label="2">原创</el-radio>
                                <el-radio label="3">海外</el-radio>
                                <el-radio label="4">抓取</el-radio>
                                <el-radio label="5">下载</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label-width="82px" label="业务人员：">
                            <el-select v-model="form.fields.userId" clearable placeholder="请选择">
                                <el-option
                                v-for="item in optionsd"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="品牌名称：">
                                    <el-input v-model="form.fields.brand" placeholder="建议填写"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px"  class="proContentelItem" label="厂商名称：">
                                    <el-input v-model="form.fields.factoryName" placeholder="选填"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="原产地区：">
                                    <el-input v-model="form.fields.sourceArea" placeholder="选填英文"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px"  class="proContentelItem" label="厂商编号：">
                                    <el-input v-model="form.fields.factoryNumber" placeholder="选填"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="商品目录：">
                                    <el-input v-model="form.fields.factoryCatalog" placeholder="请输入内容"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="brandAccount">
                                品牌账户可能需要Catalog Number
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label-width="82px" label="禁止上传：">
                                    <el-radio-group v-model="form.fields.uploadForbiden">
                                        <el-radio label="1">是</el-radio>
                                        <el-radio label="2">否 禁止上传亚马逊</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label-width="95px" class="proContentelItem" label="来源网址：">
                                    <el-input placeholder="请输入内容" type="textarea" v-model="form.fields.sourceUrl"></el-input>
                                </el-form-item>
                            </el-col>
                             <el-col :span="24">
                                <el-form-item label-width="95px" class="proContentelItem" label="附加备注：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.comments"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="成本单价：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.cost"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="brandAccount">
                                人民币成本
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label-width="95px" class="proContentelItem" label="运费输出：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.shippingCost"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="海关编码：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.customCode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem textBriE" label="英文简介：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.engDesc"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="申报单价：">
                                    <el-input placeholder="申报单价" v-model="form.fields.declarePrice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem textBriC" label="中文简介：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.chDesc"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="内部SKU：">
                                    <el-input placeholder="自定义SKU(选填)" v-model="form.fields.innerSku"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="适用人群：">
                                    <el-select v-model="form.fields.suitForGroup" clearable placeholder="请选择">
                                        <el-option
                                        v-for="item in applyData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="产品材料：">
                                    <el-input placeholder="选填英文" v-model="form.fields.productMaterial"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="包装材料：">
                                    <el-input placeholder="选填英文" v-model="form.fields.packetMaterial"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="金属类型：">
                                    <el-input placeholder="选填英文" v-model="form.fields.metalType"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="珠宝类型：">
                                    <el-input placeholder="选填英文" v-model="form.fields.jewelType"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label-width="130px" class="proContentelItem" label="包装毛重：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.packageGrossWeight"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3"  class="brandAccount">克（g）</el-col>
                            <el-col :span="12">
                                <el-form-item>
                                    <el-checkbox v-model="form.fields.hasBattery">产品有电池</el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label-width="140px" class="packSize" label="包装尺寸：">
                                    <el-input placeholder="长" v-model="form.fields.packageLong"></el-input> x 
                                    <el-input placeholder="宽" v-model="form.fields.packageWidth"></el-input> x 
                                    <el-input placeholder="高" v-model="form.fields.packageHight"></el-input> <p class="productcm">厘米(cm) </p>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="110px" class="proContentelItem" label="库存数量：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.inStore"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label-width="140px" class="proContentelItem" label="每包产品数：">
                                    <el-input placeholder="请输入内容" v-model="form.fields.countPerPackage"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" class="addLine"><span @click="onaddline">点击添加变体，可以选择子项或直接输入英文，可添加多行</span></el-col>
                            <div v-for="(item,index) in form.fields.productItemTypeList" :key="index">
                                <el-col :span="9" >
                                    <el-form-item class="proContentelItem">
                                        <el-select  v-model="item.name" placeholder="请选择">
                                            <el-option
                                            v-for="item in productSel"
                                            :key="item.name"
                                            :label="item.label"
                                            :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item class="proContentelItem">
                                        <el-input placeholder="请输入内容" @change="onkeychange" @blur="blurInputs" v-model="item.value"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3" class="brandAccount"><i class="el-icon-delete" @click="onclearline(index)"></i></el-col>
                            </div>
                            <div v-show="divShow" style="width:100%;display:flex;flexBasis:25%;background: #2A3F54">
                                <span class="childrenBoxTop" :span="2">变体</span>
                                <span class="childrenBoxTop" :span="5">SKU(选填)</span>
                                <span class="childrenBoxTop" :span="5">库存</span>
                                <span class="childrenBoxTop" :span="5">加价￥</span>
                                <span class="childrenBoxTop" :span="7">图片(点击选择)</span>
                            </div>
                            <div v-show="divShow" v-for="(item,index) in form.fields.productItems" :key="'info2-'+index">
                                <div class="childrenBoxTopEx">{{item.name}}</div>
                                <div class="childrenBoxTopEx">
                                    <el-input placeholder="请输入内容" v-model="item.skuId"></el-input>
                                </div>
                                <div class="childrenBoxTopEx">
                                    <el-input placeholder="请输入内容" v-model.number="item.inventory"></el-input>
                                </div>
                                <div class="childrenBoxTopEx">
                                    <el-input placeholder="请输入内容" v-model.number="item.addPrice"></el-input>
                                </div>
                                <div class="childrenBoxTopExImg" @click="onMaskImg(index)">
                                    <div class="maskImgBox" v-show="isItemIndex===index">
                                        <div class="maskTopTitle"><span>请选择图片</span><img @click.stop="oncloneBox" class="cloneImg" src="../../assets/close.png" alt=""></div>
                                        <div class="maskImg">
                                            <div class="maskImgItem"
                                                v-for="(item,index) in imgLineUrl" :key="index"
                                                @click.stop="onChangeImg(index)"
                                                >
                                                <label>
                                                    <el-checkbox class="maskcheck" v-model="item.ischecked" @change="onChangeImg(index)"></el-checkbox>
                                                </label>
                                                <img class="maskImgCh" :src="item.img" alt="">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="showImg">
                                        <img v-for="(item,index) in item.pictureList" :key="index" :src="item.includes('http')?item:'http://wechatcool.xyz/ecommerce_backend/images/'+item" alt="">
                                    </div>
                                </div>
                            </div>
                            <el-col :span="24" class="languageStyle">
                                <span v-for="(item,key) in languageData" :key="key" :class="item.checked?'checkedlang':''" @click="onchangeLanguage(key,item)">{{item.value}}</span>
                            </el-col>
                            <el-col :span="24" class="productInfoTop"><span>产品标题：（{{changelanguage}}）</span><span style="cursor:pointer;" @click="onFirstLetter">首字大写</span></el-col>
                            <el-col :span="24">
                                <el-form-item >
                                    <el-input v-if="changelanguage=='英语'" placeholder="请输入内容" type="textarea" v-model="form.fields.englishproducttile"></el-input>
                                    <el-input v-if="changelanguage=='法语'" placeholder="请输入内容" type="textarea" v-model="form.fields.frenchproducttile"></el-input>
                                    <el-input v-if="changelanguage=='德语'" placeholder="请输入内容" type="textarea" v-model="form.fields.germanproducttile"></el-input>
                                    <el-input v-if="changelanguage=='意大利'" placeholder="请输入内容" type="textarea" v-model="form.fields.italyproducttile"></el-input>
                                    <el-input v-if="changelanguage=='西班牙'" placeholder="请输入内容" type="textarea" v-model="form.fields.spanishproducttile"></el-input>
                                    <el-input v-if="changelanguage=='日语'" placeholder="请输入内容" type="textarea" v-model="form.fields.japaneseproducttile"></el-input>
                                    <el-input v-if="changelanguage=='俄语'" placeholder="请输入内容" type="textarea" v-model="form.fields.russianproducttile"></el-input>
                                    <el-input v-if="changelanguage=='中文'" placeholder="请输入内容" type="textarea" v-model="form.fields.chineseproducttile"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" class="productInfoTop"><span>关键词：不超过5行 逗号、空格或回车分割（{{changelanguage}}）</span></el-col>
                            <el-col :span="24">
                                <el-form-item >
                                    <el-input v-if="changelanguage=='英语'" placeholder="请输入内容" type="textarea" v-model="form.fields.englishproductkeywords"></el-input>
                                    <el-input v-if="changelanguage=='法语'" placeholder="请输入内容" type="textarea" v-model="form.fields.frenchproductkeywords"></el-input>
                                    <el-input v-if="changelanguage=='德语'" placeholder="请输入内容" type="textarea" v-model="form.fields.germanproductkeywords"></el-input>
                                    <el-input v-if="changelanguage=='意大利'" placeholder="请输入内容" type="textarea" v-model="form.fields.italyproductkeywords"></el-input>
                                    <el-input v-if="changelanguage=='西班牙'" placeholder="请输入内容" type="textarea" v-model="form.fields.spanishproductkeywords"></el-input>
                                    <el-input v-if="changelanguage=='日语'" placeholder="请输入内容" type="textarea" v-model="form.fields.japaneseproductkeywords"></el-input>
                                    <el-input v-if="changelanguage=='俄语'" placeholder="请输入内容" type="textarea" v-model="form.fields.russianproductkeywords"></el-input>
                                    <el-input v-if="changelanguage=='中文'" placeholder="请输入内容" type="textarea" v-model="form.fields.chineseproductkeywords"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" class="productInfoTop"><span>要点说明：不超过5行 回车分割（{{changelanguage}}）</span></el-col>
                            <el-col :span="24">
                                <el-form-item >
                                    <el-input v-if="changelanguage=='英语'" placeholder="请输入内容" type="textarea" v-model="form.fields.englishproductkeydesc"></el-input>
                                    <el-input v-if="changelanguage=='法语'" placeholder="请输入内容" type="textarea" v-model="form.fields.frenchproductkeydesc"></el-input>
                                    <el-input v-if="changelanguage=='德语'" placeholder="请输入内容" type="textarea" v-model="form.fields.germanproductkeydesc"></el-input>
                                    <el-input v-if="changelanguage=='意大利'" placeholder="请输入内容" type="textarea" v-model="form.fields.italyproductkeydesc"></el-input>
                                    <el-input v-if="changelanguage=='西班牙'" placeholder="请输入内容" type="textarea" v-model="form.fields.spanishproductkeydesc"></el-input>
                                    <el-input v-if="changelanguage=='日语'" placeholder="请输入内容" type="textarea" v-model="form.fields.japaneseproductkeydesc"></el-input>
                                    <el-input v-if="changelanguage=='俄语'" placeholder="请输入内容" type="textarea" v-model="form.fields.russianproductkeydesc"></el-input>
                                    <el-input v-if="changelanguage=='中文'" placeholder="请输入内容" type="textarea" v-model="form.fields.chineseproductkeydesc"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" class="productInfoTop"><span>产品描述：不输入html标签（{{changelanguage}}）</span></el-col>
                            <el-col :span="24">
                                <el-form-item >
                                    <el-input v-if="changelanguage=='英语'" placeholder="请输入内容" type="textarea" v-model="form.fields.englishproductdesc"></el-input>
                                    <el-input v-if="changelanguage=='法语'" placeholder="请输入内容" type="textarea" v-model="form.fields.frenchproductdesc"></el-input>
                                    <el-input v-if="changelanguage=='德语'" placeholder="请输入内容" type="textarea" v-model="form.fields.germanproductdesc"></el-input>
                                    <el-input v-if="changelanguage=='意大利'" placeholder="请输入内容" type="textarea" v-model="form.fields.italyproductdesc"></el-input>
                                    <el-input v-if="changelanguage=='西班牙'" placeholder="请输入内容" type="textarea" v-model="form.fields.spanishproductdesc"></el-input>
                                    <el-input v-if="changelanguage=='日语'" placeholder="请输入内容" type="textarea" v-model="form.fields.japaneseproductdesc"></el-input>
                                    <el-input v-if="changelanguage=='俄语'" placeholder="请输入内容" type="textarea" v-model="form.fields.russianproductdesc"></el-input>
                                    <el-input v-if="changelanguage=='中文'" placeholder="请输入内容" type="textarea" v-model="form.fields.chineseproductdesc"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item class="btnProduct">
                            <el-button type="primary" :loading="form.loading" @click.native="onSubmit">确认提交</el-button>
                            <el-button type="primary" @click.native="onTort">侵权</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import {listProducts,productList,workUser,addProduct,baseImage,editProduct,updateProduct,searchProduct} from '../../api/index.js'
import {assign} from 'lodash'
import { constants } from 'zlib';
export default {
    name: 'product',
    data() {
        return {
            divShow:false,
            isshow:false,
            headerHeight:null,
            footerHeight:null,
            editTopHeight:null,
            max:20,
            offset: 1,
            total:0,
            isTop:true,
            currentPage: 0,
            productId:'',
            productTime:'',
            productData:[],
            tagsData:[],
            checkedTag:'',
            pickerOptions: {
                shortcuts: [
                {
                    text: '最近一周',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                    }
                },
                {
                    text: '最近一个月',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                    }
                },
                {
                    text: '最近三个月',
                    onClick (picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    picker.$emit('pick', [start, end])
                    }
                }
                ],
                disabledDate (time) {
                return time.getTime() > Date.now()
                }
            },
            languageData:[
                {checked:true,value:'英语'},
                {checked:false,value:'法语'},
                {checked:false,value:'德语'},
                {checked:false,value:'意大利'},
                {checked:false,value:'西班牙'},
                {checked:false,value:'日语'},
                {checked:false,value:'俄语'},
                {checked:false,value:'中文'},
            ],
            changelanguage:'英语',
            imgUrl:[],
            form: {
                url:addProduct,
                loading: false,
                rules: {},
                errors: {},
                fields: {
                    productTypeIdsString: [],
                    pictureListString: '',
                    auditStatus:'1',
                    onsale:'1',
                    level:'1',
                    userId:'',
                    brand:'',
                    factoryName:'',
                    sourceArea:'',
                    factoryNumber:'',
                    factoryCatalog:'',
                    uploadForbiden:'1',
                    sourceUrl:'',
                    comments:'',
                    cost:'',
                    shippingCost:'',
                    customCode:'',
                    engDesc:'',
                    declarePrice:'',
                    chDesc:'',
                    innerSku:'',
                    suitForGroup:'',
                    productMaterial:'',
                    packetMaterial:'',
                    metalType:'',
                    jewelType:'',
                    packageGrossWeight:'',
                    has_battery:false,
                    packageLong:'',
                    packageWidth:'',
                    packageHight:'',
                    inStore:'',
                    countPerPackage:'',
                    productItemTypeList:[
                        // {name:'',value:''},
                    ],
                    productItems:[
                        // {name:'',inventory:'',addPrice:'',pictureList:[],skuId:''} 
                    ],
                    englishproducttile:'',
                    englishproductkeywords:'',
                    englishproductkeydesc:'',
                    englishproductdesc:'',
                    frenchproducttile:'',
                    frenchproductkeywords:'',
                    frenchproductkeydesc:'',
                    frenchproductdesc:'',
                    germanproducttile:'',
                    germanproductkeywords:'',
                    germanproductkeydesc:'',
                    germanproductdesc:'',
                    italyproducttile:'',
                    italyproductkeywords:'',
                    italyproductkeydesc:'',
                    italyproductdesc:'',
                    spanishproducttile:'',
                    spanishproductkeywords:'',
                    spanishproductkeydesc:'',
                    spanishproductdesc:'',
                    japaneseproducttile:'',
                    japaneseproductkeywords:'',
                    japaneseproductkeydesc:'',
                    japaneseproductdesc:'',
                    russianproducttile:'',
                    russianproductkeywords:'',
                    russianproductkeydesc:'',
                    russianproductdesc:'',
                    chineseproducttile:'',
                    chineseproductkeywords:'',
                    chineseproductkeydesc:'',
                    chineseproductdesc:'',
                }
            },
            options:[],
            optionsd: [],
            productSel:[{
            name: 'Size',
            label: '尺寸 Size'
            }, {
            name: 'Color',
            label: '颜色 Color'
            }],
            auditData:[{
            value: '',
            label: '全部'
            }, {
            value: '1',
            label: '通过'
            },{
            value: '2',
            label: '待审核'
            }, {
            value: '3',
            label: '过滤'
            },{
            value: '4',
            label: '侵权'
            },{
            value: '5',
            label: '屏蔽'
            }],
            onsaleData:[{
            value: '',
            label: '全部'
            }, {
            value: '1',
            label: '上架'
            },{
            value: '2',
            label: '下架'
            }, {
            value: '3',
            label: '失效'
            }],
            levelData:[{
            value: '',
            label: '全部'
            }, {
            value: '1',
            label: '重点'
            },{
            value: '2',
            label: '原创'
            }, {
            value: '3',
            label: '海外'
            },{
            value: '4',
            label: '抓取'
            },{
            value: '5',
            label: '下载'
            }],
            // 搜索
            query:{
                valuecascader: '',
                marray: '',
                valued: '',
                inputbh:'',
                inputOther:'',
                audit_status:'',
                onsale:'',
                level:'',
            },
            // 适用人群
            applyData:[
                {
                value: 1,
                label: 'baby-boys'
                }, {
                value: 2,
                label: 'baby-girls'
                }, {
                value: 3,
                label: 'boys'
                }, {
                value: 4,
                label: 'gins'
                }, {
                value: 5,
                label: 'people'
                },{
                value: 6,
                label: 'mens'
                }, {
                value: 7,
                label: 'unisex-adult'
                }, {
                value: 8,
                label: 'unisex-bab'
                }, {
                value: 9,
                label: 'womens'
                }
            ],
            productNum:{},
            imgLineUrl:[],
            isItemIndex:-1,
        }
    },
    computed: {
        ...mapState({
            height: state => state.height.height,
        })
    },
    mounted() {
        this.$nextTick(() => {
            this.setHeight()
        })
        this.load();
        this.handleFocus();
        this.getWorkData();
    },
    methods: {
        setHeight:function(){
            const headerHeight = window.getComputedStyle(document.getElementById('headerPro')).height.slice(0, -2)
            const footerHeight = window.getComputedStyle(document.getElementById('footerPro')).height.slice(0, -2)
            const editTopHeight = window.getComputedStyle(document.getElementById('editTop')).height.slice(0, -2)
            this.headerHeight= headerHeight;
            this.footerHeight= footerHeight;
            this.editTopHeight= editTopHeight;
        },
        load(){
            const params = { pageSize: this.max, pageNum: this.offset};
            listProducts(params).then((res) => {
                this.total = res.total
                this.productData = res.list
                this.max = res.pageSize
                this.productNum = res;
            }).catch((error) => {

            }).then(() => {
            
            });
        },
        handleFocus(){
            const params = { };
            productList(params).then((res) => {
                this.options = res;
            }).catch((error) => {

            }).then(() => {
            
            });
        },
        getWorkData(){
            const params = {pageNum:1,pageSize:20 };
            workUser(params).then((res) => {
                this.optionsd=res.list;
            }).catch((error) => {

            }).then(() => {
            
            });
        },
        // 搜索
        onSearch(){
            this.offset=1;
            var cascaderStr = this.query.valuecascader==''?this.query.valuecascader:this.query.valuecascader.join(',')
            var marrayStr = this.query.marray==''?this.query.marray:this.query.marray.join(',')
            var params= assign({},this.query,{audit_status:Number(this.query.audit_status),onsale:Number(this.query.onsale),level:Number(this.query.level),valuecascader:cascaderStr,marray:marrayStr},{pageSize: this.max, pageNum: this.offset})
            searchProduct(params).then((res) => {
                this.total = res.total
                this.productData = res.list
                this.max = res.pageSize
                this.productNum = res;
            }).catch((error) => {

            }).then(() => {
            
            });
        },
        proSearch(value,type){
            if(type==='audit'){
                this.query.audit_status = value
            }
            if(type==='sale'){
                this.query.onsale = value
            }
            if(type==='level'){
                this.query.level = value
            }
            this.onSearch();
        },
        // 分页操作方法
        handlePage (val) {
            this.max = val
            this.offset++
             this.load()
        },
        handleCurPage (val) {
            this.currentPage = val - 1
            if (this.currentPage <= -1) {
                this.currentPage = 0
            }
            this.offset = val
             this.load()
        },
        onEdit(id){
            const params = { productId: id};
            editProduct(params).then((res) => {
                var date = new Date(res.creatTime);
                var time = date.getFullYear()+'-'+((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1))+'-'+(date.getDate()<10?'0'+date.getDate():date.getDate())+' '+(date.getHours()<10?'0'+date.getHours():date.getHours())+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+':'+(date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())
                this.productTime=time;
                this.productId=res.id;
                this.form.fields = assign({}, { ...res },{productTypeIdsString:res.productTypeIdsString.split(','),auditStatus:res.auditStatus.toString(),onsale:res.onsale.toString(),level:res.level.toString(),uploadForbiden:res.uploadForbiden.toString()})
                if(res.productItems.length>0){
                    this.divShow = true;
                }
                if(res.pictureListString){
                    this.imgUrl= [];
                    var imgArr = res.pictureListString.split(',');
                    for(var i=0;i<imgArr.length;i++){
                        this.imgUrl.push('http://wechatcool.xyz/ecommerce_backend/images/'+imgArr[i])
                    }
                }
                if(!(res.englishproducttile && res.englishproductkeywords && res.englishproductkeydesc && res.englishproductdesc && res.frenchproducttile && res.frenchproductkeywords && res.frenchproductkeydesc && res.frenchproductdesc && res.germanproducttile && res.germanproductkeywords && res.germanproductkeydesc && res.germanproductdesc && res.italyproducttile && res.italyproductkeywords && res.italyproductkeydesc && res.italyproductdesc && res.spanishproducttile && res.spanishproductkeywords && res.spanishproductkeydesc && res.spanishproductdesc && res.japaneseproducttile && res.japaneseproductkeywords && res.japaneseproductkeydesc && res.japaneseproductdesc && res.russianproducttile && res.russianproductkeywords && res.russianproductkeydesc && res.russianproductdesc && res.chineseproducttile && res.chineseproductkeywords && res.chineseproductkeydesc && res.chineseproductdesc)){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[0].checked=true;
                    this.changelanguage ='英语'
                }
                if(res.englishproducttile || res.englishproductkeywords || res.englishproductkeydesc || res.englishproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[0].checked=true;
                    this.changelanguage ='英语'
                }
                if(res.frenchproducttile || res.frenchproductkeywords || res.frenchproductkeydesc || res.frenchproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[1].checked=true;
                    this.changelanguage ='法语'
                }
                if(res.germanproducttile || res.germanproductkeywords || res.germanproductkeydesc || res.germanproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[2].checked=true;
                    this.changelanguage ='德语'
                }
                if(res.italyproducttile || res.italyproductkeywords || res.italyproductkeydesc || res.italyproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[3].checked=true;
                    this.changelanguage ='意大利'
                }
                if(res.spanishproducttile || res.spanishproductkeywords || res.spanishproductkeydesc || res.spanishproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[4].checked=true;
                    this.changelanguage ='西班牙'
                }
                if(res.japaneseproducttile || res.japaneseproductkeywords || res.japaneseproductkeydesc || res.japaneseproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[5].checked=true;
                    this.changelanguage ='日语'
                }
                if(res.russianproducttile || res.russianproductkeywords || res.russianproductkeydesc || res.russianproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[6].checked=true;
                    this.changelanguage ='俄语'
                }
                if(res.chineseproducttile || res.chineseproductkeywords || res.chineseproductkeydesc || res.chineseproductdesc){
                    for(var i=0;i<this.languageData.length;i++){
                        this.languageData[i].checked=false;
                    }
                    this.languageData[7].checked=true;
                    this.changelanguage ='中文'
                }
                
            }).catch((error) => {

            }).then(() => {
            
            });
        },
        //新增和编辑
        operate(type,data){
            this.isshow = true;
            this.isItemIndex='-1';
            this.$nextTick(() => {
                this.setHeight()
            })
            if(type==='edit'){
                this.isTop=true;
                this.checkedTag=data.id;
                if(this.tagsData.indexOf(data.id)==-1){
                    this.tagsData.push(data.id)
                }
                this.onEdit(data.id);
                this.form.url = updateProduct
            }else{
                this.isTop=false;
                this.divShow = false;
                this.checkedTag='新增'
                for(var i=0;i<this.languageData.length;i++){
                    this.languageData[i].checked=false;
                }
                this.languageData[0].checked=true;
                this.imgUrl=[];
                this.form.fields.pictureListString='';
                this.changelanguage=='英语'
                this.reset();
                this.form.url = addProduct
                if(this.tagsData.indexOf('新增')==-1){
                    this.tagsData.push('新增')
                }
            }
        },
        // 点击tags        
        handleClick(tag){
            this.checkedTag = tag;
            if(tag=='新增'){//新增
                this.isTop=false;
                for(var i=0;i<this.languageData.length;i++){
                    this.languageData[i].checked=false;
                }
                this.languageData[0].checked=true;
                this.imgUrl=[];
                this.form.fields.pictureListString='';
                this.changelanguage=='英语'
                this.reset();
                this.form.url = updateProduct
            }else{// 调回显的接口
                this.isTop=true;
                this.onEdit(tag);
                this.form.url = addProduct
            }
        },
        // 关闭tags
        handleClose(tag) {
            if(this.checkedTag==tag){
                for(var i=0;i<this.tagsData.length;i++){
                    if(this.tagsData[i]==tag){
                        if(i==0 && this.tagsData.length>1){
                            this.checkedTag = this.tagsData[1]
                            this.onEdit(this.checkedTag);
                        }else{
                            this.checkedTag = this.tagsData[i-1]
                            this.onEdit(this.checkedTag);
                        }
                        
                    }
                }
            }
            this.tagsData.splice(this.tagsData.indexOf(tag), 1);
            if(!this.tagsData.length){
                this.isshow = false;
                this.isTop=true;
                this.$nextTick(() => {
                    this.setHeight()
                })
            }else{
                this.$nextTick(() => {
                    this.setHeight()
                })
            }
        },
        //关闭右侧
        onclose(){
            this.isshow = false;
            this.$nextTick(() => {
                this.setHeight()
            })
        },
        //删除图片
        ondelImg(index){
            this.imgUrl.splice(index,1)
            var reg = new RegExp(baseImage,"g");
            var a = this.imgUrl.join(',').replace(reg,"");
            this.form.fields.pictureListString = a;
        },
        //上传图片
        uploadSuccess(response){
            if(response.status==200){
                var str = this.form.fields.pictureListString;
                if(str.indexOf(response.imageName)!=-1){
                    this.$notify({
                        message: '该图片已经上传过了！',
                        type: 'info'
                    })
                }else{
                    this.imgUrl.push(`${baseImage}${response.imageName}`);
                    this.form.fields.pictureListString +=','+response.imageName;
                    if (this.form.fields.pictureListString.substr(0,1)==','){
                        this.form.fields.pictureListString=this.form.fields.pictureListString.substr(1);
                    }
                    this.$notify({
                        message: '上传成功！',
                        type: 'success'
                    })
                }
            }else{
                this.$notify({
                    message: '上传失败！',
                    type: 'error'
                })
            }
        },
        onaddline(){
            if (this.form.fields.productItemTypeList.length < 3 ) {
                var arr = this.form.fields.productItemTypeList;
                var obj={name:'Size',value:''};
                arr.push(obj);
                this.form.fields.productItemTypeList=arr;
            }
        },
        //clear变体
        onclearline(index){
            var arrs = []
            for (var i = 0; i < this.form.fields.productItemTypeList.length; i++) {
                if (i != index) {
                arrs.push(this.form.fields.productItemTypeList[i])
                }
            }
            this.form.fields.productItemTypeList = arrs;
            if(this.form.fields.productItemTypeList.length>0){
                this.blurInputs();
            }
            else{
                this.divShow = false;
            }
        },
        lienArr(str){
            var re=str.replace(/,+/g,',');
            var res=re.replace(/(^,)|(,$)/g,'');
            return res.split(',');
        },
        blurInputs(){
            var arr = [];
            var lineArrO=[];
            var lineArrT=[];
            var lineArrTH=[];
            var arrline=[];
            var arrLines = [];
            lineArrO = this.form.fields.productItemTypeList.length>0?this.form.fields.productItemTypeList[0].value:'';
            lineArrT = this.form.fields.productItemTypeList.length>1?this.form.fields.productItemTypeList[1].value:'';
            lineArrTH = this.form.fields.productItemTypeList.length>2?this.form.fields.productItemTypeList[2].value:'';
            if(lineArrO!=''){
                lineArrO=this.lienArr(lineArrO);
                arr.push(lineArrO)
            }
            if(lineArrT!=''){
                lineArrT=this.lienArr(lineArrT);
                arr.push(lineArrT)
            }
            if(lineArrTH!=''){
                lineArrTH=this.lienArr(lineArrTH);
                arr.push(lineArrTH)
            }
            arrline = this.getArrayByArrays(arr)
            var hash=[];
            for (var m = 0; m < arrline.length; m++) {
                if(hash.indexOf(arrline[m])==-1){
                    hash.push(arrline[m]);
                }
            }
            for(var j=0;j<hash.length;j++){
                arrLines.push({name:hash[j],inventory:'',addPrice:'',pictureList:[],skuId:''});
            }
            this.form.fields.productItems = arrLines;
            if(this.form.fields.productItems.length>0){
                this.divShow = true;
            }
        },
        getArrayByArrays(arrays){
            var arr = [""];
            for(var i = 0;i<arrays.length;i++)
            {
                arr = this.getValuesByArray(arr,arrays[i]);
            }
            return arr;
        },
        getValuesByArray(arr1,arr2){
            var arr = [];
            for(var i=0;i<arr1.length;i++)
            {
                var v1 = arr1[i];
                for(var j=0;j<arr2.length;j++)
                {
                    var v2 = arr2[j];
                    if(v1 == ''){
                        var value = v2
                    }else{
                        var value = v1+'-'+v2;
                    }
                    
                    arr.push(value);
                };
            };
            return arr;
        },
        onkeychange(){
            for(var i=0;i<this.form.fields.productItemTypeList.length;i++){
                this.form.fields.productItemTypeList[i].value=this.form.fields.productItemTypeList[i].value.replace(/，/ig, ',')
            }
        },
        oncloneBox(){
            this.isItemIndex='-1';
        },
        onMaskImg(index){
            const imgUrl = this.imgUrl;
            var arr=[];
            for(var i=0;i<imgUrl.length;i++){
                arr.push({img:imgUrl[i],ischecked:false})
                if(this.form.fields.productItems[index].pictureList.length>0){
                    for(var j=0;j<this.form.fields.productItems[index].pictureList.length;j++){
                        if(imgUrl[i]==this.form.fields.productItems[index].pictureList[j]){
                            arr[i]={img:imgUrl[i],ischecked:true};
                        }
                    }
                }
            }
            this.imgLineUrl=arr;
            this.isItemIndex=index;
        },
        onChangeImg(index){
            if(this.imgLineUrl[index].ischecked){
                this.imgLineUrl[index].ischecked=false;
            }else{
                this.imgLineUrl[index].ischecked=true;
            }
            var arr = [];
            for(var i=0;i<this.imgLineUrl.length;i++){
                if(this.imgLineUrl[i].ischecked){
                    arr.push(this.imgLineUrl[i].img)
                }
            }
            this.form.fields.productItems[this.isItemIndex].pictureList=arr
        },
        // 选择语言
        onchangeLanguage(key,item){
            for(var i=0;i<this.languageData.length;i++){
                this.languageData[i].checked=false;
            }
            this.languageData[key].checked=true;
            this.changelanguage=item.value;
            this.form.fields.englishproducttile='';
            this.form.fields.englishproductkeywords='';
            this.form.fields.englishproductkeydesc='';
            this.form.fields.englishproductdesc='';
            this.form.fields.frenchproducttile='';
            this.form.fields.frenchproductkeywords='';
            this.form.fields.frenchproductkeydesc='';
            this.form.fields.frenchproductdesc='';
            this.form.fields.germanproducttile='';
            this.form.fields.germanproductkeywords='';
            this.form.fields.germanproductkeydesc='';
            this.form.fields.germanproductdesc='';
            this.form.fields.italyproducttile='';
            this.form.fields.italyproductkeywords='';
            this.form.fields.italyproductkeydesc='';
            this.form.fields.italyproductdesc='';
            this.form.fields.spanishproducttile='';
            this.form.fields.spanishproductkeywords='';
            this.form.fields.spanishproductkeydesc='';
            this.form.fields.spanishproductdesc='';
            this.form.fields.japaneseproducttile='';
            this.form.fields.japaneseproductkeywords='';
            this.form.fields.japaneseproductkeydesc='';
            this.form.fields.japaneseproductdesc='';
            this.form.fields.russianproducttile='';
            this.form.fields.russianproductkeywords='';
            this.form.fields.russianproductkeydesc='';
            this.form.fields.russianproductdesc='';
            this.form.fields.chineseproducttile='';
            this.form.fields.chineseproductkeywords='';
            this.form.fields.chineseproductkeydesc='';
            this.form.fields.chineseproductdesc='';

        },
        // 确认提交
        onSubmit(){
            this.$refs['form'].validate(valid => {
            if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(
                    () => {
                    this.form.loading = true
                    var params = {};
                    if(this.form.url==updateProduct){
                        params = assign({}, this.form.fields,{id:this.checkedTag})
                        params.productTypeIdsString = this.form.fields.productTypeIdsString.join(',')
                    }else{
                        params = assign({}, this.form.fields)
                        params.productTypeIdsString = this.form.fields.productTypeIdsString.join(',')
                    }
                    this.form
                        .url(params)
                        .then(response => {
                        this.load();
                        if (response.status ==200) {
                            this.form.loading = false
                            this.$notify({
                                title: '提示',
                                message: response.message,
                                type: 'success'
                            })
                            if(this.form.url==addProduct){
                                this.divShow = false;
                                this.reset();
                            }
                        }else{
                            this.form.loading = false
                            this.$notify({
                                title: '提示',
                                message: '提交失败！',
                                type: 'error'
                            })
                        }  
                        })
                        .catch(error => {
                            this.form.loading = false
                            this.$notify({
                                title: '提示',
                                message: error,
                                type: 'error'
                            })
                        })
                    },
                    () => {
                    this.$notify({
                        title: '提示',
                        message: '取消操作',
                        type: 'info'
                    })
                    }
                )
                }
            })
        },
        // 让产品标题首字母大写
        onFirstLetter(){
            if(this.changelanguage=='英语'){
                if(this.form.fields.englishproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.englishproducttile.slice(0,1);
                    var valE = this.form.fields.englishproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.englishproducttile=valS+valE;
                }
            }
            if(this.changelanguage=='法语'){
                 if(this.form.fields.frenchproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.frenchproducttile.slice(0,1);
                    var valE = this.form.fields.frenchproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.frenchproducttile=valS+valE;
                }
            }
            if(this.changelanguage=='德语'){
                 if(this.form.fields.germanproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.germanproducttile.slice(0,1);
                    var valE = this.form.fields.germanproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.germanproducttile=valS+valE;
                }
            }
            if(this.changelanguage=='意大利'){
                 if(this.form.fields.italyproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.italyproducttile.slice(0,1);
                    var valE = this.form.fields.italyproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.italyproducttile=valS+valE;
                }
            }
            if(this.changelanguage=='西班牙'){
                 if(this.form.fields.spanishproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.spanishproducttile.slice(0,1);
                    var valE = this.form.fields.spanishproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.spanishproducttile=valS+valE;
                }
            }
            if(this.changelanguage=='日语'){
                 if(this.form.fields.japaneseproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.japaneseproducttile.slice(0,1);
                    var valE = this.form.fields.japaneseproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.japaneseproducttile=valS+valE;
                }
            }
            if(this.changelanguage=='俄语'){
                 if(this.form.fields.russianproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.russianproducttile.slice(0,1);
                    var valE = this.form.fields.russianproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.russianproducttile=valS+valE;
                }
            }
            if(this.changelanguage=='中文'){
                 if(this.form.fields.chineseproducttile==''){
                    this.$notify({
                        title: '提示',
                        message: '还没有内容！',
                        type: 'info'
                    })
                }else{
                    var valS = this.form.fields.chineseproducttile.slice(0,1);
                    var valE = this.form.fields.chineseproducttile.slice(1);
                if(!(/^[A-Z]+$/.test(valS))){
                    valS =  valS.toUpperCase();
                }
                this.form.fields.chineseproducttile=valS+valE;
                }
            }
        },
        // 重置form表单
        reset: function () {
            this.form.fields = {
                productTypeIdsString: [],
                pictureListString: '',
                auditStatus:'1',
                onsale:'1',
                level:'1',
                userId:'',
                brand:'',
                factoryName:'',
                sourceArea:'',
                factoryNumber:'',
                factoryCatalog:'',
                uploadForbiden:'1',
                sourceUrl:'',
                comments:'',
                cost:'',
                shippingCost:'',
                customCode:'',
                engDesc:'',
                declarePrice:'',
                chDesc:'',
                innerSku:'',
                suitForGroup:'',
                productMaterial:'',
                packetMaterial:'',
                metalType:'',
                jewelType:'',
                packageGrossWeight:'',
                has_battery:false,
                packageLong:'',
                packageWidth:'',
                packageHight:'',
                inStore:'',
                countPerPackage:'',
                productItemTypeList:[
                    // {name:'',value:''},
                ],
                productItems:[
                    // {name:'',inventory:'',addPrice:'',pictureList:[],skuId:''} 
                ],
                englishproducttile:'',
                englishproductkeywords:'',
                englishproductkeydesc:'',
                englishproductdesc:'',
                frenchproducttile:'',
                frenchproductkeywords:'',
                frenchproductkeydesc:'',
                frenchproductdesc:'',
                germanproducttile:'',
                germanproductkeywords:'',
                germanproductkeydesc:'',
                germanproductdesc:'',
                italyproducttile:'',
                italyproductkeywords:'',
                italyproductkeydesc:'',
                italyproductdesc:'',
                spanishproducttile:'',
                spanishproductkeywords:'',
                spanishproductkeydesc:'',
                spanishproductdesc:'',
                japaneseproducttile:'',
                japaneseproductkeywords:'',
                japaneseproductkeydesc:'',
                japaneseproductdesc:'',
                russianproducttile:'',
                russianproductkeywords:'',
                russianproductkeydesc:'',
                russianproductdesc:'',
                chineseproducttile:'',
                chineseproductkeywords:'',
                chineseproductkeydesc:'',
                chineseproductdesc:'',
            }
        },
    },
};
</script>
<style>
.contentPro{
    width:150px!important;
}
.contentProOths{
    width:240px!important;
}
.tranSort{
    display:flex;
    margin:5px 0;
}
.tranSort>span{
    margin:0 10px;
    color: #5A738E;
    font-size:13px;
    cursor:pointer;
}
.tranSort>span>b{
    font-weight:normal;
}
.tranSortNow{
    color:red!important;
}
.proWrapper{
    overflow:hidden;
}
.proContent{
    overflow-y: auto;
    display:flex;
    flex-wrap:wrap;
}
.productItem{
    width:170px;
    height:234px;
    margin-left:10px;
    padding: 4px;
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.productImg{
    width:160px;
    height:160px;
}
.productImg>img{
    width:100%;
    height:100%;
}
.productText{
    font-size:13px;
    width:160px;
    overflow:hidden;
    word-wrap:break-word;
}
.productText p{
    height:25px;
    line-height:25px;
    margin-top:5px;
}
.productText p:nth-child(2){
    margin-left:10px;
    overflow: hidden;    
    text-overflow:ellipsis;    
    white-space: nowrap;
}
.productText p span:nth-child(1){
    float:left;
    margin-left:10px;
}
.productText p span:nth-child(1) b{
    color:blue;
}
.productText p span:nth-child(2){
    float:right;
    margin-right:10px;
}
.elTags{
    margin:5px;
    cursor:pointer;
}
.producBor{
    border-bottom: 1px solid #ddd;
}
.productInfoTop{
    padding:5px;
    display:flex;
    justify-content:space-between;
    font-size:14px;
}
.elCascaderEdit{
    width:100%;
}
.proElForm{
    margin-top:5px;
}
.textPrompt{
    font-size:13px;
    color: #e01a3e;
}
.editWrapper{
    overflow-y:auto;
}
.proContentelItem{
    display:flex;
}
.proContentelItem .el-form-item__content{
    width:100%;
    margin-left:0!important;
}
.brandAccount{
    line-height:40px;
    color: #999;
    font-size:13px;
    padding-left:10px;
}
.packSize{
    display:flex;
}
.packSize .el-form-item__content{
    margin-left:0!important;
    display:flex;
}
.productcm{
    display:inline-block;
    width:250px;
}
.addLine{
    color: blue;
    font-size:14px;
    font-weight:bold;
    margin-bottom:10px;
}
.languageStyle>span{
    margin:10px 5px;
    padding:2px 10px;
    font-size:13px;
    display:inline-block;
    border: 1px solid #ddd;
    border-radius: 3px;
    text-align: center;
    line-height:25px;
    cursor:pointer;
}
.checkedlang{
    background: #2A3F54;
    color: #fff;
}
.childrenBoxTop{
    display:inline-block;
    width:25%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size:14px;
    text-align:center;
}
.childrenBoxTopEx{
    display:inline-block;
    width:19.2%;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size:14px;
    text-align:center;
    margin-top:10px;
    overflow:hidden;
    word-wrap:break-word;
}
.childrenBoxTopExImg{
    display:inline-block;
    width:19.2%;
    height: 40px;
    line-height: 40px;
    position:relative;
}
.maskImgBox{
    position:absolute;
    bottom:55px;
    right:0;
    border: 1px solid #949296;
    background: #f0f5fa;
    z-index:100;
}
.maskImg{
    
    width: 504px;
    height: 252px;
    overflow-y: auto;
    overflow-x:hidden;
}
.maskTopTitle{
    display:flex;
    justify-content:space-between;
    align-items:center;
    color:#333;
    font-size:16px;
    padding:0 10px;
    border-bottom: 1px solid #ccc;
}
.maskImgItem{
    position:relative;
    display:inline-block;
    width:110px;
    height:110px;
    margin:5px;
}
.maskcheck{
    position:absolute;
    top:-10px;
    left:5px;
}
.maskImgCh{
    width:110px;
    height:110px;
}
.cloneImg{
    width:15px;
    height:15px;
    cursor:pointer;
}
.showImg{

}
.showImg>img{
    width:35px;
    height:35px;
    margin:2px;
}
.btnProduct{
    margin-bottom:10px;
}
#footerPro{
    padding-top:10px;
    padding-bottom:10px;
}
.imgWrapperPro>.el-form-item__content{
    display:flex;
    flex-wrap:wrap;
}
.avatar{
    width:148px;
    height:148px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    margin:0 5px 5px 0;
    position:relative;
    overflow:hidden;
}
.avatar>i{
    position:absolute;
    right:4px;
    top:4px;
    cursor:pointer;
    font-size:20px;
    color:#E63C3C;
}
.avatar>img{
    width:148px;
    height:148px;
    border-radius: 6px;
}
.textBriE>.el-form-item__label{
    color: blue!important;
}
.textBriE>.el-form-item__content>.el-input>.el-input__inner{
    color: blue!important;
}
.textBriC>.el-form-item__label{
    color: red!important;
}
.textBriC>.el-form-item__content>.el-input>.el-input__inner{
    color: red!important;
}
</style>