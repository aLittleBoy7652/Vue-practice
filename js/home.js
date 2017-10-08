new Vue({
  el: '#app',
  data: {
  	cakeList: [],
  	currentPage: 1,
    cakeId: "",
    cakeMess: {},
    imgFlag: 1,
    timer: '',
    dialogFlag: false,
    cartList: [],
    isAllChecked: false,
    currentCake: '',
    delItem: false,
    totalMoney: 0,
    addressList: [],
    currentIndex: 0,
    insertItem: false,
    addressIndex: 0,
    newaddr: '',
    newtel: ''
  },
  mounted: function(){
  	this.$http.get("../json/cakeList.json").then((res) => {
  	  this.cakeList = res.body.result.list;
      this.calcuTotal();
  	}, (error) => {
  		console.log(error);
  	});

    this.$http.get("../json/addressList.json").then((res) => {
      this.addressList = res.body.result.list;
    }, (error) => {
      console.log(error);
    });
  },
  methods: {
    detail: function(cakeId){
      this.cakeId = cakeId;
      var _this = this;
      this.cakeList.forEach(function(item, index){
      	if (item.cakeId == _this.cakeId) {
      	  _this.cakeMess = item;
      	}
      });
      this.currentPage = 2;
      this.banner();
    },
    banner: function(){
      clearInterval(this.timer);
      this.imgFlag = 1;
      var _this = this;
      this.timer = setInterval(function(){
        if (_this.imgFlag == 3) {
          _this.imgFlag = 1;
        } else {
          _this.imgFlag++;
        }
      }, 3000);
    },
    succIncart: function(){
      var _this = this;
      var pushFlag = true;
      this.cartList.forEach(function(item){
        if (item.cakeId === _this.cakeMess.cakeId) {
          pushFlag = false;
          item.cakeQuantity++;
        } 
      });
      if (pushFlag) {this.cartList.push(this.cakeMess);}
      this.dialogFlag = true;
    },
    goIncart: function(){
      this.currentPage = 3;
      this.dialogFlag = false;
    },
    checkit: function(item){
      item.checked = !item.checked;
      if (!item.checked) {
        this.isAllChecked = false;
      }
      this.calcuTotal();
    },
    delConfirm:function(item){
      this.currentCake = item;
      this.delItem = true;
    },
    changeMoney: function (product,way) {
      if(way>0){
        product.cakeQuantity++;
      }else{
        product.cakeQuantity--;
        if(product.cakeQuantity<1){
          product.cakeQuantity=1;
        }
      }
      this.calcuTotal();
    },
    allCheck:function(){
      this.isAllChecked = !this.isAllChecked;
      var _this = this;
      this.cartList.forEach(function(item){
        item.checked = _this.isAllChecked;
      });
      this.calcuTotal();
    },
    calcuTotal:function(){
      this.totalMoney = 0;
      var _this = this;
      this.cartList.forEach(function (item) {
        if(item.checked){
          _this.totalMoney += item.cakeQuantity * item.cakePrice;
        }
      });
    },
    sure:function(){
      var index = this.cartList.indexOf(this.currentCake);
      this.cartList.splice(index,1);
      this.delItem = false;
      this.calcuTotal();
    },
    deleteItem: function(index){
      this.addressIndex = index;
      this.delItem = true;
    },
    submit: function(){
      var addrItem = {
        "address": this.newaddr,
        "tel": this.newtel,
        "default": false
      };
      this.addressList.push(addrItem);
      this.insertItem=false;
      this.newaddr = '';
      this.newtel = '';
    },
    sureIt: function(){
      this.addressList.splice(this.addressIndex, 1);
      this.delItem = false;
    },
  },
  filters: {
  	moneyFormat: function(value){
  	  return "￥" + value.toFixed(2);
  	}
  }
});