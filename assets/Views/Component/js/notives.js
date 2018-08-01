Vue.component("adve-block",{
    props:{
        arr:{
            type:Object,
            default: {}
        }
    },
    data(){
        return{

        }
    },
    computed:{
        
    },
    methods:{
        init:function(){
            var cont = $("#barrage");
			var contW = $("#barrage").width();
			var contH = $("#barrage").height();
			var startX, startY, sX, sY, moveX, moveY;
			var winW = $(window).width();
			var winH = $(window).height();
			var barrage_name = $("#barrage_name");
			var barrage_frame = $("#barrage_frame");
            var body = $("body");
            //	首次进来直接展示公告
			if(!sessionStorage.getItem("g") && localStorage.getItem("userInfo")){
				
				layer.open({
					title:'',
					style:'padding: 0!important;background: none!important;box-shadow:none;',
					content:`<div class='img_box'>
								<img src='../../images/img_gonggao.png'/>
							</div>
							<div class="line_shu"></div>
							<img src='../../images/icon_close.png' class="close_img" />
							`
                })
                
                //  关闭叉号
                $('.close_img').on('click',function(){
                    $('.layui-m-layer').hide();
                    //  出发蒙版的点击事件
                    $('.layui-m-layershade').trigger('click');
                    sessionStorage.setItem("g",1);
                })
				
			}else{
				$('.layui-m-layer').hide();
			}

            cont.on({ //绑定事件
				touchstart: function(e) {
					startX = e.originalEvent.targetTouches[0].pageX; //获取点击点的X坐标    
					startY = e.originalEvent.targetTouches[0].pageY; //获取点击点的Y坐标
					//console.log("startX="+startX+"************startY="+startY);
					sX = $(this).offset().left; //相对于当前窗口X轴的偏移量
					sY = $(this).offset().top; //相对于当前窗口Y轴的偏移量
					//console.log("sX="+sX+"***************sY="+sY);
					leftX = startX - sX; //鼠标所能移动的最左端是当前鼠标距div左边距的位置
					rightX = winW - contW + leftX; //鼠标所能移动的最右端是当前窗口距离减去鼠标距div最右端位置
					topY = startY - sY; //鼠标所能移动最上端是当前鼠标距div上边距的位置
					bottomY = winH - contH + topY; //鼠标所能移动最下端是当前窗口距离减去鼠标距div最下端位置                
				},
				touchmove: function(e) {
                    e.preventDefault();
                    e.stopPropagation();
					moveX = e.originalEvent.targetTouches[0].pageX; //移动过程中X轴的坐标
					moveY = e.originalEvent.targetTouches[0].pageY; //移动过程中Y轴的坐标
					//console.log("moveX="+moveX+"************moveY="+moveY);
					if(moveX < leftX) {
						moveX = leftX;
					}
					if(moveX > rightX) {
						moveX = rightX;
					}
					if(moveY < topY) {
						moveY = topY;
					}
					if(moveY > bottomY) {
						moveY = bottomY;
					}
					$(this).css({
						"left": moveX + sX - startX + 10,
						"top": moveY + sY - startY,
                        "height":".96rem"
					})
                },
                touchend:function(e){
                    // e.preventDefault();
                    e.stopPropagation();
                },
                click:function(){
                    layer.open({
                        title:'',
                        style:'padding: 0!important;background: none!important;box-shadow:none;',
                        content:`<div class='img_box'>
                                    <img src='../../images/img_gonggao.png'/>
                                </div>
                                <div class="line_shu"></div>
                                <img src='../../images/icon_close.png' class="close_img" />
                                `
                    })
                    //  关闭叉号
                    $('.close_img').on('click',function(){
                        $('.layui-m-layer').hide();
                        //  出发蒙版的点击事件
                        $('.layui-m-layershade').trigger('click');
                    })
                }
                

			})
        }
    },
    template:
    `
    <div class="barrage" id="barrage">
        <div class="barrage_name" id="barrage_name">
            
                <img src="../../images/icon_huodong.gif" />
            
        </div>
    </div>
    `
})