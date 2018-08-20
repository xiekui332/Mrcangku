//	初始化；
$(function () {
    	
	app.loading();
	if (api.isDebug) {
		newDetails();
	} else {
		$.ajax({
			url: api.NWBDApiGetWxTicket + "?r=" + Math.random(),
			type: "POST",
			async: false,
			data: {
				wxUrl: window.location.href
			},
			success: function (result) {
				console.log(result)
				app.closeLoading();
				if (result.status === "success" && result.code === 0) {
					wx.config({
						debug: api.isDebug,
						appId: result.data.AppID,
						timestamp: result.data.timestamp,
						nonceStr: result.data.noncestr,
						signature: result.data.signature,
						jsApiList: [
						'openLocation', 
						'hideAllNonBaseMenuItem',
						'hideOptionMenu',		//	隐藏分享菜单
						'checkJsApi',			//	
						'onMenuShareTimeline',	//	分享到朋友圈
						'onMenuShareAppMessage'	//	分享给朋友
						]
					});
					wx.ready(function () {
						newDetails();
						
						//新增分享
						// wx.checkJsApi({
						// 	jsApiList:['chooseImage'],	//	需要检测的JS接口列表
						// 	success:function(res){
						// 		console.log(res)
						// 	}
						// });
						// var id = getUrlParam('customerId');
						// var shareUrl = api.shareAdd + id;
						// var obj = {
						// 	//	朋友圈
						// 	title:'保宝车服——中国最好的维修地图，赶紧了解一下吧！',	//	标题
						// 	desc:'保宝车服——中国最好的维修地图，赶紧了解一下吧！',	//	描述
						// 	link:shareUrl,	//	分享链接
						// 	imgUrl:api.imgUrl,	//	分享图标
						// 	fail:function(res){
						// 		console.log(JSON.stringify(res))
						// 	},
						// 	success:function(){
						// 	},
						// 	cancel:function(){
						// 	}
						// };
						
						
						// if(!app.getItem('userInfo').id){
						// 	wx.hideAllNonBaseMenuItem();	//	隐藏所有非基础按钮
						// }else{
						// 	wx.onMenuShareTimeline(obj)	//	分享到朋友圈
						// 	wx.onMenuShareAppMessage(obj)	//	分享给朋友
						// }
					});
					wx.error(function () {
						alert("公众号页面授权失败");
						app.f_close();
					});
				} else {
					alert("获取授权失败：" + result.message);
					app.f_close();
				}
			},
			error: function () {
				alert("网络异常，请检查网络");
				app.f_close();
			}
		});
	}

	// var jsapi = document.createElement('script');
	// jsapi.charset = 'utf-8';
	// jsapi.src = 'https://webapi.amap.com/maps?v=1.4.7&key=e9d83bcf337ca24921e9af7aee928b4d&callback=onApiLoaded';
	// document.head.appendChild(jsapi);
});


var newDetails = function () {
	"use strict";

	var vm = new Vue({
		el: "#app",
		data: {
			s1:false,
			s2:false,
			s3:false,
			none:false,
			timeStatus: "",
			marchantGrade:[],
			up: false,
			marchantStatus:'',
			marchantJoin:'',
			marchantDetails:{}
		},
		methods: {
			init: function init() {
				var that = this;
				$('.slideRight').animate({ right: "0" }, 400);
				
				//	初次进入加载数据；
				that.firstIn();


			},
			seeImg: function seeImg(index, length) {
				var that = this;
				if (index === 0) {
					$('.newDetail_block').addClass('moveActive');
					that.showBtn = false;
					var h = $('.newDetail_block').height(),
						h2 = $('.info_time').height();
					$('.newDetail_block').animate({ top: 4.2 * length - 1.26 + "rem" }, 400);
					that.up = true;
				}
			},
			upImg: function upImg() {
				var that = this;
				$('.newDetail_block').animate({ top: "3.54rem" }, 400);
				that.up = false;
				that.showBtn = true;
			},
			firstIn(){
				var that_ = this;
				//当前页面保存维修厂信息
				var merchantData;
				var body = $('body');
				$("#app").css({'min-height': $(window).height() + 'px'});
				//  阻止微信拉动出现背景
				document.querySelector('body').addEventListener('touchmove', function(e) {
					if (!document.querySelector('.container').contains(e.target)) {
						e.preventDefault();
					}
				});

				//首次进入页面获取维修厂信息
				if (!app.getItem("merchant_id")) {
					alert("维修厂信息有变，请重新进入页面");
					window.location.href = "../QuickRepair/QuickRepair.html";
				};

				//	输出存储的车服门店定位距离；
				var send_juli = app.getItem("send_juli");
                	$(".send_juli").text(send_juli);

				$.ajax({
					type:'get',
					url:api.NWBDApiGetMerchantDetailInfo + "?merchant_id=" + app.getItem("merchant_id") + "&r=" + Math.random(),
					dataType: 'json',
					async:true,
					success:function(res){
						console.log(res)
						if(res.code == 0 && res.status == 'success'){
							if(res.data.length > 0){
								that_.marchantDetails = res.data[0];
								//	判断休息状态；
								if(that_.marchantDetails.working != ''){
									that_.timeStatus = '营业中';
									$('.detailStatus').addClass('icon_color');
								}else{
									that_.timeStatus = '休息中';
									$('.detailStatus').removeClass('icon_color');
								}
								//	判断评价星星数；
								var num = that_.marchantDetails.grade;
								for(var i = 0; i < num; i ++){
									that_.marchantGrade[i] = '../../images/icon5.png'
								}
								//	判断认证；
								switch(that_.marchantDetails.check_status){
									case 0:
									case 1:
									case 2: that_.marchantStatus = '已认证';
									that_.s2 = true;
									break;
									case 3: that_.marchantStatus = '审核中';
									that_.s2 = true;
									break;
								}

								// 判断加盟；
								if(that_.marchantDetails.company_join_status && that_.marchantDetails.company_join_status == 1){
									that_.marchantJoin = '加盟';
									that_.s3 = true;
								}
								
							}
						}
					},
					error:function(res){
						console.log(res)
					}
				});

				
			},

			//点击定位调用微信地图；
			wxPosition(){
				var that_ = this;
				//调用微信 js-sdk 查看维修厂地图
				that_.openLocation();
			},
			openLocation(){
				var that_ = this;
				var lat = that_.marchantDetails.lat;
				var lng = that_.marchantDetails.lng;
				if (!lat || !lng) {
					geocoder.getLocation(that_.marchantDetails.address_detail, function (status, result) {
						if (status === 'complete' && result.info === 'OK' && result.geocodes[0].location) {
							lat = result.geocodes[0].location.lat;
							lng = result.geocodes[0].location.lng;
							wx.openLocation({
								latitude: parseFloat(lat),
								longitude: parseFloat(lng),
								name: that_.marchantDetails.name,
								address: that_.marchantDetails.address_detail,
								scale: 28,
								infoUrl: '',
								fail() {
									alert("打开地图失败，请检查手机权限");
								}
							});
						} else {
							app.alert("该维修厂无法查看地图！");
							return;
						}
					});
				} else {
					wx.openLocation({
						latitude: parseFloat(lat),
						longitude: parseFloat(lng),
						name: that_.marchantDetails.name,
						address: that_.marchantDetails.address_detail,
						scale: 28,
						infoUrl: '',
						fail() {
							alert("打开地图失败，请检查手机权限");
						}
					});
				}
			}
		},
		mounted: function mounted() {
			var that = this;
			
			that.init();
		}
	});
}
