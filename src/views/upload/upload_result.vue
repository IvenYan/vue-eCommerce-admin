<template>
<div :style="{'height':height+'px'}" class="proWrapper">
	<el-row>
		<!-- 左边列表 -->
		<el-col :span="isshow?12:24">
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-button type="primary" v-on:click="handleCurrentChange">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCurrentChange">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="amazonUploadResultsJson" ref="amazonUploadResultsJson"  :fit="true" highlight-current-row v-loading="listLoading" 
			 style="width: 100%;" @row-click="operate">
				<!-- <el-table-column type="selection" width="55">
				</el-table-column> -->
				<el-table-column prop="batchno" label="批号" type="index" width="60" >
				</el-table-column>
				<el-table-column prop="amazonaccount" label="开通账号"  sortable>
				</el-table-column>
				<el-table-column prop="accountid" label="账户编号" sortable>
				</el-table-column>
				<el-table-column prop="uploadtype" label="类型"  sortable>
				</el-table-column>
				<el-table-column prop="uploadtypedesc" label="说明" >
				</el-table-column>
				<el-table-column prop="uploadproductcounts" label="数量" sortable>
				</el-table-column>
				<el-table-column prop="uploaderror" label="错误" >
				</el-table-column>
				<el-table-column prop="uploadwarn" label="警告" >
				</el-table-column>
				<el-table-column prop="status" label="状态" >
				</el-table-column>
				<el-table-column  prop="createdate"  width="300"  label="提交时间"  >
					<!--<img width="10%" src="products.merchantProductImageName" />-->
				</el-table-column>
				<!-- <el-table-column label="操作" width="200"  >
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.row.merchantProductId, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column> -->

			</el-table>

        
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<!-- <el-button type="danger" @click="batchRemove" :disabled="true">批量删除</el-button> -->
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
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
                    <div v-if="true" class="producBor productInfoTop">
                        <span>产品编号：{{productId}}</span>
                        <span>添加时间：{{productTime}}</span>
                    </div>
                </div>
                <!-- <div :style="{'height':height-editTopHeight+'px'}" class="editWrapper">
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
                </div> -->
            </el-col>
	</el-row>
</div>
</template>

<script>
import {amazonUploadResults} from '../../api/index.js'
export default {
    data(){
        return{
			isshow:false,
            total: 0,
            page: 1,
            pageSize:20,
            // 结果
            amazonUploadResultsJson:[]
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
    methods:{
        // 初始化ID
        load(){
            const params = { pageSize: this.max, pageNum: this.offset};
            listProducts(params).then((res) => {
                this.total = res.total
                this.max = res.pageSize
                this.productNum = res;
            }).catch((error) => {

            }).then(() => {
            
            });
        },
        setHeightsetHeight:function(){
            const headerHeight = window.getComputedStyle(document.getElementById('headerPro')).height.slice(0, -2)
            const footerHeight = window.getComputedStyle(document.getElementById('footerPro')).height.slice(0, -2)
            const editTopHeight = window.getComputedStyle(document.getElementById('editTop')).height.slice(0, -2)
            this.headerHeight= headerHeight;
            this.footerHeight= footerHeight;
            this.editTopHeight= editTopHeight;
        },
        operate(row){
            this.isshow=true;
            // const a=this.$refs.amazonUploadResultsJson.toggleRowSelection(row);
            console.log(JSON.stringify(row));
		},
        handleCurrentChange(val) {
            console.log(JSON.stringify(val));
            this.page = val;
            this.getUploadResultsFunction();
        },
        getUploadResultsFunction(){
            const params = { pageSize: this.pageSize, pageNum: this.page};
            amazonUploadResults(params).then((res) => {
                console.log(res);
                if(res.totalNum >= 1){
                    // this.$message({
                    //     message: '提交成功',
                    //     type: 'success'
                    // });
                    // this.clearFrom();
                    console.log("OK");
                    this.total=res.totalNum;
                    this.page=res.currentPage;
                    this.amazonUploadResultsJson=res.items;
                    
                }
            }).catch((error) => {
                this.$message.error('提交失败');
            }).then(() => {

            });
        }
    },
		mounted() {
			console.log("上传结果页面-调试");
            this.getUploadResultsFunction();
		}
}
</script>

