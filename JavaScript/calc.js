#! /usr/bin/nodejs
var assert = require("assert");

//solve linear equation group
function transform(equations) {
	for (var i in equations){
		var equation = equations[i];
		//step 1, transfer all patameter to left
		var splitted = equation.split("=");
		assert(splitted.length == 2, "All input must be euqations, this is not:" + equation + ".");

		equation = splitted[0] + "-(" + splitted[1] + ")";

		//step 2, postfix expression transform
		var poexp = [], operatorStack = [];
		var factor = 0;
		factor.flag = -1;// -1:no define, 0:positive, >0:fractional part
		var operators = {"+":"+", "-":"-", "*":"*", "/":"/", "(":"(", ")":")"};

		for( var it in equation){
			console.log(operatorStack)
			var c = equation[it];
			if(c== " ") 
				continue;

			if(c in operators){
				if(factor.flag != -1){
					poexp.push(factor);
					factor = 0;
					factor.flag = -1; 
				}

				if(c == "(") 
					operatorStack.push(c);
				else if(c=="*" || c=="/")
					while(operatorStack[operatorStack.length - 1] == "*" || operatorStack[operatorStack.length - 1] == "/")
						poexp.push(operatorStack.pop());
				else if(c=="+" || c == "-")
					while(operatorStack.length > 0 && operatorStack[operatorStack.length -1] != "(")
						poexp.push(operatorStack.pop());
				else if(c==")"){
					while(operatorStack[operatorStack.length -1] != "(")
						poexp.push(operatorStack.pop());
					operatorStack.pop();
				}

				
			}
			else if (c >= 0 && c<= 9){
				if(factor.flag = -1) 
					factor = c - "0";
				else factorFlag = factorFlag * 10 + c - "0";
			}
			else if((c >= "a" && c<= "z") || (c >= "A" && c<= "z"))
				poexp.push(c);
			else{

				assert(false, "unexpected operators:" + c + ".");
			}

				
		}
		console.log(poexp);
	}
}


function main() {
	console.log("Hello world!");
	var equations = [
		"1000 * 0.05 + a = (1000 - a)*0.05 + b",
		"a + b = 1000"];

	transform(equations);



}



main(process.argv);
