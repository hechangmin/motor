
/**
 * @brief   UUID
 * @author  Lanfei
 * @date	2013.8
 */

define({
	getUUID : function(h){
		h        = h || '';
		var dg   = new Date(1582, 10, 15, 0, 0, 0, 0);
		var dc   = new Date();
		var t    = dc.getTime() - dg.getTime();
		var tl   = this.getIntegerBits(t,0,31);
		var tm   = this.getIntegerBits(t,32,47);
		var thv  = this.getIntegerBits(t,48,59) + '1';
		var csar = this.getIntegerBits(this.rand(4095),0,7);
		var csl  = this.getIntegerBits(this.rand(4095),0,7);

		var n = this.getIntegerBits(this.rand(8191),0,7) +
				this.getIntegerBits(this.rand(8191),8,15) +
				this.getIntegerBits(this.rand(8191),0,7) +
				this.getIntegerBits(this.rand(8191),8,15) +
				this.getIntegerBits(this.rand(8191),0,15);
		return tl + h + tm + h + thv + h + csar + csl + h + n;
	},

	getIntegerBits : function(val,start,end){
		var base16 = this.returnBase(val,16);
		var quadArray = new Array();
		var quadString = '';
		var i = 0;
		for(i=0;i<base16.length;i++){
			quadArray.push(base16.substring(i,i+1));
		}
		for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
			if(!quadArray[i] || quadArray[i] == '') quadString += '0';
			else quadString += quadArray[i];
		}
		return quadString;
	},

	returnBase : function(number, base){
		var convert = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	    if (number < base) var output = convert[number];
	    else {
	        var MSD = '' + Math.floor(number / base);
	        var LSD = number - MSD*base;
	        if (MSD >= base) var output = this.returnBase(MSD,base) + convert[LSD];
	        else var output = convert[MSD] + convert[LSD];
	    }
	    return output;
	},

	rand : function(max){
		return Math.floor(Math.random() * max);
	}
});